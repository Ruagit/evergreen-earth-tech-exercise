const { describe, test, expect } = require('@jest/globals');

const {
  heatLosskWh,
  powerHeatLossKw,
  heatPumpSelection,
  totalCost,
} = require('../src/calculations');

describe('heatLosskWh', () => {
  test('calculates heat loss correctly for valid inputs', () => {
    expect(heatLosskWh(100, 90, 1.2)).toBe(10800);
  });
});

describe('powerHeatLossKw', () => {
  test('calculates power heat loss correctly for valid inputs', () => {
    expect(powerHeatLossKw(10800, 180)).toBe(60);
  });
});

describe('heatPumpSelection', () => {
  const heatPumpOptions = [
    { label: '5kW Package', outputCapacity: 5 },
    { label: '8kW Package', outputCapacity: 8 },
    { label: '12kW Package', outputCapacity: 12 },
  ];

  test('selects the best-fit heat pump for valid inputs', () => {
    const result = heatPumpSelection(7, heatPumpOptions);
    expect(result).toEqual({ label: '8kW Package', outputCapacity: 8 });
  });

  test('throws error when no suitable heat pump is found', () => {
    expect(() => heatPumpSelection(20, heatPumpOptions)).toThrow(
      'No suitable heat pump found for the given power heat loss.'
    );
  });
});

describe('totalCost', () => {
  const heatPump = {
    costs: [
      { label: 'supply and installation of A', cost: 100 },
      { label: 'design & supply of heat pump A', cost: 200 },
    ],
  };

  test('calculates total cost with VAT correctly for valid inputs', () => {
    expect(totalCost(heatPump, 0.05)).toBe(315);
  });
});
