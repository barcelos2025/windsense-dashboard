
import React from 'react';
import SideNavigation from '@/components/SideNavigation';
import { Wind } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      <SideNavigation />
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col h-full">
          <header className="h-14 border-b flex items-center px-4 md:px-6">
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center">
                <div className="bg-primary/20 p-1.5 rounded-full mr-2">
                  <Wind className="h-4 w-4 text-primary" />
                </div>
                <span className="font-semibold text-primary">WindSENSE</span>
              </div>
              <span className="text-xs md:text-sm text-muted-foreground hidden md:block">
                Monitoramento Remoto de Fenômenos Climáticos Críticos
              </span>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <span className="text-sm text-muted-foreground">
                Última atualização: {new Date().toLocaleDateString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
                })}
              </span>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
