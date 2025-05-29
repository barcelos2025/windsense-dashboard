
import React from 'react';
import { SensorData } from '@/services/sensorAPI';
import { ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart, Legend, Tooltip } from 'recharts';

interface WindDirectionChartProps {
  sensors: SensorData[];
}

const WindDirectionChart: React.FC<WindDirectionChartProps> = ({ sensors }) => {
  // Função para converter graus em direção cardinal
  const getCardinalDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(((degrees % 360) / 22.5)) % 16;
    return directions[index];
  };

  // Preparar dados para o gráfico radar
  const windData = sensors.map(sensor => {
    const direction = getCardinalDirection(sensor.readings.windDirection);
    return {
      sensor: sensor.name.replace('Sensor ', '').replace('Leopoldina ', 'Leo ').replace('Cataguases ', 'Cat '),
      direcao: sensor.readings.windDirection,
      velocidade: sensor.readings.windSpeed,
      cardinal: direction,
      location: sensor.location.description,
      // Normalizar a direção para o gráfico (0-360 para 0-100 para melhor visualização)
      direcaoNormalizada: (sensor.readings.windDirection / 360) * 100
    };
  });

  // Dados para o gráfico polar mostrando a distribuição por direção cardinal
  const cardinalData = [
    { direction: 'N', count: 0, avgSpeed: 0, sensors: [] as string[] },
    { direction: 'NE', count: 0, avgSpeed: 0, sensors: [] as string[] },
    { direction: 'E', count: 0, avgSpeed: 0, sensors: [] as string[] },
    { direction: 'SE', count: 0, avgSpeed: 0, sensors: [] as string[] },
    { direction: 'S', count: 0, avgSpeed: 0, sensors: [] as string[] },
    { direction: 'SW', count: 0, avgSpeed: 0, sensors: [] as string[] },
    { direction: 'W', count: 0, avgSpeed: 0, sensors: [] as string[] },
    { direction: 'NW', count: 0, avgSpeed: 0, sensors: [] as string[] }
  ];

  // Agrupar sensores por direção cardinal principal
  windData.forEach(sensor => {
    const mainDirection = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'].find(dir => 
      sensor.cardinal.includes(dir.charAt(0)) || sensor.cardinal === dir
    ) || 'N';
    
    const index = cardinalData.findIndex(item => item.direction === mainDirection);
    if (index !== -1) {
      cardinalData[index].count += 1;
      cardinalData[index].avgSpeed += sensor.velocidade;
      cardinalData[index].sensors.push(`${sensor.sensor} (${sensor.location})`);
    }
  });

  // Calcular média de velocidade
  cardinalData.forEach(item => {
    if (item.count > 0) {
      item.avgSpeed = item.avgSpeed / item.count;
    }
  });

  return (
    <div className="w-full h-full">
      <div className="mb-6 p-4 bg-muted/50 rounded-lg">
        <h4 className="text-2xl font-semibold mb-3 text-foreground">Legenda do Gráfico</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
          <div>
            <p className="font-medium text-foreground mb-2">Direções Cardinais:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li><strong>N</strong> - Norte (0°/360°)</li>
              <li><strong>NE</strong> - Nordeste (45°)</li>
              <li><strong>E</strong> - Leste (90°)</li>
              <li><strong>SE</strong> - Sudeste (135°)</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-foreground mb-2">Continuação:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li><strong>S</strong> - Sul (180°)</li>
              <li><strong>SW</strong> - Sudoeste (225°)</li>
              <li><strong>W</strong> - Oeste (270°)</li>
              <li><strong>NW</strong> - Noroeste (315°)</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-border">
          <p className="text-lg text-muted-foreground">
            <strong>Interpretação:</strong> O gráfico mostra a velocidade média do vento (km/h) para cada direção cardinal, 
            baseado nos dados de todos os sensores. Quanto maior o valor na direção, maior a velocidade média do vento nessa direção.
            Passe o mouse sobre cada ponto para ver quais sensores contribuem para cada direção.
          </p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={500}>
        <RadarChart data={cardinalData} margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
          <PolarGrid stroke="#374151" strokeWidth={1} />
          <PolarAngleAxis 
            dataKey="direction" 
            className="text-base fill-current text-foreground font-medium"
            tick={{ fontSize: 16, fontWeight: 500 }}
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 'dataMax']}
            className="text-sm fill-current text-muted-foreground"
            tick={{ fontSize: 12 }}
            tickCount={5}
          />
          <Radar
            name="Velocidade Média (km/h)"
            dataKey="avgSpeed"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.3}
            strokeWidth={3}
            dot={{ r: 6, strokeWidth: 2, fill: "#3b82f6" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              borderColor: 'hsl(var(--border))',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
              fontSize: '14px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              maxWidth: '300px'
            }}
            formatter={(value: number, name: string) => [
              `${value.toFixed(1)} km/h`, 
              name
            ]}
            labelFormatter={(label: string) => {
              const data = cardinalData.find(item => item.direction === label);
              return (
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>
                    Direção: {label}
                  </div>
                  {data && data.sensors.length > 0 && (
                    <div style={{ fontSize: '12px', marginTop: '4px' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        Sensores nesta direção:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '16px' }}>
                        {data.sensors.map((sensor, index) => (
                          <li key={index} style={{ marginBottom: '2px' }}>
                            {sensor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            }}
          />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '30px',
              fontSize: '14px',
              fontWeight: '500'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WindDirectionChart;
