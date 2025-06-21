const heatLosskWh = (floorArea, heatingFactor, insulationFactor) => {
  // floorArea (m^2) * heatingFactor * insulationFactor = heat loss (kWh)

  if(typeof floorArea !== 'number' || typeof heatingFactor !== 'number' || typeof insulationFactor !== 'number') {
    throw new Error("Invalid Heat Loss input: All parameters must be numbers.");
  }
  return (floorArea * heatingFactor * insulationFactor);
};

const powerHeatLossKw = (heatLosskWhTotal, heatingDegreeDays) => { 
  //  heat loss (kWh) / heating degree days = Power heat loss (kW)
  if(typeof heatLosskWhTotal !== 'number' || typeof heatingDegreeDays !== 'number') {
    throw new Error("Invalid Power Heat Loss inputs: All parameters must be numbers." );
  }

  return (heatLosskWhTotal / heatingDegreeDays);
};    

const heatPumpSelection = (powerHeatLossKwTotal, heatPumpOptions) => {  

  if(!Array.isArray(heatPumpOptions) || heatPumpOptions.length === 0) {
    throw new Error("Invalid Heat Pump Options: Must be a non-empty array.");
  }

  if(typeof powerHeatLossKwTotal !== 'number') {
    throw new Error("Invalid Power Heat Loss input: Must be a number.");
  }

  let bestFit = null;

  for (const heatPump of heatPumpOptions) {
    if (heatPump.outputCapacity >= powerHeatLossKwTotal) {
      if (!bestFit || heatPump.outputCapacity < bestFit.outputCapacity) {
        bestFit = heatPump;
      }
    }
  }

  if (!bestFit) {
    throw new Error("No suitable heat pump found for the given power heat loss.");
  }

  return bestFit;
}

const totalCost = (heatPump, vatRate) => {
  if (typeof heatPump !== 'object' || typeof vatRate !== 'number') {
    throw new Error("Invalid Cost inputs: All parameters must be valid types.");
  }
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
  totalCost
};