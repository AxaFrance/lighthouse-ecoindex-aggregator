const aggregatorServiceLighthouse = require("./lighthouse/aggregatorService");
const aggregatorServiceEcoIndex = require("./ecoIndex/aggregatorService");
const aggregatorGlobalService = require("./globlalAggregation/aggregatorService");
const { generateReports } = require("./reporters/generatorReports");

module.exports = async (options) => {
  const resultsGlobalLighthouse = await aggregatorServiceLighthouse(options);
  const resultsGlobalEcoindex = await aggregatorServiceEcoIndex(options);
  const resultsGlobal = aggregatorGlobalService(options, resultsGlobalLighthouse, resultsGlobalEcoindex);

  if (options.reports === "html") {
    await generateReports(options, resultsGlobal);
  }

  return resultsGlobal;
};
