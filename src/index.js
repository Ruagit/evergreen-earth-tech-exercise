const {
  heatLosskWh,
  powerHeatLossKw,
  heatPumpSelection,
  totalCost,
} = require('./calculations');
const fetchWeatherData = require('./WeatherDataProcessor');
const {
  errorSummaryTemplate,
  outputSummaryTemplate,
} = require('./summaryTemplates');
const { validHouseData, validHeatPumpData } = require('./typeChecks');

const API_KEY = 'f661f74e-20a7-4e9f-acfc-041cfb846505';
const API_URL =
  'https://063qqrtqth.execute-api.eu-west-2.amazonaws.com/v1/weather';
const VAT_RATE = 0.05;

const executeSummary = async () => {
  console.log('Summarising your options...');

  let submissionId;
  let heatLosskWhTotal;
  const houseData = validHouseData();
  const heatPumpData = validHeatPumpData();

  for (const house of houseData) {
    console.log('');
    console.log('Processing house:', house.submissionId);

    try {
      submissionId = house.submissionId;
      heatLosskWhTotal = heatLosskWh(
        house.floorArea,
        house.heatingFactor,
        house.insulationFactor
      );

      const weatherLocationData = await fetchWeatherData(
        API_URL,
        API_KEY,
        house.designRegion
      );
      const powerHeatLossKwTotal = powerHeatLossKw(
        heatLosskWhTotal,
        weatherLocationData.degreeDays
      );
      const recommendedHeatPump = heatPumpSelection(
        powerHeatLossKwTotal,
        heatPumpData
      );
      const totalCostWithVat = totalCost(recommendedHeatPump, VAT_RATE);

      outputSummaryTemplate(
        submissionId,
        heatLosskWhTotal,
        house.designRegion,
        powerHeatLossKwTotal,
        recommendedHeatPump,
        totalCostWithVat
      );
    } catch (error) {
      if (error.message === 'Warning: Could not find design region') {
        errorSummaryTemplate(submissionId, heatLosskWhTotal, error.message);
      } else {
        console.log('');
        console.log(error.message);
        console.log('');
        console.log(
          'Summary Completed with Errors for submissionId:',
          submissionId
  );
      }
    }
  }
  console.log('');
  console.log('Summary Complete...');
  console.log('');
};

executeSummary();

module.exports = { executeSummary };
