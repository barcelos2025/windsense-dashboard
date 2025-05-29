
// Types for our sensor data
export interface SensorData {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    description: string;
  };
  readings: {
    temperature: number;
    humidity: number;
    pressure: number;
    windDirection: number;
    windSpeed: number;
    lastUpdated: string;
  };
}

// Sensor data matching the Leaflet example
const sensors: SensorData[] = [
  {
    id: "sensor-01",
    name: "Leopoldina Norte",
    location: {
      lat: -21.515,
      lng: -42.642,
      description: "Quinta Residência - Nível Crítico"
    },
    readings: {
      temperature: 35.5,
      humidity: 65,
      pressure: 1012,
      windDirection: 135, // SE
      windSpeed: 7.2, // 2.0 m/s converted to km/h
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: "sensor-02",
    name: "Leopoldina Sul",
    location: {
      lat: -21.544,
      lng: -42.642,
      description: "Bandeirantes - Nível Crítico"
    },
    readings: {
      temperature: 36.2,
      humidity: 60,
      pressure: 1010,
      windDirection: 315, // NW
      windSpeed: 24.1, // 6.7 m/s converted to km/h
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: "sensor-03",
    name: "Leopoldina Leste",
    location: {
      lat: -21.5295,
      lng: -42.63,
      description: "Rosário - Nível Normal"
    },
    readings: {
      temperature: 26.8,
      humidity: 70,
      pressure: 1015,
      windDirection: 135, // SE
      windSpeed: 5.8, // 1.6 m/s converted to km/h
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: "sensor-04",
    name: "Leopoldina Oeste",
    location: {
      lat: -21.5295,
      lng: -42.655,
      description: "Vila Esteves - Nível Normal"
    },
    readings: {
      temperature: 25.5,
      humidity: 72,
      pressure: 1016,
      windDirection: 180, // S
      windSpeed: 4.0, // 1.1 m/s converted to km/h
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: "sensor-05",
    name: "Cataguases Norte",
    location: {
      lat: -21.379,
      lng: -42.6961,
      description: "Santa Clara - Nível de Atenção"
    },
    readings: {
      temperature: 31.5,
      humidity: 65,
      pressure: 1013,
      windDirection: 45, // NE
      windSpeed: 15.5, // 4.3 m/s converted to km/h
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: "sensor-06",
    name: "Cataguases Sul",
    location: {
      lat: -21.406,
      lng: -42.6961,
      description: "Pouso Alegre - Nível Normal"
    },
    readings: {
      temperature: 27.2,
      humidity: 68,
      pressure: 1014,
      windDirection: 225, // SW
      windSpeed: 35.3, // 9.8 m/s converted to km/h
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: "sensor-07",
    name: "Cataguases Leste",
    location: {
      lat: -21.3926,
      lng: -42.683,
      description: "Paraíso - Nível Crítico"
    },
    readings: {
      temperature: 37.1,
      humidity: 58,
      pressure: 1009,
      windDirection: 315, // NW
      windSpeed: 18.0, // 5.0 m/s converted to km/h
      lastUpdated: new Date().toISOString()
    }
  },
  {
    id: "sensor-08",
    name: "Cataguases Oeste",
    location: {
      lat: -21.3926,
      lng: -42.709,
      description: "Granjaria - Nível Crítico"
    },
    readings: {
      temperature: 35.8,
      humidity: 61,
      pressure: 1011,
      windDirection: 270, // W
      windSpeed: 14.8, // 4.1 m/s converted to km/h
      lastUpdated: new Date().toISOString()
    }
  }
];

// Mock API functions
export const fetchAllSensors = async (): Promise<SensorData[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  return [...sensors];
};

export const fetchSensorById = async (id: string): Promise<SensorData | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return sensors.find(sensor => sensor.id === id);
};

// Mock update - in a real app this would connect to a backend
export const updateSensorData = async (id: string, data: Partial<SensorData['readings']>): Promise<SensorData | undefined> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const sensorIndex = sensors.findIndex(sensor => sensor.id === id);
  if (sensorIndex === -1) return undefined;
  
  // Update the sensor data
  sensors[sensorIndex] = {
    ...sensors[sensorIndex],
    readings: {
      ...sensors[sensorIndex].readings,
      ...data,
      lastUpdated: new Date().toISOString()
    }
  };
  
  return sensors[sensorIndex];
};

// Function to generate random fluctuations in sensor readings (simulates real-time updates)
export const simulateSensorUpdates = (): void => {
  setInterval(() => {
    sensors.forEach(sensor => {
      // Generate small random fluctuations
      const tempChange = (Math.random() - 0.5) * 0.5;
      const humidityChange = (Math.random() - 0.5) * 2;
      const pressureChange = (Math.random() - 0.5) * 0.5;
      const windDirChange = (Math.random() - 0.5) * 10;
      const windSpeedChange = (Math.random() - 0.5) * 1;
      
      // Update readings with constraints
      sensor.readings.temperature = Math.max(0, Math.min(50, sensor.readings.temperature + tempChange));
      sensor.readings.humidity = Math.max(0, Math.min(100, sensor.readings.humidity + humidityChange));
      sensor.readings.pressure = Math.max(980, Math.min(1040, sensor.readings.pressure + pressureChange));
      sensor.readings.windDirection = (sensor.readings.windDirection + windDirChange) % 360;
      if (sensor.readings.windDirection < 0) sensor.readings.windDirection += 360;
      sensor.readings.windSpeed = Math.max(0, Math.min(100, sensor.readings.windSpeed + windSpeedChange));
      
      sensor.readings.lastUpdated = new Date().toISOString();
    });
  }, 10000); // Update every 10 seconds
};
