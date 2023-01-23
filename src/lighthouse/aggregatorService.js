const fs = require("fs");
const path = require("path");

module.exports = async (options) => {
  if (!options.srcLighthouse || !fs.existsSync(options.srcLighthouse)) {
    return {perPages:[]};
  }

  const lighthouseReportsFiles = listFiles(options);
  return readFiles(options, lighthouseReportsFiles);
};

const readFiles = (options, lighthouseJsonReportsFiles) => {
  let globalPerformance = 0;
  let globalAccessibility = 0;
  let globalBestPractices = 0;
  const perPages = [];

  lighthouseJsonReportsFiles.forEach((fileName) => {
    const pageName = fileName.split(".")[0];
    const pathFile = path.join(options.srcLighthouse, fileName);
    const data = fs.readFileSync(pathFile);
    const result = JSON.parse(data);
    const performance = Math.round(result.categories.performance.score * 100);
    const accessibility = Math.round(result.categories.accessibility.score * 100);
    const bestPractices = Math.round(result.categories["best-practices"].score * 100);

    globalPerformance += performance;
    globalAccessibility += accessibility;
    globalBestPractices += bestPractices;
    perPages.push({
      pageName,
      lighthouseReport: path.join(options.srcLighthouse, `${pageName}.html`),
      accessibility,
      bestPractices,
      performance,
    });
  });
  if (globalPerformance !== 0) {
    globalPerformance = Math.ceil(globalPerformance / lighthouseJsonReportsFiles.length);
  }
  if (globalAccessibility !== 0) {
    globalAccessibility = Math.ceil(globalAccessibility / lighthouseJsonReportsFiles.length);
  }
  if (globalBestPractices !== 0) {
    globalBestPractices = Math.ceil(globalBestPractices / lighthouseJsonReportsFiles.length);
  }

  if (options.verbose) {
    console.log("global performance:", globalPerformance);
    console.log("global accessibility:", globalAccessibility);
    console.log("global bestPractices:", globalBestPractices);
  }
  return { performance: globalPerformance, accessibility: globalAccessibility, bestPractices: globalBestPractices, perPages };
};
const listFiles = (options) => {
  const lighthouseJsonReportsFiles = [];
  const files = fs.readdirSync(options.srcLighthouse);
  files.forEach((file) => {
    if (path.extname(file) === ".json") {
      if (options.verbose) {
        console.log("Add file in list for aggregation: ", file);
      }
      lighthouseJsonReportsFiles.push(file);
    }
  });
  return lighthouseJsonReportsFiles;
};
