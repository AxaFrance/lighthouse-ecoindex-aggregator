const aggregatorServiceLighthouse = require("./lighthouse/aggregatorService");
const aggregatorServiceEcoIndex = require("./ecoIndex/aggregatorService");
const aggregatorGlobalService = require("./globlalAggregation/aggregatorService");
const { generateReports, generateReportsSonar } = require("./reporters/generatorReports");

const path = require("path");
const fs = require("fs");

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


  const reports = Array.isArray(options.reports) ? options.reports : [options.reports];
  const destFolder = path.join(process.cwd(), options.outputPath ?? "globalReports");
  if(fs.existsSync(destFolder)){
    fs.rmSync(destFolder, { recursive: true });
  }
  fs.mkdirSync(destFolder, { recursive: true });
  options.outputPath = destFolder;


  await Promise.all(reports.map(report => {
    if (report === "html") {
      return generateReports(options, resultsGlobal);
    }
    if (report === "sonar") {
      return generateReportsSonar(options, resultsGlobal);
    }
  }))


  return resultsGlobal;
};
