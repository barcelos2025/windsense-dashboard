import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardHeader from '@/components/DashboardHeader';
import HTMLMap from '@/components/HTMLMap';
import SensorInfoCard from '@/components/SensorInfoCard';
import { fetchAllSensors, fetchSensorById, simulateSensorUpdates, SensorData } from '@/services/sensorAPI';
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<SensorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingSensor, setLoadingSensor] = useState(false);
  
  // Fetch all sensor data
  useEffect(() => {
    const loadSensors = async () => {
      try {
        setLoading(true);
        const data = await fetchAllSensors();
        setSensors(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load sensors:', error);
        toast({
          title: "Erro ao carregar sensores",
          description: "Não foi possível carregar os dados dos sensores.",
          variant: "destructive"
        });
        setLoading(false);
      }
    };
    
    loadSensors();
    
    // Start simulating sensor updates
    simulateSensorUpdates();
    
    // Periodically refresh sensor data
    const interval = setInterval(() => {
      loadSensors();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle sensor selection
  const handleSensorClick = async (sensorId: string) => {
    try {
      setLoadingSensor(true);
      const sensorData = await fetchSensorById(sensorId);
      setSelectedSensor(sensorData || null);
      setLoadingSensor(false);
    } catch (error) {
      console.error('Failed to load sensor details:', error);
      toast({
        title: "Erro ao carregar detalhes do sensor",
        description: "Não foi possível carregar os dados detalhados do sensor.",
        variant: "destructive"
      });
      setLoadingSensor(false);
    }
  };
  
  return (
    <DashboardLayout>
      <DashboardHeader 
        title="Sistema de Alerta WindSENSE" 
        subtitle="Monitoramento de níveis de alerta na região de Leopoldina e Cataguases, MG" 
      />
      
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-card rounded-lg border shadow-sm p-4 h-[500px]">
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Carregando mapa...</p>
              </div>
            </div>
          ) : (
            <HTMLMap 
              sensors={sensors} 
              onSensorClick={handleSensorClick}
              selectedSensorId={selectedSensor?.id} 
            />
          )}
        </div>
        
        <SensorInfoCard 
          sensor={selectedSensor}
          loading={loadingSensor} 
        />
      </div>
    </DashboardLayout>
  );
};

export default Index;
