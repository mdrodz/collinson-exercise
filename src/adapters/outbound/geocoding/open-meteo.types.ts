export interface OpenMeteoGeocodingResponse
{
  results?: Array<{
    latitude: number;
    longitude: number;
  }>;
}
