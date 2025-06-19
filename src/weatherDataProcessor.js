const axios = require('axios');
const z = require('zod');

const weatherResponseSchema = z.object({
  location: z.string(),
  degreeDays: z.coerce.number(),
  groundTemp: z.coerce.number(), 
  postcode: z.string(),
  lat: z.coerce.number(),     
  lng: z.coerce.number(),   
});


const fetchWeatherData = async (API_URL, API_KEY, designRegion) => {
  try {
    const response = await axios.get(`${API_URL}?location=${designRegion}`, {
      headers: {
        'x-api-key': API_KEY
      }
    });

    const rawLocationData = response?.data?.location;

    const parsedLocationData = weatherResponseSchema.parse(rawLocationData);

    return parsedLocationData;
  } catch (error) {
    throw new Error("Warning: Could not find design region");
  }
}


module.exports = fetchWeatherData;