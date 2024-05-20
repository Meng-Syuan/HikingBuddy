import getGeoJSON from '../utils/getGeoJSON';
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';

describe('getGeoJSON', () => {
  const mockResponse = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [120.94984, 23.466464],
        },
      },
    ],
  };

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockResponse),
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('geopointSearch should return valid GeoJSON', async () => {
    const lat = 23.46644;
    const lng = 120.94984;
    const result = await getGeoJSON.geopointSearch(lat, lng);

    expect(result).toHaveProperty('type', 'FeatureCollection');
    expect(result.features[0]).toHaveProperty('type', 'Feature');
    expect(result).toEqual(mockResponse);
  });
});
