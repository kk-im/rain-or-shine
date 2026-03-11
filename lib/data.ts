import { Location, ForecastDay, WeatherSource } from './types';

export const DEFAULT_LOCATIONS: Location[] = [
  {name:'Canggu',country:'ID',temp:31,condition:'PARTLY CLOUDY',icon:'partly-cloudy',coords:'8.6478° S, 115.1385° E',morning:'Warm and hazy with high humidity. Patchy cloud cover from the start.',afternoon:'Increasing cloud, 67% chance of afternoon thunderstorms — classic wet-season pattern.',evening:'Showers likely clearing by dusk. Warm and muggy overnight.'},
  {name:'Seoul',country:'KR',temp:4,condition:'OVERCAST',icon:'cloudy',coords:'37.5665° N, 126.9780° E',morning:'Cold and grey. Overcast skies with light northerly winds.',afternoon:'Staying cloudy, possible light drizzle mid-afternoon.',evening:'Temperatures drop to near 0°. Clear pockets possible after midnight.'},
  {name:'Buenos Aires',country:'AR',temp:22,condition:'SUNNY',icon:'sun',coords:'34.6037° S, 58.3816° W',morning:'Bright and pleasant. Clear skies with a gentle southeast breeze.',afternoon:'Sunny and warm, low humidity — perfect conditions all day.',evening:'Comfortable evening, temperatures easing into the high teens.'},
  {name:'Lisbon',country:'PT',temp:18,condition:'PARTLY CLOUDY',icon:'partly-cloudy',coords:'38.7169° N, 9.1399° W',morning:'Mild start with some cloud. Atlantic breeze keeping it moderate.',afternoon:'Partial sun breaking through — warm spells likely.',evening:'Settled and calm. A pleasant evening with clear spells.'},
  {name:'Tbilisi',country:'GE',temp:9,condition:'RAIN',icon:'rain',coords:'41.6938° N, 44.8015° E',morning:'Cool with steady light rain expected through the morning.',afternoon:'Rain easing somewhat but staying overcast.',evening:'Drizzle possible. Cold by nightfall — temperatures near 5°.'},
];

export const SOURCES: WeatherSource[] = [
  {name:'OPENWEATHER',temp:31},
  {name:'TOMORROW.IO',temp:30},
  {name:'WEATHERAPI',temp:32},
  {name:'FORECA',temp:29},
  {name:'METEOBLUE',temp:31},
  {name:'WINDY.COM',temp:33},
];

export const FORECAST: ForecastDay[] = [
  {day:'SAT',icon:'partly-cloudy',hi:31,lo:25,rain:67},
  {day:'SUN',icon:'storm',hi:29,lo:24,rain:82},
  {day:'MON',icon:'rain',hi:30,lo:25,rain:55},
  {day:'TUE',icon:'sun',hi:33,lo:26,rain:12},
  {day:'WED',icon:'sun',hi:34,lo:27,rain:8},
  {day:'THU',icon:'partly-cloudy',hi:32,lo:25,rain:30},
  {day:'FRI',icon:'rain',hi:28,lo:24,rain:78},
];

export const SOURCES_BY_CITY: Record<string, WeatherSource[]> = {
  Canggu: SOURCES,
  Seoul: [
    {name:'OPENWEATHER',temp:4},{name:'TOMORROW.IO',temp:3},{name:'WEATHERAPI',temp:5},
    {name:'FORECA',temp:4},{name:'METEOBLUE',temp:3},{name:'WINDY.COM',temp:6},
  ],
  'Buenos Aires': [
    {name:'OPENWEATHER',temp:22},{name:'TOMORROW.IO',temp:21},{name:'WEATHERAPI',temp:23},
    {name:'FORECA',temp:22},{name:'METEOBLUE',temp:21},{name:'WINDY.COM',temp:24},
  ],
  Lisbon: [
    {name:'OPENWEATHER',temp:18},{name:'TOMORROW.IO',temp:17},{name:'WEATHERAPI',temp:19},
    {name:'FORECA',temp:18},{name:'METEOBLUE',temp:17},{name:'WINDY.COM',temp:20},
  ],
  Tbilisi: [
    {name:'OPENWEATHER',temp:9},{name:'TOMORROW.IO',temp:8},{name:'WEATHERAPI',temp:10},
    {name:'FORECA',temp:9},{name:'METEOBLUE',temp:8},{name:'WINDY.COM',temp:11},
  ],
};

export const FORECAST_BY_CITY: Record<string, ForecastDay[]> = {
  Canggu: FORECAST,
  Seoul: [
    {day:'SAT',icon:'cloudy',hi:4,lo:-1,rain:20},
    {day:'SUN',icon:'rain',hi:3,lo:-2,rain:65},
    {day:'MON',icon:'cloudy',hi:5,lo:0,rain:30},
    {day:'TUE',icon:'partly-cloudy',hi:7,lo:1,rain:15},
    {day:'WED',icon:'sun',hi:9,lo:2,rain:5},
    {day:'THU',icon:'sun',hi:10,lo:3,rain:8},
    {day:'FRI',icon:'cloudy',hi:6,lo:0,rain:25},
  ],
  'Buenos Aires': [
    {day:'SAT',icon:'sun',hi:22,lo:16,rain:5},
    {day:'SUN',icon:'sun',hi:24,lo:17,rain:3},
    {day:'MON',icon:'partly-cloudy',hi:23,lo:16,rain:10},
    {day:'TUE',icon:'sun',hi:25,lo:18,rain:2},
    {day:'WED',icon:'partly-cloudy',hi:22,lo:15,rain:15},
    {day:'THU',icon:'rain',hi:19,lo:14,rain:55},
    {day:'FRI',icon:'sun',hi:21,lo:15,rain:8},
  ],
  Lisbon: [
    {day:'SAT',icon:'partly-cloudy',hi:18,lo:12,rain:20},
    {day:'SUN',icon:'sun',hi:19,lo:13,rain:10},
    {day:'MON',icon:'sun',hi:20,lo:13,rain:5},
    {day:'TUE',icon:'partly-cloudy',hi:18,lo:11,rain:25},
    {day:'WED',icon:'rain',hi:16,lo:10,rain:60},
    {day:'THU',icon:'rain',hi:15,lo:9,rain:70},
    {day:'FRI',icon:'partly-cloudy',hi:17,lo:11,rain:30},
  ],
  Tbilisi: [
    {day:'SAT',icon:'rain',hi:9,lo:4,rain:75},
    {day:'SUN',icon:'rain',hi:8,lo:3,rain:80},
    {day:'MON',icon:'cloudy',hi:10,lo:5,rain:40},
    {day:'TUE',icon:'partly-cloudy',hi:12,lo:6,rain:20},
    {day:'WED',icon:'sun',hi:14,lo:7,rain:10},
    {day:'THU',icon:'partly-cloudy',hi:13,lo:6,rain:25},
    {day:'FRI',icon:'rain',hi:10,lo:4,rain:65},
  ],
};

export const ICON_TO_COND: Record<string, string> = {
  'sun':'CLEAR','partly-cloudy':'PARTLY CLOUDY',
  'cloudy':'OVERCAST','rain':'RAIN','storm':'THUNDERSTORM'
};
