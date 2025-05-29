
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SensorData } from '@/services/sensorAPI';
import GaugeChart from './GaugeChart';
import WindDirectionDisplay from './WindDirectionDisplay';
import HumidityDisplay from './HumidityDisplay';

interface SensorInfoCardProps {
  sensor: SensorData | null;
  loading?: boolean;
}

const SensorInfoCard: React.FC<SensorInfoCardProps> = ({ sensor, loading = false }) => {
  if (loading) {
    return (
      <Card className="w-full animate-pulse-slow">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="h-7 w-32 bg-secondary rounded"></div>
            <div className="h-5 w-24 bg-secondary rounded"></div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col items-center gap-4">
            <div className="h-40 w-40 bg-secondary rounded-full"></div>
            <div className="h-6 w-20 bg-secondary rounded"></div>
          </div>
          <div className="flex flex-col items-center gap-4">
            <div className="h-40 w-40 bg-secondary rounded-full"></div>
            <div className="h-6 w-20 bg-secondary rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sensor) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Nenhum sensor selecionado</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-lg">Selecione um sensor no mapa para ver detalhes.</p>
        </CardContent>
      </Card>
    );
  }

  // Format last updated date
  const lastUpdatedFormatted = new Date(sensor.readings.lastUpdated).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-xl">
          <span>{sensor.name}</span>
          <span className="text-base font-normal text-muted-foreground">
            Atualizado: {lastUpdatedFormatted}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-6">Temperatura</h3>
            <div className="flex justify-center">
              <div className="scale-125">
                <GaugeChart
                  value={sensor.readings.temperature}
                  min={0}
                  max={40}
                  label="Temperatura"
                  unit="°C"
                  colorRanges={[
                    { from: 0, to: 15, color: '#3b82f6' },  // Blue - Cold
                    { from: 15, to: 25, color: '#10b981' }, // Green - Comfortable
                    { from: 25, to: 35, color: '#f59e0b' }, // Yellow - Warm
                    { from: 35, to: 40, color: '#ef4444' }  // Red - Hot
                  ]}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-6">Umidade</h3>
            <div className="flex justify-center">
              <div className="scale-125">
                <HumidityDisplay value={sensor.readings.humidity} />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-6">Direção do Vento</h3>
            <div className="flex justify-center">
              <div className="scale-125">
                <WindDirectionDisplay 
                  direction={sensor.readings.windDirection}
                  speed={sensor.readings.windSpeed}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center mb-6">Pressão Atmosférica</h3>
            <div className="flex justify-center">
              <div className="scale-125">
                <GaugeChart
                  value={sensor.readings.pressure}
                  min={980}
                  max={1040}
                  label="Pressão"
                  unit=" hPa"
                  colorRanges={[
                    { from: 980, to: 1000, color: '#3b82f6' }, // Low pressure
                    { from: 1000, to: 1020, color: '#10b981' }, // Normal
                    { from: 1020, to: 1040, color: '#f59e0b' }  // High pressure
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorInfoCard;
