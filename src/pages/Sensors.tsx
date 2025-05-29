
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllSensors, SensorData } from '@/services/sensorAPI';
import { toast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin } from 'lucide-react';
import MockAPI from '@/components/MockAPI';

const Sensors = () => {
  const [sensors, setSensors] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  
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
    
    // Refresh data periodically
    const interval = setInterval(loadSensors, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Format timestamp to readable date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  return (
    <DashboardLayout>
      <DashboardHeader 
        title="Sensores e API" 
        subtitle="Visualize todos os sensores e acesse a documentação da API" 
      />
      
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sensores Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Carregando sensores...</p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Localização</TableHead>
                    <TableHead>Temperatura</TableHead>
                    <TableHead>Umidade</TableHead>
                    <TableHead>Pressão</TableHead>
                    <TableHead>Vento</TableHead>
                    <TableHead>Última Atualização</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sensors.map((sensor) => (
                    <TableRow key={sensor.id}>
                      <TableCell className="font-medium">{sensor.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{sensor.location.description}</span>
                        </div>
                      </TableCell>
                      <TableCell>{sensor.readings.temperature.toFixed(1)}°C</TableCell>
                      <TableCell>{sensor.readings.humidity.toFixed(0)}%</TableCell>
                      <TableCell>{sensor.readings.pressure.toFixed(0)} hPa</TableCell>
                      <TableCell>{sensor.readings.windSpeed.toFixed(1)} km/h</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(sensor.readings.lastUpdated)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        <MockAPI />
      </div>
    </DashboardLayout>
  );
};

export default Sensors;
