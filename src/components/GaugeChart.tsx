
import React, { useEffect, useRef } from 'react';

interface GaugeChartProps {
  value: number;
  min: number;
  max: number;
  label: string;
  unit: string;
  colorRanges?: Array<{
    from: number;
    to: number;
    color: string;
  }>;
}

const GaugeChart: React.FC<GaugeChartProps> = ({ 
  value, 
  min, 
  max, 
  label, 
  unit,
  colorRanges = [{ from: min, to: max, color: '#1EAEDB' }]
}) => {
  const gaugeRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (gaugeRef.current) {
      // Calculate the angle for the gauge
      const percent = (value - min) / (max - min);
      const angle = percent * 180; // 180 degrees for semicircle
      
      // Find the right color based on value
      let color = '#1EAEDB';
      for (const range of colorRanges) {
        if (value >= range.from && value <= range.to) {
          color = range.color;
          break;
        }
      }
      
      // Update the gauge fill
      const fill = gaugeRef.current.querySelector('.gauge-fill') as HTMLElement;
      if (fill) {
        fill.style.transform = `rotate(${angle}deg)`;
        fill.style.backgroundColor = color;
      }
    }
  }, [value, min, max, colorRanges]);
  
  // Generate scale marks
  const generateScaleMarks = () => {
    const marks = [];
    const steps = 5; // Number of scale marks
    const stepValue = (max - min) / steps;
    
    for (let i = 0; i <= steps; i++) {
      const markValue = min + (stepValue * i);
      const angle = (i / steps) * 180; // 180 degrees for semicircle
      const radian = (angle * Math.PI) / 180;
      
      // Position calculations for scale marks
      const radius = 85; // Distance from center
      const x = 50 + radius * Math.cos(Math.PI - radian);
      const y = 90 - radius * Math.sin(Math.PI - radian);
      
      marks.push(
        <g key={i}>
          <line
            x1={50 + (radius - 5) * Math.cos(Math.PI - radian)}
            y1={90 - (radius - 5) * Math.sin(Math.PI - radian)}
            x2={50 + radius * Math.cos(Math.PI - radian)}
            y2={90 - radius * Math.sin(Math.PI - radian)}
            stroke="currentColor"
            strokeWidth="2"
            className="text-muted-foreground"
          />
          <text
            x={50 + (radius + 8) * Math.cos(Math.PI - radian)}
            y={90 - (radius + 8) * Math.sin(Math.PI - radian)}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs text-muted-foreground fill-current"
          >
            {Math.round(markValue)}
          </text>
        </g>
      );
    }
    
    return marks;
  };
  
  // Format the value to 1 decimal place if it's not an integer
  const formattedValue = Number.isInteger(value) ? value : value.toFixed(1);
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-48 h-32">
        {/* Scale marks SVG */}
        <svg width="192" height="128" className="absolute inset-0 z-10 pointer-events-none">
          {generateScaleMarks()}
        </svg>
        
        {/* Gauge container */}
        <div 
          ref={gaugeRef}
          className="relative w-48 h-24 overflow-hidden rounded-t-full bg-secondary"
          style={{
            background: 'conic-gradient(from 180deg, #e5e7eb 0deg, #e5e7eb 180deg, transparent 180deg)'
          }}
        >
          {/* Gauge fill */}
          <div 
            className="gauge-fill absolute inset-0 rounded-t-full origin-bottom transition-transform duration-1000"
            style={{
              background: 'conic-gradient(from 180deg, #1EAEDB 0deg, transparent 0deg)',
              transformOrigin: 'center bottom'
            }}
          />
          
          {/* Center value display */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 bg-card rounded-lg px-3 py-1 border shadow-sm">
            <div className="flex flex-col items-center">
              <div className="text-xl font-bold text-foreground">
                {formattedValue}{unit}
              </div>
              <div className="text-xs text-muted-foreground">
                {label}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GaugeChart;
