
import React from 'react';
import { SensorData } from '@/services/sensorAPI';

interface HTMLMapProps {
  sensors: SensorData[];
  onSensorClick: (sensorId: string) => void;
  selectedSensorId?: string;
}

const HTMLMap: React.FC<HTMLMapProps> = ({ 
  sensors, 
  onSensorClick,
  selectedSensorId
}) => {
  // Generate HTML content for the map
  const generateMapHTML = () => {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WindSENSE Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.css"/>
    <link rel="stylesheet" href="https://netdna.bootstrapcdn.com/bootstrap/3.0.0/css/bootstrap-glyphicons.css"/>
    <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
        .legend {
            background: white;
            padding: 10px;
            border-radius: 5px;
            box-shadow: 0 2px 6px rgba(0,0,0,.3);
        }
    </style>
</head>
<body>
    <div id="map"></div>
    
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Leaflet.awesome-markers/2.0.2/leaflet.awesome-markers.js"></script>
    
    <script>
        // Fix for default markers
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Initialize map
        const map = L.map('map').setView([-21.45, -42.67], 11);
        
        // Add tile layer
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Sensor data
        const sensors = ${JSON.stringify(sensors)};
        
        // Helper functions
        function getAlertColor(temperature, windSpeed) {
            if (temperature > 35 || windSpeed > 20) return '#ef4444';
            if (temperature > 30 || windSpeed > 15) return '#f59e0b';
            return '#10b981';
        }
        
        function getAlertText(temperature, windSpeed) {
            if (temperature > 35 || windSpeed > 20) return 'Nível Crítico';
            if (temperature > 30 || windSpeed > 15) return 'Nível de Atenção';
            return 'Nível Normal';
        }

        // Add sensors to map
        sensors.forEach(sensor => {
            const alertColor = getAlertColor(sensor.readings.temperature, sensor.readings.windSpeed);
            const alertText = getAlertText(sensor.readings.temperature, sensor.readings.windSpeed);
            
            let markerColor = 'green';
            if (alertColor === '#ef4444') markerColor = 'red';
            else if (alertColor === '#f59e0b') markerColor = 'orange';
            
            const awesomeIcon = L.AwesomeMarkers.icon({
                markerColor: markerColor,
                iconColor: 'white',
                icon: 'info-sign',
                prefix: 'glyphicon'
            });

            const marker = L.marker([sensor.location.lat, sensor.location.lng], {
                icon: awesomeIcon
            });

            const popupContent = \`
                <div style="color: #1a1f2c; padding: 4px;">
                    <h3 style="font-weight: bold; margin-bottom: 4px;">\${sensor.name}</h3>
                    <p style="margin: 0;">\${sensor.location.description}</p>
                    <p style="margin-top: 4px; font-size: 0.9em;">
                        Status: <span style="color: \${alertColor}; font-weight: bold;">\${alertText}</span>
                    </p>
                    <p style="margin-top: 4px; font-size: 0.9em;">
                        Temperatura: \${sensor.readings.temperature.toFixed(1)}°C
                    </p>
                    <p style="margin-top: 4px; font-size: 0.9em;">
                        Velocidade do Vento: \${sensor.readings.windSpeed.toFixed(1)} km/h
                    </p>
                </div>
            \`;

            marker.bindPopup(popupContent);
            
            marker.on('click', () => {
                window.parent.postMessage({
                    type: 'sensorClick',
                    sensorId: sensor.id
                }, '*');
            });

            marker.addTo(map);
        });

        // Add legend
        const legend = L.control({ position: 'bottomright' });
        legend.onAdd = function() {
            const div = L.DomUtil.create('div', 'legend');
            div.innerHTML = \`
                <h3 style="margin-top: 0; font-size: 16px; font-weight: bold;">Níveis de Alerta</h3>
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <div style="width: 20px; height: 20px; background-color: #10b981; border-radius: 50%; margin-right: 5px;"></div>
                    <span>Nível Normal</span>
                </div>
                <div style="display: flex; align-items: center; margin-bottom: 5px;">
                    <div style="width: 20px; height: 20px; background-color: #f59e0b; border-radius: 50%; margin-right: 5px;"></div>
                    <span>Nível de Atenção</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 20px; height: 20px; background-color: #ef4444; border-radius: 50%; margin-right: 5px;"></div>
                    <span>Nível Crítico</span>
                </div>
            \`;
            return div;
        };
        legend.addTo(map);
    </script>
</body>
</html>
    `;
  };

  // Handle messages from iframe
  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'sensorClick') {
        onSensorClick(event.data.sensorId);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSensorClick]);

  return (
    <div className="w-full h-full min-h-[500px] rounded-lg overflow-hidden border border-border">
      <iframe
        srcDoc={generateMapHTML()}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="WindSENSE Map"
      />
    </div>
  );
};

export default HTMLMap;
