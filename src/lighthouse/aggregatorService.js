const fs = require("fs");
const path = require("path");

module.exports = async options => {
  if (!options.srcLighthouse || !fs.existsSync(options.srcLighthouse)) {
    console.error("lighthouse folder not found!");
    process.exit(1);
  }

  const lighthouseReportsFiles = listFiles(options);
  return readFiles(options, lighthouseReportsFiles);
};

const readFiles = (options, lighthouseJsonReportsFiles) => {
  let globalPerformance = 0;
  let globalAccessibility = 0;
  let globalBestPractices = 0;
  const perPages = [];

  lighthouseJsonReportsFiles.forEach(fileName => {
    const pageName = fileName.replace(".json", "");
    const pathFile = path.join(options.srcLighthouse, fileName);
    const data = fs.readFileSync(pathFile);
    const result = JSON.parse(data);
    const performance = result?.categories?.performance?.score
      ? Math.round(result.categories.performance.score * 100)
      : 0;
    const accessibility = result?.categories?.accessibility?.score
      ? Math.round(result?.categories.accessibility.score * 100)
      : 0;
    const bestPractices = result?.categories["best-practices"]?.score
      ? Math.round(result?.categories["best-practices"].score * 100)
      : 0;

    globalPerformance += performance;
    globalAccessibility += accessibility;
    globalBestPractices += bestPractices;
    perPages.push({
      pageName,
      lighthouseReport: path.join("lighthouse", `${pageName}.html`),
      accessibility,
      bestPractices,
      performance,
    });
  });
  if (globalPerformance !== 0) {
    globalPerformance = Math.ceil(
      globalPerformance / lighthouseJsonReportsFiles.length
    );
  }
  if (globalAccessibility !== 0) {
    globalAccessibility = Math.ceil(
      globalAccessibility / lighthouseJsonReportsFiles.length
    );
  }
  if (globalBestPractices !== 0) {
    globalBestPractices = Math.ceil(
      globalBestPractices / lighthouseJsonReportsFiles.length
    );
  }

  if (options.verbose) {
    console.log("global performance:", globalPerformance);
    console.log("global accessibility:", globalAccessibility);
    console.log("global bestPractices:", globalBestPractices);
  }
  return {
    performance: globalPerformance,
    accessibility: globalAccessibility,
    bestPractices: globalBestPractices,
    perPages,
  };
};
const listFiles = options => {
  const lighthouseJsonReportsFiles = [];
  const files = fs.readdirSync(options.srcLighthouse);
  files.forEach(file => {
    if (path.extname(file) === ".json") {
      if (options.verbose) {
        console.log("Add file in list for aggregation: ", file);
      }
      lighthouseJsonReportsFiles.push(file);
    }
  });
  return lighthouseJsonReportsFiles;
};
