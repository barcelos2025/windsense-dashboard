
import React from 'react';
import { cn } from '@/lib/utils';

interface HumidityDisplayProps {
  value: number; // Humidity percentage (0-100)
}

const HumidityDisplay: React.FC<HumidityDisplayProps> = ({ value }) => {
  // Determine the color based on humidity level
  const getHumidityColor = (humidity: number): string => {
    if (humidity < 30) return 'bg-yellow-500'; // Dry
    if (humidity < 60) return 'bg-green-500'; // Comfortable
    return 'bg-blue-500'; // Humid
  };
  
  const humidityColor = getHumidityColor(value);
  
  // Get description based on humidity level
  const getDescription = (humidity: number): string => {
    if (humidity < 30) return 'Seco';
    if (humidity < 60) return 'Confortável';
    if (humidity < 80) return 'Úmido';
    return 'Muito Úmido';
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full max-w-xs">
        {/* Progress bar container */}
        <div className="h-6 bg-secondary rounded-full overflow-hidden">
          {/* Progress bar fill */}
          <div 
            className={cn("h-full transition-all duration-1000 rounded-full", humidityColor)}
            style={{ width: `${value}%` }}
          />
        </div>
        
        {/* Labels */}
        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold">{value.toFixed(0)}%</div>
        <div className="text-sm text-muted-foreground">
          {getDescription(value)}
        </div>
      </div>
    </div>
  );
};

export default HumidityDisplay;
