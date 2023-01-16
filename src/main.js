const aggregatorServiceLighthouse = require("./lighthouse/aggregatorService");
const aggregatorServiceEcoIndex = require("./ecoIndex/aggregatorService");
const aggregatorGlobalService = require("./globlalAggregation/aggregatorService");
const { generateReports } = require("./reporters/generatorReports");

module.exports = async (options) => {
    console.log("sandy")
  const resultsGlobalLighthouse = await aggregatorServiceLighthouse(options);
  const resultsGlobalEcoindex = await aggregatorServiceEcoIndex(options);
  const resultsGlobal = await aggregatorGlobalService(options, resultsGlobalLighthouse, resultsGlobalEcoindex);

  if (options.reports === "html") {
    generateReports(options, resultsGlobal);
  }

  return resultsGlobal;
};
