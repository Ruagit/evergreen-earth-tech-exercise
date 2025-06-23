const axios = require('axios');
const { weatherResponseSchema } = require('./typeChecks');

const fetchWeatherData = async (API_URL, API_KEY, designRegion) => {
  try {
    const response = await axios.get(`${API_URL}?location=${designRegion}`, {
      headers: {
        'x-api-key': API_KEY,
      },
    });

    const rawLocationData = response?.data?.location;

    const parsedLocationData = weatherResponseSchema.safeParse(rawLocationData);
    if (!parsedLocationData.success) {
      throw new Error(
        'Invalid weather data format received: ' +
          JSON.stringify(parsedLocationData.error)
      );
    }
 
    return parsedLocationData.data;
  } catch (error) {
    if (
      error.response?.status === 404 &&
      error.response?.data?.error === 'Unknown Location'
    ) {
      throw new Error('Warning: Could not find design region');
    }

    if (
      error.response?.status === 418 &&
      error.response?.data?.error === 'Critical teapot error, please try again'
    ) {
      throw new Error('Critical teapot error, please try coffee instead');
    }

    throw new Error('Error fetching weather data - ' + error?.message);
  }
};

module.exports = fetchWeatherData;
