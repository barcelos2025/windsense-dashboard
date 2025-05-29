
import React from 'react';
import { Compass } from 'lucide-react';

interface WindDirectionDisplayProps {
  direction: number; // Direction in degrees (0-360)
  speed: number; // Wind speed
  speedUnit?: string;
}

const WindDirectionDisplay: React.FC<WindDirectionDisplayProps> = ({ 
  direction, 
  speed,
  speedUnit = 'km/h'
}) => {
  // Get cardinal direction from degrees
  const getCardinalDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(((degrees % 360) / 22.5)) % 16;
    return directions[index];
  };
  
  const cardinalDirection = getCardinalDirection(direction);
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-32 w-32">
        {/* Compass background */}
        <div className="absolute inset-0 rounded-full border-2 border-muted flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass className="h-16 w-16 text-muted-foreground opacity-20" />
          </div>
          
          {/* Cardinal directions */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-semibold">N</div>
          <div className="absolute top-1/2 right-2 -translate-y-1/2 text-xs font-semibold">E</div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold">S</div>
          <div className="absolute top-1/2 left-2 -translate-y-1/2 text-xs font-semibold">W</div>
          
          {/* Rotating pointer */}
          <div 
            className="absolute h-24 w-24 transition-transform duration-1000"
            style={{ transform: `rotate(${direction}deg)` }}
          >
            <div className="absolute left-1/2 top-0 h-1/2 w-0.5 bg-primary -translate-x-1/2 origin-bottom">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary rounded-full" />
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-lg font-semibold">{cardinalDirection}</div>
        <div className="text-sm text-muted-foreground">{direction.toFixed(0)}° | {speed.toFixed(1)} {speedUnit}</div>
      </div>
    </div>
  );
};

export default WindDirectionDisplay;
