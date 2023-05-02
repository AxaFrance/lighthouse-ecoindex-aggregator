const aggregatorServiceLighthouse = require("./lighthouse/aggregatorService");
const aggregatorServiceEcoIndex = require("./ecoIndex/aggregatorService");
const aggregatorGlobalService = require("./globlalAggregation/aggregatorService");
const { generateReports, generateReportsSonar } = require("./reporters/generatorReports");

const path = require("path");
const fs = require("fs");

const defaultThreshold = {
  pass: 90,
  fail: 30
};

const formatReports = reports => {
  if(!reports){
    return [];
  }
  return Array.isArray(reports) ? reports : [reports];
};

module.exports = async (_options) => {
  let options = {
    ...defaultThreshold,
    ..._options
  };
  
  if(options.config){
    options = {
      ...options,
      ...require(options.config)
    };
  }

  const resultsGlobalLighthouse = await aggregatorServiceLighthouse(options);
  const resultsGlobalEcoindex = await aggregatorServiceEcoIndex(options);
  const resultsGlobal = aggregatorGlobalService(options, resultsGlobalLighthouse, resultsGlobalEcoindex);


  const reports = formatReports(options.reports);
  const destFolder = path.join(process.cwd(), options.outputPath ?? "globalReports");
  if(fs.existsSync(destFolder)){
    fs.rmSync(destFolder, { recursive: true });
  }
  fs.mkdirSync(destFolder, { recursive: true });
  options.outputPath = destFolder;

  await Promise.all(reports.map(report => {
    if(typeof report !== "string"){
      return report(options, resultsGlobal);
    }
    if (report === "html") {
      return generateReports(options, resultsGlobal);
    }
    if (report === "sonar") {
      return generateReportsSonar(options, resultsGlobal);
    }
  }));


  return resultsGlobal;
};
