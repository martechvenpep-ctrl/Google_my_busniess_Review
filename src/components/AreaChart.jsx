import React from 'react';

export default function AreaChart({ 
  data = [12, 19, 15, 25, 32, 28, 45, 52, 48, 60], 
  labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
  height = 180,
  strokeColor = '#3b82f6',
  fillColorId = 'cyan-grad'
}) {
  const maxVal = Math.max(...data, 10);
  const minVal = 0;
  const paddingLeft = 40;
  const paddingRight = 10;
  const paddingTop = 20;
  const paddingBottom = 30;

  // Render variables
  const svgWidth = 500;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Calculate coordinates
  const points = data.map((val, idx) => {
    const x = paddingLeft + (idx / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((val - minVal) / (maxVal - minVal)) * chartHeight;
    return { x, y, val };
  });

  // Construct SVG path strings
  let linePath = '';
  let areaPath = '';

  if (points.length > 0) {
    // Generate line path
    linePath = `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    
    // Generate area path (adds bottom corners for gradient fill)
    areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingBottom} L ${points[0].x} ${height - paddingBottom} Z`;
  }

  // Construct Grid Lines
  const gridLines = [];
  const gridCount = 4;
  for (let i = 0; i <= gridCount; i++) {
    const y = paddingTop + (i / gridCount) * chartHeight;
    const val = Math.round(maxVal - (i / gridCount) * (maxVal - minVal));
    gridLines.push({ y, val });
  }

  return (
    <div className="area-chart-container" style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${svgWidth} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
        <defs>
          {/* Cyan/Blue Glow Gradient */}
          <linearGradient id="cyan-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
          </linearGradient>
          {/* Emerald/Green Glow Gradient */}
          <linearGradient id="green-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.00" />
          </linearGradient>
          {/* Amber/Orange Glow Gradient */}
          <linearGradient id="amber-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.00" />
          </linearGradient>
          {/* Purple Glow Gradient */}
          <linearGradient id="purple-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Grid lines & Y Axis Labels */}
        {gridLines.map((line, idx) => (
          <g key={idx}>
            <text 
              x={paddingLeft - 8} 
              y={line.y + 4} 
              fill="var(--text-secondary)" 
              fontSize="10" 
              textAnchor="end"
              fontFamily="sans-serif"
            >
              {line.val}
            </text>
            {idx < gridLines.length - 1 && (
              <line 
                x1={paddingLeft} 
                y1={line.y} 
                x2={svgWidth - paddingRight} 
                y2={line.y} 
                stroke="rgba(255,255,255,0.04)" 
                strokeDasharray="4 4" 
              />
            )}
          </g>
        ))}

        {/* Shaded Area */}
        <path d={areaPath} fill={`url(#${fillColorId})`} />

        {/* Elegant Line Stroke */}
        <path 
          d={linePath} 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          style={{ filter: `drop-shadow(0 2px 8px ${strokeColor}30)` }}
        />

        {/* Interactive Highlight Nodes */}
        {points.map((p, idx) => (
          <g key={idx} className="chart-node-group">
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="4.5" 
              fill="var(--bg-surface)" 
              stroke={strokeColor} 
              strokeWidth="2" 
              style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
            />
            {/* Value popover on hover inside CSS */}
            <circle 
              cx={p.x} 
              cy={p.y} 
              r="9" 
              fill={strokeColor} 
              fillOpacity="0" 
              className="chart-hover-ring"
              style={{ cursor: 'pointer' }}
            >
              <title>{`Value: ${p.val}`}</title>
            </circle>
          </g>
        ))}

        {/* X Axis Labels */}
        {labels.map((lbl, idx) => {
          const x = paddingLeft + (idx / (labels.length - 1)) * chartWidth;
          return (
            <text 
              key={idx} 
              x={x} 
              y={height - 8} 
              fill="var(--text-secondary)" 
              fontSize="10" 
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              {lbl}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
