const outputSummaryTemplate = (
  submissionId,
  estimatedHeatLoss,
  designRegion,
  powerHeatLoss,
  recommendedHeatPump,
  totalCost
) => {
  console.log(' ');
  console.log('--------------------------------------');
  console.log(submissionId);
  console.log('--------------------------------------');
  console.log(' ');
  console.log(`  Estimated Heat Loss       = ${estimatedHeatLoss} kWh`);
  console.log(`  Design Region             = ${designRegion}`);
  console.log(
    `  Power Heat Loss           = ${Number(powerHeatLoss.toFixed(2))} kW`
  );
  console.log(`  Recommended Heat Pump     = ${recommendedHeatPump.label}`);
  console.log('  Cost Breakdown');
  console.log(' ');
  for (const item of recommendedHeatPump.costs) {
    console.log(`    ${item.label} - £${item.cost}`);
  }
  console.log(' ');
  console.log(`  Total Cost, including VAT = £${totalCost}`);
  console.log(' ');
};

const errorSummaryTemplate = (
  submissionId,
  heatingLosskWhTotal,
  errorMessage
) => {
  console.log(' ');
  console.log('--------------------------------------');
  console.log(submissionId);
  console.log('--------------------------------------');
  console.log(' ');
  console.log(`Heating Loss: ${heatingLosskWhTotal}`);
  console.log(`${errorMessage}`);
  console.log(' ');
};

module.exports = {
  outputSummaryTemplate,
  errorSummaryTemplate,
};
