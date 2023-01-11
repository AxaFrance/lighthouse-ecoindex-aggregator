const fs = require("fs");
const path = require("path");

module.exports = async (options) => {
  if(!options.srcEcoIndex || !fs.existsSync(options.srcEcoIndex)){
    return {perPages:[]};
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

  ecoIndexJsonReportsFiles.forEach((fileName)=>{
    const pageName = fileName.split(".")[0];
    const pathFile = path.join(options.srcEcoIndex, fileName);
    const data = fs.readFileSync(pathFile);
    const result = JSON.parse(data);
    ecoIndex += result[0].value;
    greenhouseGases += result[2].value;
    water += result[3].value;
    perPages.push({
        pageName,
        ecoIndex: result[0].value,
        grade: result[1].value,
        greenhouseGases: result[2].value,
        water: result[3].value,
    });
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
  }
  return { ecoIndex, grade, greenhouseGases, water, perPages };
};
const listFiles = (options) => {
  const ecoIndexJsonReportsFiles = [];
  const files = fs.readdirSync(options.srcEcoIndex);
  files.forEach((file)=>{
    if (path.extname(file) === ".json") {
      if (options.verbose) {
        console.log("Add file in list for aggregation: ", file);
      }
      ecoIndexJsonReportsFiles.push(file);
    }
  });
  return  ecoIndexJsonReportsFiles ;
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
