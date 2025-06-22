const z = require('zod');
const heatPumpData = require('../data/heat-pumps.json');
const housesData = require('../data/houses.json');

const weatherResponseSchema = z.object({
  location: z.string(),
  degreeDays: z.coerce.number(),
  groundTemp: z.coerce.number(),
  postcode: z.string(),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
});


const houseDataSchema = z.object({
  submissionId: z.string(),
  designRegion: z.string(),
  floorArea: z.coerce.number(),
  age: z.string(),
  heatingFactor: z.coerce.number(),
  insulationFactor: z.coerce.number(),
});

const heatPumpSchema = z.object({
  label: z.string(),
  outputCapacity: z.coerce.number(),
  costs: z.array(
    z.object({
      label: z.string(),
      cost: z.coerce.number(),
    })
  ),
});

const validHouseData = () => {
  let validHouses = [];
   for (const house of housesData) {
    const parsedHouse = houseDataSchema.safeParse(house);
    if (!parsedHouse.success) {
      console.log(
        `Invalid house data format: ${JSON.stringify(parsedHouse.error)}`
      );
    }
    validHouses.push(parsedHouse.data);
  }
  return validHouses;
};

const validHeatPumpData = () => {
  let validHeatPumps = [];
  for (const heatPump of heatPumpData) {
    const parsedHeatPump = heatPumpSchema.safeParse(heatPump);
    if (!parsedHeatPump.success) {
      console.log(
        `Invalid heat pump data format: ${JSON.stringify(parsedHeatPump.error)}`
      );
    }
    validHeatPumps.push(parsedHeatPump.data);
  }
  return validHeatPumps;
};

module.exports = { weatherResponseSchema, validHouseData, validHeatPumpData  };