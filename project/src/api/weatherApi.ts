const WEATHER_API_KEY = 'afe57690459c6416445353bd4fd08d03';
const WEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

export interface WeatherResponse {
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  name: string;
  dt: number;
}

export interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
      deg: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
  };
}

export async function fetchWeatherForecast(city: string, state: string, targetDate: Date, country: string = 'US'): Promise<WeatherResponse> {
  try {
    // Use 5 day forecast endpoint
    const response = await fetch(
      `${WEATHER_API_BASE}/forecast?q=${city},${state},${country}&units=imperial&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error! status: ${response.status}`);
    }

    const data = await response.json() as ForecastResponse;
    
    // Set target date to noon of that day to find closest forecast
    const targetDateTime = new Date(targetDate);
    targetDateTime.setHours(12, 0, 0, 0);
    const targetTimestamp = Math.floor(targetDateTime.getTime() / 1000);

    // Find forecast entry closest to target date's noon
    let closestForecast = data.list[0];
    let closestDiff = Math.abs(data.list[0].dt - targetTimestamp);

    for (const forecast of data.list) {
      const diff = Math.abs(forecast.dt - targetTimestamp);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestForecast = forecast;
      }
    }

    // If the closest forecast is more than 5 days away, throw an error
    const fiveDaysFromNow = new Date();
    fiveDaysFromNow.setDate(fiveDaysFromNow.getDate() + 5);
    if (targetDate > fiveDaysFromNow) {
      throw new Error('Forecast only available for the next 5 days');
    }

    // Convert forecast entry to WeatherResponse format
    return {
      weather: closestForecast.weather,
      main: closestForecast.main,
      wind: closestForecast.wind,
      name: data.city.name,
      dt: closestForecast.dt
    };
  } catch (error) {
    throw error;
  }
}

// Keep the current weather function for reference or other uses
export async function fetchCurrentWeather(city: string, state: string, country: string = 'US'): Promise<WeatherResponse> {
  try {
    const response = await fetch(
      `${WEATHER_API_BASE}/weather?q=${city},${state},${country}&units=imperial&appid=${WEATHER_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Weather API error! status: ${response.status}`);
    }

    const data = await response.json() as WeatherResponse;
    return data;
  } catch (error) {
    throw error;
  }
} 