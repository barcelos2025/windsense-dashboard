
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WeatherData, fetchWeatherData, getWeatherCondition } from '@/services/weatherAPI';
import { toast } from "@/hooks/use-toast";
import { 
  Wind, 
  Thermometer, 
  Eye, 
  Sun, 
  Cloud, 
  CloudDrizzle, 
  CloudRain, 
  CloudSnow, 
  CloudLightning,
  CloudSun,
  Cloudy
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ForecastPeriod = 'current' | 'hourly' | 'daily';

// Função para obter o ícone correto baseado no código do tempo
const getWeatherIcon = (weatherCode: number) => {
  const iconMap = {
    0: Sun, // Céu limpo
    1: CloudSun, // Parcialmente nublado
    2: CloudSun, // Parcialmente nublado
    3: Cloud, // Nublado
    45: Cloud, // Névoa
    48: Cloud, // Névoa com geada
    51: CloudDrizzle, // Garoa leve
    53: CloudDrizzle, // Garoa moderada
    55: CloudDrizzle, // Garoa intensa
    61: CloudRain, // Chuva leve
    63: CloudRain, // Chuva moderada
    65: CloudRain, // Chuva intensa
    71: CloudSnow, // Neve leve
    73: CloudSnow, // Neve moderada
    75: CloudSnow, // Neve intensa
    80: CloudRain, // Pancadas de chuva leves
    81: CloudRain, // Pancadas de chuva moderadas
    82: CloudRain, // Pancadas de chuva intensas
    95: CloudLightning, // Tempestade
    96: CloudLightning, // Tempestade com granizo leve
    99: CloudLightning, // Tempestade com granizo intenso
  };
  
  return iconMap[weatherCode] || Sun;
};

// Função para obter a imagem de fundo baseada no código do tempo
const getWeatherBackgroundImage = (weatherCode: number) => {
  // Ensolarado/Céu limpo
  if (weatherCode === 0) {
    return 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800';
  }
  
  // Parcialmente nublado
  if (weatherCode >= 1 && weatherCode <= 3) {
    return 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800';
  }
  
  // Névoa
  if (weatherCode >= 45 && weatherCode <= 48) {
    return 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=800';
  }
  
  // Chuva (garoa e chuva)
  if ((weatherCode >= 51 && weatherCode <= 65) || (weatherCode >= 80 && weatherCode <= 82)) {
    return 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800';
  }
  
  // Neve
  if (weatherCode >= 71 && weatherCode <= 75) {
    return 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800';
  }
  
  // Tempestade
  if (weatherCode >= 95 && weatherCode <= 99) {
    return 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800';
  }
  
  // Default: ensolarado
  return 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800';
};

const WeatherForecast: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<ForecastPeriod>('current');

  useEffect(() => {
    const loadWeatherData = async () => {
      try {
        setLoading(true);
        const data = await fetchWeatherData();
        setWeatherData(data);
      } catch (error) {
        console.error('Erro ao carregar dados meteorológicos:', error);
        toast({
          title: "Erro ao carregar previsão do tempo",
          description: "Não foi possível carregar os dados meteorológicos.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadWeatherData();
    
    // Atualizar a cada 10 minutos
    const interval = setInterval(loadWeatherData, 600000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-lg text-muted-foreground">Carregando previsão do tempo...</p>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <Card>
        <CardContent className="text-center py-10">
          <p className="text-lg text-muted-foreground">Dados meteorológicos não disponíveis</p>
        </CardContent>
      </Card>
    );
  }

  const currentCondition = getWeatherCondition(weatherData.current.weatherCode);
  const CurrentWeatherIcon = getWeatherIcon(weatherData.current.weatherCode);
  const backgroundImage = getWeatherBackgroundImage(weatherData.current.weatherCode);

  return (
    <div className="space-y-6">
      {/* Seletor de período */}
      <div className="flex gap-2">
        <Button
          variant={selectedPeriod === 'current' ? 'default' : 'outline'}
          onClick={() => setSelectedPeriod('current')}
          className="text-lg px-6 py-3"
        >
          Atual
        </Button>
        <Button
          variant={selectedPeriod === 'hourly' ? 'default' : 'outline'}
          onClick={() => setSelectedPeriod('hourly')}
          className="text-lg px-6 py-3"
        >
          Por Hora
        </Button>
        <Button
          variant={selectedPeriod === 'daily' ? 'default' : 'outline'}
          onClick={() => setSelectedPeriod('daily')}
          className="text-lg px-6 py-3"
        >
          7 Dias
        </Button>
      </div>

      {/* Previsão atual */}
      {selectedPeriod === 'current' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card principal */}
          <Card className="relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            >
              <div className="absolute inset-0 bg-black/50" />
            </div>
            <CardContent className="relative z-10 text-white p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-6xl font-bold mb-2">
                    {Math.round(weatherData.current.temperature)}°C
                  </h2>
                  <p className="text-2xl opacity-90">{currentCondition.description}</p>
                  <p className="text-lg opacity-75">
                    Leopoldina, MG - {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </p>
                </div>
                <div className="text-6xl opacity-75">
                  <CurrentWeatherIcon size={72} />
                </div>
              </div>
              
              {/* Detalhes adicionais */}
              <div className="grid grid-cols-2 gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <Wind className="h-6 w-6" />
                  <span>Vento: {Math.round(weatherData.current.windSpeed)} km/h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-6 w-6" />
                  <span>Visibilidade: {Math.round(weatherData.current.visibility / 1000)} km</span>
                </div>
                <div>
                  <span>Umidade: {weatherData.current.humidity}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="h-6 w-6" />
                  <span>UV: {weatherData.current.uvIndex}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Métricas detalhadas */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Pressão Atmosférica</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Math.round(weatherData.current.pressure)} hPa</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Direção do Vento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Math.round(weatherData.current.windDirection)}°</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Umidade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{weatherData.current.humidity}%</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Índice UV</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{weatherData.current.uvIndex}</div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Previsão por hora */}
      {selectedPeriod === 'hourly' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Previsão por Hora - Próximas 24h</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weatherData.hourly.time.slice(0, 24).map((time, index) => {
                const HourWeatherIcon = getWeatherIcon(weatherData.hourly.weatherCode[index]);
                return (
                  <div key={time} className="text-center p-8 rounded-lg bg-secondary/50 border border-border">
                    <div className="text-xl font-medium text-muted-foreground mb-6">
                      {format(new Date(time), 'HH:mm')}
                    </div>
                    <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                      <HourWeatherIcon className="h-16 w-16" />
                    </div>
                    <div className="font-semibold text-3xl mb-3">
                      {Math.round(weatherData.hourly.temperature[index])}°
                    </div>
                    <div className="text-lg text-muted-foreground">
                      Precipitação: {Math.round(weatherData.hourly.precipitation[index])}mm
                    </div>
                    <div className="text-lg text-muted-foreground mt-2">
                      Vento: {Math.round(weatherData.hourly.windSpeed?.[index] || 0)} km/h
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previsão semanal */}
      {selectedPeriod === 'daily' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Previsão de 7 Dias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weatherData.daily.time.map((date, index) => {
                const DayWeatherIcon = getWeatherIcon(weatherData.daily.weatherCode[index]);
                const dayCondition = getWeatherCondition(weatherData.daily.weatherCode[index]);
                return (
                  <div key={date} className="flex items-center justify-between p-6 rounded-lg bg-secondary/30">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 flex items-center justify-center">
                        <DayWeatherIcon className="h-12 w-12" />
                      </div>
                      <div>
                        <div className="font-medium text-xl">
                          {format(new Date(date), "EEEE", { locale: ptBR })}
                        </div>
                        <div className="text-lg text-muted-foreground">
                          {dayCondition.description}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-xl">
                        {Math.round(weatherData.daily.temperatureMax[index])}° / {Math.round(weatherData.daily.temperatureMin[index])}°
                      </div>
                      <div className="text-lg text-muted-foreground">
                        {Math.round(weatherData.daily.precipitation[index])}mm
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WeatherForecast;
