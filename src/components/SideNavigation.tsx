
import React from 'react';
import { Link } from 'react-router-dom';
import { Gauge, MapPin, Wind, Compass, ChartBar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router-dom';

type NavItemProps = {
  href: string;
  icon: React.ElementType;
  title: string;
  isActive?: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, title, isActive }) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-2xl transition-all",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon className="h-10 w-10" />
      <span>{title}</span>
    </Link>
  );
};

export default function SideNavigation() {
  const location = useLocation();
  const pathname = location.pathname;
  
  return (
    <div className="flex h-full w-[240px] flex-col bg-sidebar border-r">
      <div className="flex h-14 items-center border-b px-4">
        <Link to="/" className="flex items-center gap-2">
          <MapPin className="h-10 w-10 text-primary" />
          <span className="font-semibold text-2xl">Sensor Dashboard</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-2xl font-medium">
          <NavItem 
            href="/" 
            icon={MapPin} 
            title="Mapa" 
            isActive={pathname === '/'} 
          />
          <NavItem 
            href="/analytics" 
            icon={ChartBar} 
            title="Análises" 
            isActive={pathname === '/analytics'} 
          />
          <NavItem 
            href="/sensors" 
            icon={Gauge} 
            title="Sensores" 
            isActive={pathname === '/sensors'} 
          />
          <NavItem 
            href="/weather" 
            icon={Wind} 
            title="Previsão" 
            isActive={pathname === '/weather'} 
          />
        </nav>
      </div>
      <div className="mt-auto p-4">
        <div className="rounded-lg bg-sidebar-accent p-2">
          <div className="flex items-center gap-2 text-lg">
            <Compass className="h-8 w-8 text-sidebar-primary" />
            <div>
              <div>Leopoldina, MG</div>
              <div className="text-muted-foreground">Sistema de monitoramento</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
