
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { SensorData } from '@/services/sensorAPI';
import { getAlertColor, getAlertText } from '@/utils/mapUtils';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LeafletMapProps {
  sensors: SensorData[];
  onSensorClick: (sensorId: string) => void;
  selectedSensorId?: string;
}

// Custom hook to create sensor markers using AwesomeMarkers
const SensorMarkers: React.FC<{
  sensors: SensorData[];
  onSensorClick: (sensorId: string) => void;
  selectedSensorId?: string;
}> = ({ sensors, onSensorClick, selectedSensorId }) => {
  const map = useMap();

  useEffect(() => {
    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && (layer as any).isCustomSensor) {
        map.removeLayer(layer);
      }
    });

    // Add new markers
    sensors.forEach((sensor) => {
      const isSelected = sensor.id === selectedSensorId;
      const alertColor = getAlertColor(sensor.readings.temperature, sensor.readings.windSpeed);
      const alertText = getAlertText(sensor.readings.temperature, sensor.readings.windSpeed);
      
      // Determine marker color based on alert level
      let markerColor = 'green';
      if (alertColor === '#ef4444') markerColor = 'red';
      else if (alertColor === '#f59e0b') markerColor = 'orange';
      
      // Create AwesomeMarker icon
      const awesomeIcon = (L as any).AwesomeMarkers.icon({
        markerColor: markerColor,
        iconColor: 'white',
        icon: 'info-sign',
        prefix: 'glyphicon',
        extraClasses: 'fa-rotate-0'
      });

      const marker = L.marker([sensor.location.lat, sensor.location.lng], {
        icon: awesomeIcon
      });

      // Mark as custom sensor for cleanup
      (marker as any).isCustomSensor = true;

      // Create popup content
      const popupContent = `
        <div style="color: #1a1f2c; padding: 4px;">
          <h3 style="font-weight: bold; margin-bottom: 4px;">${sensor.name}</h3>
          <p style="margin: 0;">${sensor.location.description}</p>
          <p style="margin-top: 4px; font-size: 0.9em;">
            Status: <span style="color: ${alertColor}; font-weight: bold;">${alertText}</span>
          </p>
          <p style="margin-top: 4px; font-size: 0.9em;">
            Temperatura: ${sensor.readings.temperature.toFixed(1)}°C
          </p>
          <p style="margin-top: 4px; font-size: 0.9em;">
            Velocidade do Vento: ${sensor.readings.windSpeed.toFixed(1)} km/h
          </p>
        </div>
      `;

      marker.bindPopup(popupContent);
      
      marker.on('click', () => {
        onSensorClick(sensor.id);
      });

      marker.addTo(map);
    });
  }, [map, sensors, onSensorClick, selectedSensorId]);

  return null;
};

// Map legend component
const MapLegend: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', 'legend');
      div.style.backgroundColor = 'white';
      div.style.padding = '10px';
      div.style.borderRadius = '5px';
      div.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
      div.innerHTML = `
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
      `;
      return div;
    };

    legend.addTo(map);

    return () => {
      if (map && legend) {
        map.removeControl(legend);
      }
    };
  }, [map]);

  return null;
};

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  sensors, 
  onSensorClick,
  selectedSensorId
}) => {
  return (
    <div className="w-full h-full min-h-[500px] rounded-lg overflow-hidden border border-border">
      <MapContainer
        center={[-21.45, -42.67] as [number, number]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="rounded-lg"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <SensorMarkers 
          sensors={sensors}
          onSensorClick={onSensorClick}
          selectedSensorId={selectedSensorId}
        />
        <MapLegend />
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
