const commandLineArgs = require("command-line-args");
const commandLineUsage = require("command-line-usage");
const aggregate = require("./main");

const optionDefinitions = [
  { name: "verbose", alias: "v", type: Boolean },
  { name: "reports", type: String, multiple: true },
  { name: "srcLighthouse", type: String, multiple: false },
  { name: "srcEcoIndex", type: String, multiple: false },
  { name: "outputPath", type: String, multiple: false },
  { name: "lang", type: String, multiple: false },
  { name: "help", alias: "h", type: Boolean },
  { name: "config", type: String, multiple: false },
  { name: "pass", type: Number, multiple: false },
  { name: "fail", type: Number, multiple: false },
  { name: "Minify", alias: "m", type: Boolean },
  { name: "sonarFilePath", type: String },
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
        name: "outputPath",
        typeLabel: "{underline string}",
        description: "The path of the generated HTML report",
      },
      {
        name: "help",
        typeLabel: "{underline bool}",
        description: "Print this usage guide.",
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
      {
        name: "lang",
        typeLabel: "{underline string}",
        description: "define language report",
        value: "en-GB",
      },
      {
        name: "config",
        typeLabel: "{underline string}",
        description: "define path config",
      },
      {
        name: "pass",
        typeLabel: "{underline num}",
        description: "define limit pass",
      },
      {
        name: "fail",
        typeLabel: "{underline num}",
        description: "define limit fail",
      },
      {
        name: "Minify",
        typeLabel: "{underline bool}",
        description: "used minify file",
      },
      {
        name: "sonarFilePath",
        typeLabel: "{underline string}",
        description: "the file to a static file managed by sonar",
      },
    ],
  },
];

(async () => {
  const usage = commandLineUsage(sections);
  let options = commandLineArgs(optionDefinitions);

  if (
    options?.help ||
    (!options?.srcLighthouse && !options?.srcEcoIndex && !options?.config)
  ) {
    console.log(usage);
    return;
  }

  if (!options?.pass) {
    options.pass = 90;
  }
  if (!options?.fail) {
    options.fail = 30;
  }

  if (options?.verbose) {
    console.log(options);
  }

  await aggregate(options);
})();
