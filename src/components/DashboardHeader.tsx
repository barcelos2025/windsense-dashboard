
import React from 'react';
import { Wind } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="bg-primary/20 p-2 rounded-full">
          <Wind className="h-6 w-6 text-primary" />
        </div>
        <div className="font-bold text-xl text-primary">WindSENSE</div>
      </div>
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      {subtitle && (
        <p className="text-muted-foreground mt-1">{subtitle}</p>
      )}
    </div>
  );
};

export default DashboardHeader;
