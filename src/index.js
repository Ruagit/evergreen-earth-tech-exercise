
const heatPumpData = require('../data/heat-pumps.json');
const housesData = require('../data/houses.json');
const { heatLosskWh,
  powerHeatLossKw,
  heatPumpSelection,
  totalCost
} = require('./calculations');
const fetchWeatherData = require('./WeatherDataProcessor');
const { errorSummaryTemplate, outputSummaryTemplate } = require('./summaryTemplates');

const API_KEY = "f661f74e-20a7-4e9f-acfc-041cfb846505";
const API_URL = "https://063qqrtqth.execute-api.eu-west-2.amazonaws.com/v1/weather";
const VAT_RATE = 0.05;

const executeSummary = async  () => {
  console.log("Summarising your options...");
  let submissionId;
  let heatLosskWhTotal;
 
    for(const house of housesData) { 
      console.log("")
      console.log("Processing house:", house.submissionId);
      try {
      submissionId = house.submissionId;
      heatLosskWhTotal = heatLosskWh(house.floorArea, house.heatingFactor, house.insulationFactor);
      const weatherLocationData = await fetchWeatherData(API_URL, API_KEY, house.designRegion);
      const powerHeatLossKwTotal = powerHeatLossKw(heatLosskWhTotal, weatherLocationData.degreeDays);
      const recommendedHeatPump = heatPumpSelection(powerHeatLossKwTotal, heatPumpData);
      const totalCostWithVat = totalCost(recommendedHeatPump, VAT_RATE);

      outputSummaryTemplate(submissionId, heatLosskWhTotal, house.designRegion, powerHeatLossKwTotal, recommendedHeatPump, totalCostWithVat);
    } catch (error) {

    if(error.message === "Warning: Could not find design region") {
      errorSummaryTemplate(submissionId, heatLosskWhTotal, error.message);
    } else if (error.message === "Critical teapot error, please try coffee instead" ){
      console.log(error.message);
    } else {
      console.log("")
      console.log("Summary Completed with Errors for submissionId:", submissionId, error.message);
    }
  }
  }
  console.log("Summary Complete...");
  console.log("")

}


executeSummary();