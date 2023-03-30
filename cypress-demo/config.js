const path = require("path");
const fs = require("fs");

const lighthouseOutputPathDir = path.join(__dirname, "reports/lighthouse");
const ecoIndexOutputPathDir = path.join(__dirname, "reports/ecoindex");

module.exports = {
  reports: [
    "html",
    (_options, result) => {
      console.log(result);
    },
  ],
  verbose: true,
  srcLighthouse: lighthouseOutputPathDir,
  srcEcoIndex: ecoIndexOutputPathDir,
  outputPath: "report_final",
};
