
export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
  };
  hourly: {
    time: string[];
    temperature: number[];
    humidity: number[];
    windSpeed: number[];
    windDirection: number[];
    weatherCode: number[];
    pressure: number[];
    precipitation: number[];
  };
  daily: {
    time: string[];
    temperatureMax: number[];
    temperatureMin: number[];
    weatherCode: number[];
    precipitation: number[];
    windSpeedMax: number[];
    uvIndexMax: number[];
  };
}

export interface WeatherCondition {
  code: number;
  description: string;
  icon: string;
  image: string;
}

export const weatherConditions: Record<number, WeatherCondition> = {
  0: { code: 0, description: 'Céu limpo', icon: 'sun', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800' },
  1: { code: 1, description: 'Parcialmente nublado', icon: 'cloud-sun', image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800' },
  2: { code: 2, description: 'Parcialmente nublado', icon: 'cloud-sun', image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800' },
  3: { code: 3, description: 'Nublado', icon: 'cloud', image: 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800' },
  45: { code: 45, description: 'Névoa', icon: 'cloud', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800' },
  48: { code: 48, description: 'Névoa com geada', icon: 'cloud', image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800' },
  51: { code: 51, description: 'Garoa leve', icon: 'cloud-drizzle', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800' },
  53: { code: 53, description: 'Garoa moderada', icon: 'cloud-drizzle', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800' },
  55: { code: 55, description: 'Garoa intensa', icon: 'cloud-drizzle', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800' },
  61: { code: 61, description: 'Chuva leve', icon: 'cloud-rain', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800' },
  63: { code: 63, description: 'Chuva moderada', icon: 'cloud-rain', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800' },
  65: { code: 65, description: 'Chuva intensa', icon: 'cloud-rain', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800' },
  71: { code: 71, description: 'Neve leve', icon: 'cloud-snow', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800' },
  73: { code: 73, description: 'Neve moderada', icon: 'cloud-snow', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800' },
  75: { code: 75, description: 'Neve intensa', icon: 'cloud-snow', image: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800' },
  80: { code: 80, description: 'Pancadas de chuva leves', icon: 'cloud-rain', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800' },
  81: { code: 81, description: 'Pancadas de chuva moderadas', icon: 'cloud-rain', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800' },
  82: { code: 82, description: 'Pancadas de chuva intensas', icon: 'cloud-rain', image: 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800' },
  95: { code: 95, description: 'Tempestade', icon: 'cloud-lightning', image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800' },
  96: { code: 96, description: 'Tempestade com granizo leve', icon: 'cloud-lightning', image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800' },
  99: { code: 99, description: 'Tempestade com granizo intenso', icon: 'cloud-lightning', image: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=800' },
};

export const fetchWeatherData = async (lat: number = -21.45, lon: number = -42.67): Promise<WeatherData> => {
  const baseUrl = 'https://api.open-meteo.com/v1/forecast';
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,surface_pressure,visibility,uv_index',
    hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,surface_pressure,precipitation',
    daily: 'temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,wind_speed_10m_max,uv_index_max',
    timezone: 'America/Sao_Paulo',
    forecast_days: '7'
  });

  try {
    const response = await fetch(`${baseUrl}?${params}`);
    if (!response.ok) {
      throw new Error('Falha ao buscar dados meteorológicos');
    }
    
    const data = await response.json();
    
    return {
      current: {
        temperature: data.current.temperature_2m,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        windDirection: data.current.wind_direction_10m,
        weatherCode: data.current.weather_code,
        pressure: data.current.surface_pressure,
        visibility: data.current.visibility,
        uvIndex: data.current.uv_index,
      },
      hourly: {
        time: data.hourly.time,
        temperature: data.hourly.temperature_2m,
        humidity: data.hourly.relative_humidity_2m,
        windSpeed: data.hourly.wind_speed_10m,
        windDirection: data.hourly.wind_direction_10m,
        weatherCode: data.hourly.weather_code,
        pressure: data.hourly.surface_pressure,
        precipitation: data.hourly.precipitation,
      },
      daily: {
        time: data.daily.time,
        temperatureMax: data.daily.temperature_2m_max,
        temperatureMin: data.daily.temperature_2m_min,
        weatherCode: data.daily.weather_code,
        precipitation: data.daily.precipitation_sum,
        windSpeedMax: data.daily.wind_speed_10m_max,
        uvIndexMax: data.daily.uv_index_max,
      }
    };
  } catch (error) {
    console.error('Erro ao buscar dados meteorológicos:', error);
    throw error;
  }
};

export const getWeatherCondition = (code: number): WeatherCondition => {
  return weatherConditions[code] || weatherConditions[0];
};
