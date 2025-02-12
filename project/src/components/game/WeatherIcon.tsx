import { useState } from 'react';
import { Cloud, AlertCircle } from 'lucide-react';
import { fetchWeatherForecast, type WeatherResponse } from '../../api/weatherApi';

interface WeatherIconProps {
  city: string;
  state: string;
  date: Date;
}

export function WeatherIcon({ city, state, date }: WeatherIconProps) {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showWeather, setShowWeather] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent game selection when clicking weather icon
    
    if (showWeather) {
      setShowWeather(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherForecast(city, state, date);
      setWeather(data);
      setShowWeather(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather forecast');
      setShowWeather(true);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`p-1.5 hover:bg-gray-100 rounded-full text-gray-500 
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'}
          transition-colors`}
      >
        <Cloud className="w-4 h-4" />
      </button>

      {showWeather && (weather || error) && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 p-3">
          {error ? (
            <div className="flex items-center text-red-600">
              <AlertCircle className="w-4 h-4 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          ) : weather && (
            <div className="space-y-2">
              <div className="font-medium text-gray-900">
                {weather.name} - {formatDate(weather.dt)}
              </div>
              <div className="text-sm text-gray-600">
                <div>Temperature: {Math.round(weather.main.temp)}°F</div>
                <div>Feels like: {Math.round(weather.main.feels_like)}°F</div>
                <div>Conditions: {weather.weather[0].description}</div>
                <div>Wind: {Math.round(weather.wind.speed)} mph</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 