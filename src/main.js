const aggregatorServiceLighthouse = require("./lighthouse/aggregatorService");
const aggregatorServiceEcoIndex = require("./ecoIndex/aggregatorService");
const aggregatorGlobalService = require("./globlalAggregation/aggregatorService");
const { generateReports, generateReportsSonar } = require("./reporters/generatorReports");

module.exports = async (options) => {
  if (!options?.pass) {
    options.pass = 90;
  }
  if (!options?.fail) {
    options.fail = 30;
  }
  const resultsGlobalLighthouse = await aggregatorServiceLighthouse(options);
  const resultsGlobalEcoindex = await aggregatorServiceEcoIndex(options);
  const resultsGlobal = aggregatorGlobalService(options, resultsGlobalLighthouse, resultsGlobalEcoindex);

  if (options.reports === "html") {
    await generateReports(options, resultsGlobal);
  }
  if (options.reports === "sonar") {
    await generateReportsSonar(options, resultsGlobal);
  }

  return resultsGlobal;
};
