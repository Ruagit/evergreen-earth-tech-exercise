const outputSummaryTemplate = (submissionId, estimatedHeatLoss, designRegion, powerHeatLoss, recommendedHeatPump, totalCost) => {
  console.log('--------------------------------------');
  console.log(submissionId);
  console.log('--------------------------------------');
  console.log(`  Estimated Heat Loss       = ${estimatedHeatLoss}`);
  console.log(`  Design Region             = ${designRegion}`);
  console.log(`  Power Heat Loss           = ${powerHeatLoss}`);
  console.log(`  Recommended Heat Pump     = ${recommendedHeatPump.label}`);
  console.log('  Cost Breakdown');
  for (const item of recommendedHeatPump.costs) {
    console.log(`    ${item.label} ${item.cost}`);
  }
  console.log(`  Total Cost, including VAT = ${totalCost}`);
}

const errorSummaryTemplate = (submissionId, errorMessage) => {  
  console.log('--------------------------------------');
  console.log(submissionId);
  console.log('--------------------------------------');
  console.log(`Error: ${errorMessage}`);
};

module.exports = {
  outputSummaryTemplate,
  errorSummaryTemplate
};