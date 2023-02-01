const fs = require("fs");
const path = require("path");

module.exports = async (options) => {
  if (!options.srcEcoIndex || !fs.existsSync(options.srcEcoIndex)) {
    console.error("ecoindex folder not found!");
    process.exit(1);
  }
  const ecoIndexJsonReportsFiles = listFiles(options);
  const results = readFiles(options, ecoIndexJsonReportsFiles);
  return results;
};

const readFiles = (options, ecoIndexJsonReportsFiles) => {
  const perPages = [];
  let ecoIndex = 0;
  let greenhouseGases = 0;
  let water = 0;
  let greenhouseGasesKm = 0;
  let waterShower = 0;
  let waterNumberOfVisits = 0;
  let gasesNumberOfVisits = 0;

  ecoIndexJsonReportsFiles.forEach((fileName) => {
    const pageName = fileName.replace(".json", "");
    const pathFile = path.join(options.srcEcoIndex, fileName);
    const data = fs.readFileSync(pathFile);
    const result = JSON.parse(data);
    if (options.verbose) {
      console.log("read file:", fileName);
    }
    if (result.pages[0]) {
      const page = result.pages[0];
      ecoIndex += page.ecoIndex;
      greenhouseGases += page.greenhouseGasesEmission;
      water += page.waterConsumption;
      greenhouseGasesKm += page.estimatation_co2?.commentDetails?.value_km ?? 0;
      waterShower += page.estimatation_water?.commentDetails?.value_shower ?? 0;
      waterNumberOfVisits +=
        page.estimatation_water?.commentDetails?.numberOfVisit;
      gasesNumberOfVisits +=
        page.estimatation_co2?.commentDetails?.numberOfVisit;
      perPages.push({
        pageName,
        ecoIndex: page.ecoIndex,
        grade: page.grade,
        greenhouseGases: page.greenhouseGasesEmission,
        water: page.waterConsumption,
        greenhouseGasesKm: page.estimatation_co2?.commentDetails?.value_km ?? 0,
        waterShower: page.estimatation_water?.commentDetails?.value_shower ?? 0,
        metrics: page.metrics,
        waterNumberOfVisits:
          page.estimatation_water?.commentDetails?.numberOfVisit,
        gasesNumberOfVisits:
          page.estimatation_co2?.commentDetails?.numberOfVisit,
      });
    }
  });
  if (ecoIndex !== 0) {
    ecoIndex = Math.round(ecoIndex / ecoIndexJsonReportsFiles.length);
  }
  const grade = globalEvalutation(ecoIndex);

  if (options.verbose) {
    console.log("global ecoIndex:", ecoIndex);
    console.log("global grade:", grade);
    console.log("global greenhouse gases:", greenhouseGases);
    console.log("global greenhouse water:", water);
    console.log("global greenhouse gases in km:", greenhouseGasesKm);
    console.log("global greenhouse water:", waterShower);
  }
  return {
    ecoIndex,
    grade,
    greenhouseGasesKm,
    greenhouseGases,
    water,
    waterShower,
    perPages,
    gasesNumberOfVisits,
    waterNumberOfVisits
  };
};
const listFiles = (options) => {
  const ecoIndexJsonReportsFiles = [];
  const files = fs.readdirSync(options.srcEcoIndex);
  files.forEach((file) => {
    if (path.extname(file) === ".json") {
      if (options.verbose) {
        console.log("Add file in list for aggregation: ", file);
      }
      ecoIndexJsonReportsFiles.push(file);
    }
  });
  return ecoIndexJsonReportsFiles;
};

const globalEvalutation = (ecoIndex) => {
  if (ecoIndex > 75) return "A";
  if (ecoIndex > 65) return "B";
  if (ecoIndex > 50) return "C";
  if (ecoIndex > 35) return "D";
  if (ecoIndex > 20) return "E";
  if (ecoIndex > 5) return "F";
  return "G";
};
