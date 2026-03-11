export interface Location {
  name: string;
  country: string;
  temp: number;
  condition: string;
  icon: string;
  coords: string;
  morning: string;
  afternoon: string;
  evening: string;
}

export interface ForecastDay {
  day: string;
  icon: string;
  hi: number;
  lo: number;
  rain: number;
}

export interface WeatherSource {
  name: string;
  temp: number;
}
