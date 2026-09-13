export default class Coordinate
{
    constructor(
        private readonly latitude: number,
        private readonly longitude: number
    )
    {
    }

    getLatitude(): number
    {
        return this.latitude;
    }

    getLongitude(): number
    {
        return this.longitude;
    }
}
