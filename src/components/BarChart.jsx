import React from 'react';

export default function BarChart({
  data = [42, 58, 30, 78],
  labels = ['Friendly', 'Professional', 'Premium', 'Casual'],
  height = 180,
  barColor = 'hsl(252, 90%, 65%)'
}) {
  const maxVal = Math.max(...data, 10);
  const minVal = 0;
  const paddingLeft = 40;
  const paddingRight = 10;
  const paddingTop = 20;
  const paddingBottom = 30;

  const svgWidth = 400;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const barWidth = Math.min(24, (chartWidth / data.length) * 0.4);
  const spacing = (chartWidth - barWidth * data.length) / (data.length - 1 || 1);

  // Construct Grid Lines
  const gridLines = [];
  const gridCount = 4;
  for (let i = 0; i <= gridCount; i++) {
    const y = paddingTop + (i / gridCount) * chartHeight;
    const val = Math.round(maxVal - (i / gridCount) * (maxVal - minVal));
    gridLines.push({ y, val });
  }

  return (
    <div className="bar-chart-container" style={{ width: '100%' }}>
      <svg viewBox={`0 0 ${svgWidth} ${height}`} width="100%" height={height} style={{ overflow: 'visible' }}>
        {/* Grids */}
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

        {/* Vertical rounded bars */}
        {data.map((val, idx) => {
          const x = paddingLeft + idx * (barWidth + spacing) + spacing / 2;
          const pct = (val - minVal) / (maxVal - minVal);
          const barHeight = pct * chartHeight;
          const y = paddingTop + chartHeight - barHeight;

          return (
            <g key={idx} className="chart-bar-group">
              {/* Rounded background track */}
              <rect
                x={x}
                y={paddingTop}
                width={barWidth}
                height={chartHeight}
                rx={barWidth / 2}
                fill="rgba(255, 255, 255, 0.02)"
              />
              {/* Active filled bar */}
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(barHeight, 2)}
                rx={barWidth / 2}
                fill={barColor}
                style={{
                  transformOrigin: `${x + barWidth / 2}px ${paddingTop + chartHeight}px`,
                  transition: 'height 0.8s cubic-bezier(0.16, 1, 0.3, 1), y 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  filter: `drop-shadow(0 2px 6px ${barColor}30)`
                }}
              >
                <title>{`Count: ${val}`}</title>
              </rect>
            </g>
          );
        })}

        {/* Labels */}
        {labels.map((lbl, idx) => {
          const x = paddingLeft + idx * (barWidth + spacing) + spacing / 2 + barWidth / 2;
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
