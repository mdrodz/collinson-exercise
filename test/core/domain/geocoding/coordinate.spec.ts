import Coordinate from '../../../../src/core/domain/geocoding/coordinate.js';

describe('Coordinate', () => {
    it('returns its latitude and longitude', () => {
        const coordinate = new Coordinate(51.5074, -0.1278);

        expect(coordinate.getLatitude()).toBe(51.5074);
        expect(coordinate.getLongitude()).toBe(-0.1278);
    });
});
