const { describe, test, expect } = require('@jest/globals');

jest.mock('../data/houses.json', () => [
  {
    submissionId: 'e21a3149-b88c-40e9-86fd-c94a6b93cb78',
    designRegion: 'W Pennines (Ringway)',
    floorArea: 92,
    age: '1991 - 1995',
    heatingFactor: 88,
    insulationFactor: 1.1,
  },
]);

jest.mock('../data/heat-pumps.json', () => [
  {
    label: '8kW Package',
    outputCapacity: 8,
    costs: [
      {
        label:
          'Design & Supply of your Air Source Heat Pump System Components (8kW)',
        cost: 4216,
      },
      {
        label:
          'Installation of your Air Source Heat Pump and Hot Water Cylinder',
        cost: 2900,
      },
      {
        label: 'Supply & Installation of your Homely Smart Thermostat',
        cost: 150,
      },
      { label: 'Supply & Installation of a new Consumer Unit', cost: 300 },
      {
        label: 'MCS System Commissioning & HIES Insurance-backed Warranty',
        cost: 1648,
      },
    ],
  },
]);

const fetchWeatherData = require('../src/WeatherDataProcessor');
const {
  heatLosskWh,
  powerHeatLossKw,
  heatPumpSelection,
  totalCost,
} = require('../src/calculations');
const {
  errorSummaryTemplate,
  outputSummaryTemplate,
} = require('../src/summaryTemplates');
const { executeSummary } = require('../src/index');

jest.mock('../src/WeatherDataProcessor');
jest.mock('../src/summaryTemplates');
jest.mock('../src/calculations');

describe('executeSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('processes houses and outputs summaries correctly', async () => {
    fetchWeatherData.mockResolvedValue({ degreeDays: 180 });
    heatLosskWh.mockReturnValue(10800);
    powerHeatLossKw.mockReturnValue(60);
    heatPumpSelection.mockReturnValue({
      submissionId: 'e21a3149-b88c-40e9-86fd-c94a6b93cb78',
      designRegion: 'W Pennines (Ringway)',
      floorArea: 92,
      age: '1991 - 1995',
      heatingFactor: 88,
      insulationFactor: 1.1,
    });
    totalCost.mockReturnValue(9674.7);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await executeSummary();

    expect(fetchWeatherData).toHaveBeenCalledTimes(1);
    expect(heatLosskWh).toHaveBeenCalledTimes(1);
    expect(powerHeatLossKw).toHaveBeenCalledTimes(1);
    expect(heatPumpSelection).toHaveBeenCalledTimes(1);
    expect(totalCost).toHaveBeenCalledTimes(1);
    expect(outputSummaryTemplate).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });

  test('handle missing design region', async () => {
    fetchWeatherData.mockRejectedValue(
      new Error('Warning: Could not find design region')
    );
    heatLosskWh.mockReturnValue(10800);

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await executeSummary();

    expect(errorSummaryTemplate).toHaveBeenCalledTimes(1);
    expect(outputSummaryTemplate).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test('handles critical teapot error', async () => {
    fetchWeatherData.mockRejectedValue(
      new Error('Critical teapot error, please try coffee instead')
    );

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await executeSummary();

    expect(console.log).toHaveBeenCalledWith(
      'Critical teapot error, please try coffee instead'
    );
    expect(errorSummaryTemplate).not.toHaveBeenCalled();
    expect(outputSummaryTemplate).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  test('handles generic errors', async () => {
    fetchWeatherData.mockRejectedValue(new Error('Network Error'));

    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    await executeSummary();
    expect(console.log).toHaveBeenCalledWith('Network Error');
    expect(errorSummaryTemplate).not.toHaveBeenCalled();
    expect(outputSummaryTemplate).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
