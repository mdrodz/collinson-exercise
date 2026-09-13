import { Injectable } from "@nestjs/common";
import { GeocodingPort } from "../../../core/ports/outbound/geocoding.port.js";
import Coordinate from "../../../core/domain/geocoding/coordinate.js";
import { URLSearchParams } from "node:url";
import { OpenMeteoGeocodingResponse } from "./open-meteo.types.js";

@Injectable()
export class OpenMeteoGeocodingAdapter implements GeocodingPort
{
    async fetchCoordinates(city: string, country: string): Promise<Coordinate>
    {
        const query = new URLSearchParams({
            name: `${city.trim()},${country.trim()}`,
            language: 'en',
            format: 'json',
            count: '1'
        });
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?${query.toString()}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch coordinates: ${response.status} ${response.statusText}`);
        }

        const data: OpenMeteoGeocodingResponse = await response.json();
        
        if (!data.results || data.results.length === 0) {
            throw new Error(`No coordinates found for city: ${city}, country: ${country}`);
        }

        const { latitude, longitude } = data.results[0];

        return new Coordinate(latitude, longitude);
    }
}
