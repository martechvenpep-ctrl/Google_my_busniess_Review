import React from 'react';

export default function CircleChart({ 
  percentage = 80, 
  size = 120, 
  strokeWidth = 10, 
  color = 'hsl(217, 91%, 60%)', 
  label = '', 
  subLabel = '' 
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="circle-chart-wrapper" style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle with Smooth Transition */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s ease-in-out',
            filter: `drop-shadow(0 0 4px ${color}50)`
          }}
        />
      </svg>
      {/* Center Text */}
      <div className="circle-chart-text" style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
      }}>
        <span style={{ fontSize: size * 0.18, fontWeight: 700, color: 'var(--text-primary)' }}>{label}</span>
        {subLabel && <span style={{ fontSize: size * 0.09, color: 'var(--text-secondary)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{subLabel}</span>}
      </div>
    </div>
  );
}
