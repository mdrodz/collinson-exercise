import { GraphQLResponse } from "../../types/GraphQLResponse";
import { Weather } from "../../types/Weather";

export default async function loadWeather(city: string, country: string): Promise<Weather | undefined>
{
    const response = await fetch(`${import.meta.env.VITE_API_URL ?? 'http://localhost:3000'}/graphql`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'appliation/json'
        },
        body: JSON.stringify({
            query: WEATHER_QUERY,
            variables: { city, country }
        }),
    });
    if (!response.ok) {
        throw new Error('Unable to load this forecast.');
    }

    const json = await response.json() as GraphQLResponse<'weather', Weather>;

    return json.data.weather;
}

const WEATHER_QUERY = `
  query Weather($city: String!, $country: String!) {
    weather(city: $city, country: $country) {
      days { date activities { activity score label } }
    }
  }
`;
