import React, { useState } from 'react';
import workshopData from './data/workshops.json';

const WorkshopMap = () => {
  const [hoveredWorkshop, setHoveredWorkshop] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);

  // Define constants for radii
  const innerRadius = 250;
  const outerRadius = 450;
  const categoryLabelRadius = innerRadius + 50;

  // Get core tags from the JSON data
  const CORE_TAGS = workshopData.coreTags;
  
  // Organize workshops by primary category
  const workshops = workshopData.workshops.reduce((acc, workshop) => {
    if (!acc[workshop.primary]) {
      acc[workshop.primary] = [];
    }
    acc[workshop.primary].push(workshop);
    return acc;
  }, {});

  // Get categories from the JSON data
  const { categories } = workshopData;

  // Calculate angles for each category
  const totalWorkshops = Object.values(workshops).reduce((sum, categoryWorkshops) => sum + categoryWorkshops.length, 0);
  let currentAngle = 0;

  Object.keys(categories).forEach(category => {
    const categoryWorkshops = workshops[category] || [];
    const proportion = categoryWorkshops.length / totalWorkshops;
    categories[category].startAngle = currentAngle;
    categories[category].endAngle = currentAngle + (proportion * 2 * Math.PI);
    currentAngle += proportion * 2 * Math.PI;
  });

  // Helper function to get workshop angle - moved inside component
  const getWorkshopAngle = (workshopId) => {
    for (const [category, ws] of Object.entries(workshops)) {
      const workshop = ws.find(w => w.id === workshopId);
      if (workshop) {
        const index = ws.indexOf(workshop);
        const categoryData = categories[category];
        const angleStep = (categoryData.endAngle - categoryData.startAngle) / (ws.length + 1);
        return categoryData.startAngle + angleStep * (index + 1);
      }
    }
    return 0;
  };

  const getPointOnCircle = (angle, radius) => {
    return {
      x: Math.cos(angle) * radius + 600,
      y: Math.sin(angle) * radius + 600
    };
  };

  // Helper to get all unique tags from workshops
  const getAllUniqueTags = () => {
    const tags = new Set();
    Object.values(workshops).forEach(categoryWorkshops => {
      categoryWorkshops.forEach(workshop => {
        workshop.tags.forEach(tag => tags.add(tag));
      });
    });
    return Array.from(tags).sort();
  };

  // Helper to find workshops with shared tags
  const getWorkshopsWithTag = (tag) => {
    const matches = [];
    Object.values(workshops).forEach(categoryWorkshops => {
      categoryWorkshops.forEach(workshop => {
        if (workshop.tags.includes(tag)) {
          matches.push(workshop.id);
        }
      });
    });
    return matches;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Tag filter buttons in a grid above the visualization */}
      <div className="p-4 grid grid-cols-7 gap-2 bg-gray-900">
        {CORE_TAGS.map(tag => (
          <button
            key={tag}
            className={`px-3 py-1 rounded-full text-sm transition-all duration-200 ${
              selectedTag === tag 
                ? 'bg-white text-black' 
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
            onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Main visualization with workshops around the perimeter */}
      <div className="flex-1 relative">
        <svg viewBox="0 0 1200 1200" className="w-full h-full">
          {/* Pie sections for main categories */}
          {Object.entries(categories).map(([category, { color, startAngle, endAngle }]) => {
            const path = `
              M ${600} ${600}
              L ${getPointOnCircle(startAngle, outerRadius).x} ${getPointOnCircle(startAngle, outerRadius).y}
              A ${outerRadius} ${outerRadius} 0 ${endAngle - startAngle > Math.PI ? 1 : 0} 1 
              ${getPointOnCircle(endAngle, outerRadius).x} ${getPointOnCircle(endAngle, outerRadius).y}
              Z
            `;

            return (
              <g key={category}>
                <path
                  d={path}
                  fill={color}
                  opacity="0.2"
                />
                {/* Category label closer to center */}
                <text
                  x={getPointOnCircle((startAngle + endAngle) / 2, categoryLabelRadius).x}
                  y={getPointOnCircle((startAngle + endAngle) / 2, categoryLabelRadius).y}
                  fill={color}
                  fontSize="28"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {category}
                </text>

                {/* Workshop items around the perimeter */}
                {workshops[category].map((workshop, index) => {
                  const angleStep = (endAngle - startAngle) / (workshops[category].length + 1);
                  const angle = startAngle + angleStep * (index + 1);
                  const point = getPointOnCircle(angle, outerRadius - 20);
                  
                  const isHighlighted = selectedTag ? workshop.tags.includes(selectedTag) : false;
                  const scale = isHighlighted ? 1.5 : 1;

                  return (
                    <g 
                      key={workshop.id}
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredWorkshop(workshop)}
                      onMouseLeave={() => setHoveredWorkshop(null)}
                      style={{
                        transform: `scale(${scale})`,
                        transformOrigin: `${point.x}px ${point.y}px`
                      }}
                    >
                      <text
                        x={point.x}
                        y={point.y}
                        fontSize="24"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="select-none"
                      >
                        {workshop.icon}
                      </text>
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
                    </g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default WorkshopMap;