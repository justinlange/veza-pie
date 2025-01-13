import React, { useState, useEffect } from 'react';
import workshopData from './data/workshops.json';

const WorkshopMap = () => {
  // State
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [visibleConnections, setVisibleConnections] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('workshopFavorites');
    return saved ? JSON.parse(saved) : [];
  });

  // Constants for the visualization
  const innerRadius = 250;
  const outerRadius = 450;
  const categoryLabelRadius = innerRadius + 50;

  // Organize workshops by primary category
  const workshops = workshopData.workshops.reduce((acc, workshop) => {
    if (!acc[workshop.primary]) {
      acc[workshop.primary] = [];
    }
    acc[workshop.primary].push(workshop);
    return acc;
  }, {});

  // Get categories and calculate angles
  const { categories } = workshopData;
  const totalWorkshops = Object.values(workshops).reduce((sum, categoryWorkshops) => sum + categoryWorkshops.length, 0);
  let currentAngle = 0;

  Object.keys(categories).forEach(category => {
    const categoryWorkshops = workshops[category] || [];
    const proportion = categoryWorkshops.length / totalWorkshops;
    categories[category].startAngle = currentAngle;
    categories[category].endAngle = currentAngle + (proportion * 2 * Math.PI);
    currentAngle += proportion * 2 * Math.PI;
  });

  // Helper function to get point coordinates on the circle
  const getPointOnCircle = (angle, radius) => ({
    x: 600 + radius * Math.cos(angle),
    y: 600 + radius * Math.sin(angle)
  });

  // Helper function to find related workshops
  const getRelatedWorkshops = (workshop) => {
    return workshopData.workshops.filter(w => 
      w.id !== workshop.id && 
      w.tags.some(tag => workshop.tags.includes(tag))
    );
  };

  // Simplified popup that doesn't list all related workshops
  const WorkshopPopup = ({ workshop }) => (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm">
      <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
        {workshop.icon} {workshop.name}
      </h2>
      <p className="text-gray-400 mb-2">Workshop #{workshop.id}</p>
      <p className="text-gray-300">{workshop.desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {workshop.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-gray-700 rounded-full text-sm text-white">
            {tag}
          </span>
        ))}
      </div>
      <button 
        onClick={() => setSelectedWorkshop(null)}
        className="absolute top-2 right-2 text-gray-400 hover:text-white"
      >
        ✕
      </button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 p-4">
      {/* Tag filter buttons */}
      <div className="p-4 grid grid-cols-7 gap-2">
        {workshopData.coreTags.map(tag => (
          <button
            key={tag}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTag === tag ? 'bg-white text-black' : 'bg-gray-800 text-white'
            }`}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Main visualization */}
      <svg viewBox="0 0 1200 1200" className="w-full h-full">
        {/* Connection lines for selected workshop */}
        {selectedWorkshop && visibleConnections.map(({ from, to, tags }, index) => {
          const fromAngle = categories[from.primary].startAngle + 
            (workshops[from.primary].indexOf(from) / workshops[from.primary].length) * 
            (categories[from.primary].endAngle - categories[from.primary].startAngle);
          const toAngle = categories[to.primary].startAngle + 
            (workshops[to.primary].indexOf(to) / workshops[to.primary].length) * 
            (categories[to.primary].endAngle - categories[to.primary].startAngle);
          
          const fromPoint = getPointOnCircle(fromAngle, outerRadius);
          const toPoint = getPointOnCircle(toAngle, outerRadius);
          
          return (
            <g key={`connection-${index}`}>
              <path
                d={`M ${fromPoint.x} ${fromPoint.y} Q ${600} ${600} ${toPoint.x} ${toPoint.y}`}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
                fill="none"
              />
            </g>
          );
        })}

        {/* Categories and workshops */}
        {Object.entries(categories).map(([category, { color, startAngle, endAngle }]) => (
          <g key={category}>
            <path
              d={`
                M ${600} ${600}
                L ${getPointOnCircle(startAngle, outerRadius).x} ${getPointOnCircle(startAngle, outerRadius).y}
                A ${outerRadius} ${outerRadius} 0 ${endAngle - startAngle > Math.PI ? 1 : 0} 1 
                ${getPointOnCircle(endAngle, outerRadius).x} ${getPointOnCircle(endAngle, outerRadius).y}
                Z
              `}
              fill={color}
              opacity="0.2"
            />
            
            {/* Workshops */}
            {workshops[category]?.map((workshop, index) => {
              const angle = startAngle + (index + 0.5) * (endAngle - startAngle) / workshops[category].length;
              const point = getPointOnCircle(angle, outerRadius - 20);
              
              // Show workshop if it matches selected tag or is connected to selected workshop
              const isTagVisible = selectedTag ? workshop.tags.includes(selectedTag) : false;
              const isConnected = selectedWorkshop ? 
                workshop.tags.some(tag => selectedWorkshop.tags.includes(tag)) : false;
              const isSelected = selectedWorkshop?.id === workshop.id;
              const isVisible = isTagVisible || isConnected || isSelected;

              return (
                <g 
                  key={workshop.id}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => {
                    if (isSelected) {
                      setSelectedWorkshop(null);
                      setVisibleConnections([]);
                    } else {
                      setSelectedWorkshop(workshop);
                      const related = getRelatedWorkshops(workshop);
                      setVisibleConnections(related.map(r => ({
                        from: workshop,
                        to: r,
                        tags: r.tags.filter(tag => workshop.tags.includes(tag))
                      })));
                    }
                  }}
                >
                  <text
                    x={point.x}
                    y={point.y}
                    fontSize="24"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="select-none"
                    style={{
                      opacity: isVisible ? 1 : 0.3
                    }}
                  >
                    {workshop.icon}
                  </text>
                  
                  {isVisible && (
                    <text
                      x={point.x}
                      y={point.y}
                      transform={`
                        rotate(${(angle * 180 / Math.PI) % 360}, ${point.x}, ${point.y})
                        ${angle > Math.PI / 2 && angle < 3 * Math.PI / 2 ? 'rotate(180,' + point.x + ',' + point.y + ')' : ''}
                      `}
                      fill="white"
                      fontSize="12"
                      textAnchor={angle > Math.PI / 2 && angle < 3 * Math.PI / 2 ? "end" : "start"}
                      dy={angle > Math.PI / 2 && angle < 3 * Math.PI / 2 ? "-15" : "15"}
                      className="select-none"
                    >
                      {workshop.name}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        ))}
      </svg>

      {/* Simplified popup */}
      {selectedWorkshop && <WorkshopPopup workshop={selectedWorkshop} />}
    </div>
  );
};

export default WorkshopMap;