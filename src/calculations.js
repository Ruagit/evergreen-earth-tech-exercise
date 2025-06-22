const heatLosskWh = (floorArea, heatingFactor, insulationFactor) => {
  // floorArea (m^2) * heatingFactor * insulationFactor = heat loss (kWh)
  return floorArea * heatingFactor * insulationFactor;
};

const powerHeatLossKw = (heatLosskWhTotal, heatingDegreeDays) => {
  //  heat loss (kWh) / heating degree days = Power heat loss (kW)
  return heatLosskWhTotal / heatingDegreeDays;
};

const heatPumpSelection = (powerHeatLossKwTotal, heatPumpOptions) => {
  let bestFit = null;

  for (const heatPump of heatPumpOptions) {
    if (heatPump.outputCapacity >= powerHeatLossKwTotal) {
      if (!bestFit || heatPump.outputCapacity < bestFit.outputCapacity) {
        bestFit = heatPump;
      }
    }
  }

  if (!bestFit) {
    throw new Error(
      'No suitable heat pump found for the given power heat loss.'
    );
  }

  return bestFit;
};

const totalCost = (heatPump, vatRate) => {
  let grossCost = 0;

  for (const item of heatPump.costs) {
    grossCost += item.cost;
  }

  const vatAmount = grossCost * vatRate;
  const totalCostWithVat = grossCost + vatAmount;

  return totalCostWithVat;
};

module.exports = {
  heatLosskWh,
  powerHeatLossKw,
  heatPumpSelection,
  totalCost,
};
