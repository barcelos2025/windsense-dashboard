import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardHeader from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchAllSensors, SensorData } from '@/services/sensorAPI';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from "@/hooks/use-toast";
import WindDirectionChart from '@/components/WindDirectionChart';

const Analytics = () => {
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
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados dos sensores para análise.",
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
  
  // Prepare data for charts
  const tempData = sensors.map(sensor => ({
    name: sensor.name.replace('Sensor ', ''),
    temperatura: sensor.readings.temperature
  }));
  
  const humidityData = sensors.map(sensor => ({
    name: sensor.name.replace('Sensor ', ''),
    umidade: sensor.readings.humidity
  }));
  
  const pressureData = sensors.map(sensor => ({
    name: sensor.name.replace('Sensor ', ''),
    pressao: sensor.readings.pressure
  }));
  
  const windData = sensors.map(sensor => ({
    name: sensor.name.replace('Sensor ', ''),
    velocidade: sensor.readings.windSpeed
  }));
  
  return (
    <DashboardLayout>
      <DashboardHeader 
        title="Análise de Dados" 
        subtitle="Visualize e compare dados entre diferentes sensores" 
      />
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Temperatura por Sensor</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tempData} barCategoryGap={10}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 40]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1F2C',
                        borderColor: '#38414e',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="temperatura" name="Temperatura (°C)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Umidade por Sensor</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={humidityData} barCategoryGap={10}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1F2C',
                        borderColor: '#38414e',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="umidade" name="Umidade (%)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Pressão Atmosférica</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={pressureData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[980, 1040]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1F2C',
                        borderColor: '#38414e',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="pressao" 
                      name="Pressão (hPa)" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
          
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Velocidade do Vento</CardTitle>
            </CardHeader>
            <CardContent className="h-72">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={windData} barCategoryGap={10}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 30]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1A1F2C',
                        borderColor: '#38414e',
                        borderRadius: '8px',
                      }}
                    />
                    <Legend />
                    <Bar dataKey="velocidade" name="Velocidade (km/h)" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </div>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">Direção do Vento por Região</CardTitle>
          </CardHeader>
          <CardContent className="h-[700px]">
            {loading ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p className="mt-2 text-sm text-muted-foreground">Carregando...</p>
                </div>
              </div>
            ) : (
              <WindDirectionChart sensors={sensors} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
