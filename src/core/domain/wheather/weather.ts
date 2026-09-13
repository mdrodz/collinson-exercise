export interface WeatherProps
{
    time: string[];
    temperature: number[];
    humidity: number[];
    snowDepth: number[];
    snowfall: number[];
    showers: number[];
    rain: number[];
    precipitationProbability: number[];
    apparentTemperature: number[];
    windSpeed: number[];
    windGusts: number[];
    visibility: number[];
    weatherCode: number[];
    cloudCover: number[];
    uvIndex: number[];
}

export default class Weather
{
    private readonly time: Date[];
    private readonly temperature: number[];
    private readonly humidity: number[];
    private readonly snowDepth: number[];
    private readonly snowfall: number[];
    private readonly showers: number[];
    private readonly rain: number[];
    private readonly precipitationProbability: number[];
    private readonly apparentTemperature: number[];
    private readonly windSpeed: number[];
    private readonly windGusts: number[];
    private readonly visibility: number[];
    private readonly weatherCode: number[];
    private readonly cloudCover: number[];
    private readonly uvIndex: number[];

    constructor(props: WeatherProps)
    {
        Object.assign(this, props);
        this.time = props.time.map(time => new Date(time));
    }

    getWeatherReportsByDate(): [string, WeatherReport[]][]
    {
        const days = new Map<string, WeatherReport[]>();

        this.time.forEach((time, index) => {
            const key = new Intl.DateTimeFormat().format(time);
            const value = days.get(key) ?? [];

            const weatherReport: WeatherReport = {
                temperature: this.temperature[index],
                precipitation: this.precipitationProbability[index],
                wind: this.windSpeed[index],
                visibility: this.visibility[index],
                snowfall: this.snowfall[index],
                snowDepth: this.snowDepth[index],
                apparentTemperature: this.apparentTemperature[index],
                humidity: this.humidity[index],
                rain: this.rain[index],
                showers: this.showers[index],
                windGusts: this.windGusts[index],
                cloudCover: this.cloudCover[index],
                uvIndex: this.uvIndex[index],
                weatherCode: this.weatherCode[index]
            };
            
            days.set(key, [...value, weatherReport]);
        });

        return [...days.entries()];
    }
}

export interface WeatherReport
{
    temperature: number;
    precipitation: number;
    wind:  number;
    visibility: number;
    snowfall: number;
    snowDepth: number;
    apparentTemperature: number;
    humidity: number;
    rain: number;
    showers: number;
    windGusts: number;
    cloudCover: number;
    uvIndex: number;
    weatherCode: number;
}
