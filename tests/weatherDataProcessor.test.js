const { describe, test, expect } = require('@jest/globals');

const fetchWeatherData = require('../src/WeatherDataProcessor');
const axios = require('axios');

jest.mock('axios');

describe('fetchWeatherData', () => {
  const API_URL = 'https://example.com/weather';
  const API_KEY = 'test-api-key';
  const designRegion = 'Test Region';

  test('fetches and parses weather data correctly', async () => {
    const mockResponse = {
      data: {
        location: {
          location: 'Test Region',
          degreeDays: '2483',
          groundTemp: '9',
          postcode: 'TEST123',
          lat: '55.424',
          lng: '-1.583',
        },
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    const result = await fetchWeatherData(API_URL, API_KEY, designRegion);

    expect(result).toEqual({
      location: 'Test Region',
      degreeDays: 2483,
      groundTemp: 9,
      postcode: 'TEST123',
      lat: 55.424,
      lng: -1.583,
    });

    expect(axios.get).toHaveBeenCalledWith(
      `${API_URL}?location=${designRegion}`,
      {
        headers: { 'x-api-key': API_KEY },
      }
    );
  });

  test('throws error for unknown location (404)', async () => {
    axios.get.mockRejectedValue({
      response: {
        status: 404,
        data: { error: 'Unknown Location' },
      },
    });

    await expect(
      fetchWeatherData(API_URL, API_KEY, designRegion)
    ).rejects.toThrow('Warning: Could not find design region');
  });

  test('throws error for critical teapot error (418)', async () => {
    axios.get.mockRejectedValue({
      response: {
        status: 418,
        data: { error: 'Critical teapot error, please try again' },
      },
    });

    await expect(
      fetchWeatherData(API_URL, API_KEY, designRegion)
    ).rejects.toThrow('Critical teapot error, please try coffee instead');
  });

  test('throws generic error for other issues', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(
      fetchWeatherData(API_URL, API_KEY, designRegion)
    ).rejects.toThrow('Error fetching weather data - Network Error');
  });
});
