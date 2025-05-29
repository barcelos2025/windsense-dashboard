
import React from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import DashboardHeader from '@/components/DashboardHeader';
import WeatherForecast from '@/components/WeatherForecast';

const Weather = () => {
  return (
    <DashboardLayout>
      <DashboardHeader 
        title="Previsão do Tempo" 
        subtitle="Dados meteorológicos da região de Leopoldina e Cataguases, MG" 
      />
      
      <WeatherForecast />
    </DashboardLayout>
  );
};

export default Weather;
