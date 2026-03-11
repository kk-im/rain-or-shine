export function toF(c: number): number { return Math.round(c * 9/5 + 32) }
export function fmt(temp: number, unit: 'C' | 'F'): number { return unit === 'C' ? temp : toF(temp) }

export interface ConditionInfo {
  condition: string;
  icon: string;
  morningDesc: string;
  afternoonDesc: string;
  eveningDesc: string;
}

export function wcodeToCondition(code: number | null): ConditionInfo {
  if (code == null) return {condition:'PARTLY CLOUDY',icon:'partly-cloudy',morningDesc:'Mild and variable.',afternoonDesc:'Variable cloud.',eveningDesc:'Comfortable overnight.'};
  if (code === 0) return {condition:'CLEAR',icon:'sun',morningDesc:'Clear and bright from the start.',afternoonDesc:'Sunny and warm.',eveningDesc:'Clear skies and pleasant.'};
  if (code <= 2) return {condition:'PARTLY CLOUDY',icon:'partly-cloudy',morningDesc:'Mix of sun and cloud.',afternoonDesc:'Partly sunny intervals.',eveningDesc:'Cloud clearing overnight.'};
  if (code === 3) return {condition:'OVERCAST',icon:'cloudy',morningDesc:'Grey and overcast.',afternoonDesc:'Persistent cloud cover.',eveningDesc:'Staying overcast.'};
  if (code <= 49) return {condition:'FOGGY',icon:'cloudy',morningDesc:'Fog possible early.',afternoonDesc:'Fog lifting by midday.',eveningDesc:'Clear after fog clears.'};
  if (code <= 59) return {condition:'DRIZZLE',icon:'rain',morningDesc:'Light drizzle expected.',afternoonDesc:'Drizzle on and off.',eveningDesc:'Drizzle clearing.'};
  if (code <= 69) return {condition:'RAIN',icon:'rain',morningDesc:'Rain likely from the start.',afternoonDesc:'Showers continuing.',eveningDesc:'Rain easing by evening.'};
  if (code <= 79) return {condition:'SNOW',icon:'storm',morningDesc:'Snow expected — dress warmly.',afternoonDesc:'Heavy snow possible.',eveningDesc:'Freezing overnight.'};
  if (code <= 82) return {condition:'HEAVY RAIN',icon:'rain',morningDesc:'Heavy rain showers.',afternoonDesc:'Intense showers, stay prepared.',eveningDesc:'Showers easing.'};
  if (code <= 86) return {condition:'SNOW SHOWERS',icon:'storm',morningDesc:'Snow showers early.',afternoonDesc:'Snow showers continuing.',eveningDesc:'Very cold overnight.'};
  if (code <= 99) return {condition:'THUNDERSTORM',icon:'storm',morningDesc:'Risk of thunderstorms early.',afternoonDesc:'Thunderstorm likely — stay indoors.',eveningDesc:'Storms passing, clearing late.'};
  return {condition:'VARIABLE',icon:'partly-cloudy',morningDesc:'Variable conditions.',afternoonDesc:'Changeable throughout.',eveningDesc:'Unsettled overnight.'};
}
