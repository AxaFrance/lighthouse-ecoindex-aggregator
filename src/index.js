const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const aggregatorServiceLighthouse = require("./lighthouse/aggregatorService");
const aggregatorServiceEcoIndex = require("./ecoIndex/aggregatorService");
const aggregatorGlobalService = require("./globlalAggregation/aggregatorService");
const generatorReports = require("./reporters/generatorReports");

const optionDefinitions = [
  { name: "verbose", alias: "v", type: Boolean },
  { name: "returnResult", alias: "r", type: Boolean },
  { name: "reports", type: String, multiple: false },
  { name: "srcLighthouse", type: String, multiple: false },
  { name: "srcEcoIndex", type: String, multiple: false },
  { name: "timeout", alias: "t", type: Number },
  { name: "help", alias: "h", type: Boolean },
];

const sections = [
  {
    header: "A typical app",
    content: "Generates reports aggration lighthouse and ecoindex",
  },
  {
    header: "Options",
    optionList: [
      {
        name: "verbose",
        typeLabel: "{underline bool}",
        description: "Verbose a task",
      },
      {
        name: "help",
        typeLabel: "{underline bool}",
        description: "Print this usage guide.",
      },
      {
        name: "returnResult",
        typeLabel: "{underline bool}",
        description: "Return the results",
      },
      {
        name: "srcLighthouse",
        typeLabel: "{underline string}",
        description: "folder with json reports lighthouse",
      },
      {
        name: "srcEcoIndex",
        typeLabel: "{underline string}",
        description: "folder with json reports ecoIndex",
      },
    ],
  },
];

(async () => {
  const usage = commandLineUsage(sections);
  const options = commandLineArgs(optionDefinitions);
  if (options?.help || (!options?.srcLighthouse && !options?.srcEcoIndex)) {
    console.log(usage);
    return;
  }

  if (options?.verbose) {
    console.log(options);
  }
  const resultsGlobalLighthouse = await aggregatorServiceLighthouse(options);
  const resultsGlobalEcoindex = await aggregatorServiceEcoIndex(options);
  const resultsGlobal = await aggregatorGlobalService(options,resultsGlobalLighthouse, resultsGlobalEcoindex);

  if (options.reports === "html") {
    generatorReports(options,resultsGlobal);
  }
  if (options.returnResult) {
    // eslint-disable-next-line consistent-return
    return resultsGlobal;
  }
})();
