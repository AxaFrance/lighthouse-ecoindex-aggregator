const { generateReports } = require("./generatorReports");
const fs = require("fs");
const path = require("path");

describe("generatorReports", () => {
  const options = { verbose: true, lang: "Fr-fr", pass: 90, fail: 20, outputPath: "./" };

  const output = {
    ecoIndex: 86,
    grade: "A",
    greenhouseGases: 1.56,
    water: 2,
    performance: 10,
    accessibility: 20,
    bestPractices: 30,
    waterNumberOfVisits:100,
    gasesNumberOfVisits:100,
    perPages: [
      {
        pageName: "test1",
        lighthouseReport: "reports/test1.html",
        accessibility: 70,
        bestPractices: 70,
        performance: 70,
        ecoIndex: 86,
        grade: "A",
        greenhouseGases: 2500,
        water: 2,
        waterNumberOfVisits:100,
        gasesNumberOfVisits:100,
        metrics: [
          {
            name: "number_requests",
            value: 9,
            status: "info",
            recommandation: "< 30 requests",
          },
          {
            name: "page_size",
            value: 5243,
            status: "error",
            recommandation: "< 1000kb",
          },
          {
            name: "Page_complexity",
            value: 110,
            status: "info",
            recommandation: "Between 300 and 500 nodes",
          },
        ],
        greenhouseGasesKm: 2500,
        waterShower: 250,
      },
    ],
  };

  it("replace all tag", async () => {
    await generateReports(options, output);
    const result = fs.readFileSync("report.html").toString();
    expect(result).toMatchSnapshot();
    fs.rmSync("report.html");
  });
});
