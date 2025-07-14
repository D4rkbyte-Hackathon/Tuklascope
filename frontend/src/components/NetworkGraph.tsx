import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { SkillNode, SkillLink } from '../types/skills';

interface NetworkGraphProps {
  data: {
    nodes: SkillNode[];
    links: SkillLink[];
  };
  onNodeClick: (node: SkillNode) => void;
  width: number;
  height: number;
}

const PADDING = 30;
const LABEL_BUFFER = 22;
const USER_RADIUS = 40;
const CATEGORY_RADIUS = 28;
const SKILL_RADIUS = 18;

function getNodeRadius(node: any) {
  if (node.type === 'user') return USER_RADIUS;
  if (node.type === 'category') return CATEGORY_RADIUS;
  return SKILL_RADIUS;
}

const clampNode = (x: number, y: number, node: any, width: number, height: number) => {
  const r = getNodeRadius(node);
  const clampedX = Math.max(PADDING + r, Math.min(x, width - PADDING - r));
  const clampedY = Math.max(PADDING + r + LABEL_BUFFER, Math.min(y, height - PADDING - r - LABEL_BUFFER));
  return { x: clampedX, y: clampedY };
};

const NetworkGraph: React.FC<NetworkGraphProps> = ({ data, onNodeClick, width, height }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [simulation, setSimulation] = useState<any>(null);

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Dynamically calculate radii so everything fits
    const minDim = Math.min(width, height);
    const maxCategoryCount = Math.max(data.nodes.length, 1);
    const maxSkillCount = Math.max(...data.nodes.map(cat => cat.skills.length || 1), 1);
    // Leave room for user node, category, skill, and label
    const maxAllowedRadius = (minDim / 2) - (PADDING + USER_RADIUS + CATEGORY_RADIUS + SKILL_RADIUS + LABEL_BUFFER);
    // If there are many categories/skills, shrink radii a bit
    const categoryRadius = Math.max(50, Math.min(maxAllowedRadius * 0.55, maxAllowedRadius - 40));
    const skillRadius = Math.max(80, Math.min(maxAllowedRadius * 0.85, maxAllowedRadius));

    // Create hierarchical data structure
    const createHierarchicalData = () => {
      // User node at center
      const userNode = {
        id: 'user',
        name: 'You',
        category: 'user',
        mastery_level: 100,
        xp_earned: 0,
        level: 1,
        skills: [],
        x: width / 2,
        y: height / 2,
        type: 'user'
      };

      // Main category nodes (first level)
      const categoryNodes = data.nodes.map((node, index) => {
        const angle = (index / data.nodes.length) * 2 * Math.PI;
        let x = width / 2 + Math.cos(angle) * categoryRadius;
        let y = height / 2 + Math.sin(angle) * categoryRadius;
        const clamped = clampNode(x, y, { ...node, type: 'category' }, width, height);
        return {
          ...node,
          x: clamped.x,
          y: clamped.y,
          type: 'category'
        };
      });

      // Skill nodes (second level)
      const skillNodes: any[] = [];
      categoryNodes.forEach((categoryNode, categoryIndex) => {
        const categoryAngle = (categoryIndex / data.nodes.length) * 2 * Math.PI;
        categoryNode.skills.forEach((skill, skillIndex) => {
          // Spread skills a bit, but keep them close to their parent
          const skillAngle = categoryAngle + (skillIndex - (categoryNode.skills.length - 1) / 2) * (Math.PI / 16);
          let x = width / 2 + Math.cos(skillAngle) * skillRadius;
          let y = height / 2 + Math.sin(skillAngle) * skillRadius;
          const clamped = clampNode(x, y, { ...skill, type: 'skill' }, width, height);
          skillNodes.push({
            id: `${categoryNode.id}-${skill.skill_name}`,
            name: skill.skill_name,
            category: categoryNode.category,
            mastery_level: skill.mastery_level,
            xp_earned: skill.xp_earned,
            level: 1,
            skills: [skill],
            x: clamped.x,
            y: clamped.y,
            type: 'skill',
            parentCategory: categoryNode.id
          });
        });
      });

      return [userNode, ...categoryNodes, ...skillNodes];
    };

    const hierarchicalNodes = createHierarchicalData();

    // Create links
    const links: any[] = [];
    data.nodes.forEach((node, index) => {
      links.push({
        source: 'user',
        target: node.id,
        type: 'user-to-category'
      });
    });
    hierarchicalNodes.forEach((node) => {
      if (node.type === 'skill' && node.parentCategory) {
        links.push({
          source: node.parentCategory,
          target: node.id,
          type: 'category-to-skill'
        });
      }
    });

    // Create force simulation
    const sim = d3.forceSimulation(hierarchicalNodes)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance((d: any) => {
        if (d.type === 'user-to-category') return categoryRadius;
        if (d.type === 'category-to-skill') return skillRadius - 20;
        return 40;
      }))
      .force("charge", d3.forceManyBody().strength((d: any) => {
        if (d.type === 'user') return -1000;
        if (d.type === 'category') return -300;
        return -100;
      }))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius((d: any) => getNodeRadius(d)))
      .on('tick', () => {
        hierarchicalNodes.forEach((node: any) => {
          const clamped = clampNode(node.x, node.y, node, width, height);
          node.x = clamped.x;
          node.y = clamped.y;
        });
      });

    setSimulation(sim);

    // Create links
    const linkElements = svg.append("g")
      .selectAll("line")
      .data(links)
      .enter().append("line")
      .attr("stroke", (d: any) => {
        if (d.type === 'user-to-category') return "#FF6B2C";
        return "#E5E7EB";
      })
      .attr("stroke-width", (d: any) => {
        if (d.type === 'user-to-category') return 3;
        return 2;
      })
      .attr("opacity", (d: any) => {
        if (d.type === 'user-to-category') return 0.8;
        return 0.6;
      });

    // Create nodes
    const nodeElements = svg.append("g")
      .selectAll("g")
      .data(hierarchicalNodes)
      .enter().append("g")
      .attr("class", "node")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        if (d.type !== 'user') {
          onNodeClick(d);
        }
      })
      .on("mouseenter", function(event, d) {
        const node = d3.select(this);
        node.select("circle").transition().duration(200).attr("r", (d: any) => getNodeRadius(d) + 5);
        node.select("text").transition().duration(200).attr("font-size", (d: any) => {
          if (d.type === 'user') return "16px";
          if (d.type === 'category') return "14px";
          return "12px";
        });
      })
      .on("mouseleave", function(event, d) {
        const node = d3.select(this);
        node.select("circle").transition().duration(200).attr("r", (d: any) => getNodeRadius(d));
        node.select("text").transition().duration(200).attr("font-size", (d: any) => {
          if (d.type === 'user') return "14px";
          if (d.type === 'category') return "12px";
          return "10px";
        });
      });

    // Add circles to nodes
    nodeElements.append("circle")
      .attr("r", (d: any) => getNodeRadius(d))
      .attr("fill", (d: any) => {
        if (d.type === 'user') return '#FF6B2C';
        const colors = {
          'Biology': '#22C55E',
          'Chemistry': '#3B82F6',
          'Physics': '#8B5CF6',
          'Mathematics': '#F59E0B',
          'Engineering': '#EF4444',
          'Technology': '#06B6D4',
          'default': '#6B7280'
        };
        return colors[d.category as keyof typeof colors] || colors.default;
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", (d: any) => d.type === 'user' ? 4 : 3)
      .attr("opacity", 0.9);

    // Add text labels
    nodeElements.append("text")
      .text((d: any) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", (d: any) => {
        if (d.type === 'user') return "14px";
        if (d.type === 'category') return "12px";
        return "10px";
      })
      .attr("font-weight", "600")
      .attr("fill", "#1F2937")
      .attr("pointer-events", "none");

    // Add XP badges for skills
    nodeElements.filter((d: any) => d.type === 'skill')
      .append("text")
      .text((d: any) => `${d.xp_earned}XP`)
      .attr("text-anchor", "middle")
      .attr("dy", "2.5em")
      .attr("font-size", "8px")
      .attr("font-weight", "700")
      .attr("fill", "#FF6B2C")
      .attr("pointer-events", "none");

    // Add mastery badges for categories
    nodeElements.filter((d: any) => d.type === 'category')
      .append("text")
      .text((d: any) => `Lv.${d.level}`)
      .attr("text-anchor", "middle")
      .attr("dy", "2.5em")
      .attr("font-size", "10px")
      .attr("font-weight", "700")
      .attr("fill", "#0B3C6A")
      .attr("pointer-events", "none");

    // Update positions on simulation tick
    sim.on("tick", () => {
      linkElements
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeElements
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => {
      sim.stop();
    };
  }, [data, width, height, onNodeClick]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={{
        background: 'transparent',
        borderRadius: '16px',
        overflow: 'visible'
      }}
    />
  );
};

export default NetworkGraph;

