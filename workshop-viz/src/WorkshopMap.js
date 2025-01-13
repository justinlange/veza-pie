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

  // Get workshops and categories from the JSON data
  const { workshops, categories } = workshopData;

  // Define our core 21 tags that will be used across workshops
  // // const CORE_TAGS = [
  // //   // Technology & Business (6)
  // //   'AI & Machine Learning',
  // //   'Blockchain & Web3',
  // //   'Digital Creation',
  // //   'Business Strategy',
  // //   'Product Development',
  // //   'Data Analytics',

  // //   // Body & Mind (5)
  // //   'Movement Practice',
  // //   'Somatic Awareness',
  // //   'Mental Models',
  // //   'Emotional Intelligence',
  // //   'Physical Training',

  // //   // Spirit & Consciousness (5)
  // //   'Meditation',
  // //   'Altered States',
  // //   'Sacred Connection',
  // //   'Energy Work',
  // //   'Ritual Practice',

  // //   // Community & Expression (5)
  // //   'Group Facilitation',
  // //   'Creative Process',
  // //   'Leadership',
  // //   'Community Building',
  // //   'Storytelling'
  // // ];

  // // First, define the workshops object
  // const workshops = {
  //   TECH: [
  //     { 
  //       id: 1, 
  //       icon: "🤖", 
  //       name: "Learn AI Practical Use", 
  //       desc: "Hands-on artificial intelligence training",
  //       tags: ['AI & Machine Learning', 'Business Strategy', 'Digital Creation']
  //     },
  //     { 
  //       id: 2, 
  //       icon: "⛏️", 
  //       name: "Blockchain Mining", 
  //       desc: "Cryptocurrency mining deep-dive",
  //       tags: ['Blockchain & Web3', 'Data Analytics', 'Business Strategy']
  //     },
  //     { 
  //       id: 3, 
  //       icon: "🧠", 
  //       name: "Hypnotize LLM's", 
  //       desc: "AI language model manipulation",
  //       tags: ['AI & Machine Learning', 'Mental Models', 'Digital Creation']
  //     },
  //     { 
  //       id: 10, 
  //       icon: "🤖", 
  //       name: "Learn AI", 
  //       desc: "Hands-on artificial intelligence training",
  //       tags: ['AI & Machine Learning', 'Digital Creation', 'Mental Models']
  //     },
  //     { 
  //       id: 35, 
  //       icon: "⛏️", 
  //       name: "Mining", 
  //       desc: "Cryptocurrency mining deep-dive",
  //       tags: ['Blockchain & Web3', 'Data Analytics', 'Business Strategy']
  //     },
  //     { 
  //       id: 87, 
  //       icon: "🧠", 
  //       name: "LLMs", 
  //       desc: "AI language model manipulation",
  //       tags: ['AI & Machine Learning', 'Digital Creation', 'Product Development']
  //     },
  //     { 
  //       id: 42, 
  //       icon: "🔒", 
  //       name: "CyberSec", 
  //       desc: "Digital security fundamentals",
  //       tags: ['Digital Creation', 'Mental Models', 'Data Analytics']
  //     }
  //   ],
  //   BIZ: [
  //     { 
  //       id: 1, 
  //       icon: "💰", 
  //       name: "CryptoInvest", 
  //       desc: "Financial education on cryptocurrency investments",
  //       tags: ['Blockchain & Web3', 'Business Strategy', 'Mental Models']
  //     },
  //     { 
  //       id: 6, 
  //       icon: "🚀", 
  //       name: "LaunchProd", 
  //       desc: "Business development in untapped markets",
  //       tags: ['Product Development', 'Business Strategy', 'Leadership']
  //     },
  //     { 
  //       id: 23, 
  //       icon: "📊", 
  //       name: "Growth Metrics", 
  //       desc: "Data-driven business scaling",
  //       tags: ['Data Analytics', 'Business Strategy', 'Mental Models']
  //     }
  //   ],
  //   BOD: [
  //     {
  //       id: 55,
  //       icon: "🌱",
  //       name: "Food Systems",
  //       desc: "Holistic nutrition approach",
  //       tags: ['Physical Training', 'Somatic Awareness', 'Energy Work']
  //     },
  //     {
  //       id: 66,
  //       icon: "🫁",
  //       name: "Breath Mastery",
  //       desc: "Advanced breathing techniques",
  //       tags: ['Movement Practice', 'Meditation', 'Somatic Awareness']
  //     },
  //     {
  //       id: 12,
  //       icon: "🧘‍♀️",
  //       name: "Movement Flow",
  //       desc: "Integrated movement practices",
  //       tags: ['Movement Practice', 'Somatic Awareness', 'Physical Training']
  //     }
  //   ],
  //   MIND: [
  //     {
  //       id: 72,
  //       icon: "🎭",
  //       name: "EQ Training",
  //       desc: "Emotional intelligence development",
  //       tags: ['Emotional Intelligence', 'Leadership', 'Group Facilitation']
  //     },
  //     {
  //       id: 81,
  //       icon: "🧩",
  //       name: "Systems Think",
  //       desc: "Complex systems analysis",
  //       tags: ['Mental Models', 'Data Analytics', 'Business Strategy']
  //     },
  //     {
  //       id: 15,
  //       icon: "🎯",
  //       name: "Decision Making",
  //       desc: "Advanced decision-making frameworks",
  //       tags: ['Mental Models', 'Emotional Intelligence', 'Leadership']
  //     }
  //   ],
  //   SEX: [
  //     {
  //       id: 91,
  //       icon: "❤️",
  //       name: "Relating",
  //       desc: "Authentic relationship building",
  //       tags: ['Emotional Intelligence', 'Group Facilitation', 'Sacred Connection']
  //     },
  //     {
  //       id: 92,
  //       icon: "🌟",
  //       name: "Sacred Sex",
  //       desc: "Spiritual sexuality practices",
  //       tags: ['Sacred Connection', 'Energy Work', 'Somatic Awareness']
  //     },
  //     {
  //       id: 93,
  //       icon: "⚧",
  //       name: "Gender Studies",
  //       desc: "Understanding gender dynamics",
  //       tags: ['Community Building', 'Emotional Intelligence', 'Storytelling']
  //     }
  //   ],
  //   SPIR: [
  //     {
  //       id: 101,
  //       icon: "🧘",
  //       name: "Deep Med",
  //       desc: "Advanced meditation practices",
  //       tags: ['Meditation', 'Energy Work', 'Sacred Connection']
  //     },
  //     {
  //       id: 102,
  //       icon: "🌀",
  //       name: "Consciousness",
  //       desc: "Exploring altered states",
  //       tags: ['Altered States', 'Ritual Practice', 'Sacred Connection']
  //     },
  //     {
  //       id: 103,
  //       icon: "🕯️",
  //       name: "Ritual",
  //       desc: "Creating sacred ceremonies",
  //       tags: ['Ritual Practice', 'Community Building', 'Sacred Connection']
  //     }
  //   ],
  //   COMM: [
  //     {
  //       id: 111,
  //       icon: "🤝",
  //       name: "Facilitation",
  //       desc: "Group process leadership",
  //       tags: ['Group Facilitation', 'Leadership', 'Community Building']
  //     },
  //     {
  //       id: 112,
  //       icon: "🏘️",
  //       name: "Community",
  //       desc: "Intentional community design",
  //       tags: ['Community Building', 'Leadership', 'Storytelling']
  //     },
  //     {
  //       id: 113,
  //       icon: "🗣️",
  //       name: "Deep Share",
  //       desc: "Authentic communication practice",
  //       tags: ['Storytelling', 'Emotional Intelligence', 'Group Facilitation']
  //     }
  //   ],
  //   ART: [
  //     {
  //       id: 121,
  //       icon: "🎨",
  //       name: "Creative Flow",
  //       desc: "Accessing creative states",
  //       tags: ['Creative Process', 'Altered States', 'Emotional Intelligence']
  //     },
  //     {
  //       id: 122,
  //       icon: "🎬",
  //       name: "Digital Media",
  //       desc: "Modern content creation",
  //       tags: ['Digital Creation', 'Creative Process', 'Storytelling']
  //     },
  //     {
  //       id: 123,
  //       icon: "🎭",
  //       name: "Performance",
  //       desc: "Embodied expression arts",
  //       tags: ['Creative Process', 'Movement Practice', 'Storytelling']
  //     }
  //   ]
  // };

  // // Then define helper functions
  // const getTotalWorkshops = (workshops) => {
  //   return Object.values(workshops).reduce((sum, arr) => sum + arr.length, 0);
  // };

  // // Then define categories
  // const categories = {
  //   TECH: { 
  //     color: '#00BCD4', 
  //     startAngle: 0
  //   },
  //   BIZ: { 
  //     color: '#FF4081',
  //     startAngle: 0
  //   },
  //   BOD: { 
  //     color: '#7C4DFF',
  //     startAngle: 0
  //   },
  //   MIND: { 
  //     color: '#FFD700',
  //     startAngle: 0
  //   },
  //   SEX: { 
  //     color: '#FF6B6B',
  //     startAngle: 0
  //   },
  //   SPIR: { 
  //     color: '#4CAF50',
  //     startAngle: 0
  //   },
  //   COMM: { 
  //     color: '#FF9800',
  //     startAngle: 0
  //   },
  //   ART: { 
  //     color: '#E91E63',
  //     startAngle: 0
  //   }
  // };

  // Calculate angles based on workshop counts
  const totalWorkshops = Object.values(workshops).reduce((sum, arr) => sum + arr.length, 0);
  let currentAngle = 0;
  
  Object.entries(categories).forEach(([category, data]) => {
    const workshopCount = workshops[category].length;
    const proportion = workshopCount / totalWorkshops;
    
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
                        transform={`rotate(${(angle * 180 / Math.PI) % 360}, ${point.x}, ${point.y})`}
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