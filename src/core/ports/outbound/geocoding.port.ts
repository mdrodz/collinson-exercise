import Coordinate from "../../domain/geocoding/coordinate.js";

export const GEOCODING_PORT = Symbol('GeocodingPort');

export interface GeocodingPort
{
    fetchCoordinates(city: string, country: string): Promise<Coordinate>;
}
