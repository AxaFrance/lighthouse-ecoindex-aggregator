🔴🔴 Ce repository n'est plus actif. Le code a été migré dans l'organisation du CNUMR. Vous le trouverez [ici](https://github.com/cnumr/ecoindex-audit) 🔴🔴

# Lighthouse EcoIndex Aggregator

This generator tool can be used if you need to generate a global reports for all pages audited by **lighthouse** and **ecoindex** tools. After the generation, we will have access to a global HTML report. As an example, you can use this tool at the end of a Cypress test suite in order to generate
the final report of your tests.

![image](https://user-images.githubusercontent.com/6480596/213727763-d8cdf611-2b35-4c60-aa94-bd85d5de006c.png)

At the end of the readme, we will explain how to generate lighthouse and ecoindex reports, used by this aggregator.

## Package

- lighthouse-eco-index-aggregator [![npm version](https://badge.fury.io/js/lighthouse-eco-index-aggregator.svg)](https://badge.fury.io/js/lighthouse-eco-index-aggregator)

```shell
npm install -D lighthouse-eco-index-aggregator
```

## Options

| Nom           | Type     | Description                                                                                                  |
| ------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| config        | string   | Option is used for define configuration file (JSON or JavaScript)                                            |
| fail          | number   | Option is used for define limit fail                                                                         |
| h             | boolean  | Option is used for see informations cli                                                                      |
| lang          | string   | Option is used for translated report values possible used is "fr-FR" or "en-GB" default is "en-GB"           |
| m             | boolean  | Option is used for minify file output it's true by default                                                   |
| outputPath    | string   | Option is used in order to define the target folder when the report will be generated                        |
| pass          | number   | Option is used for define limit pass                                                                         |
| reports       | string[] | Option is used for defined the format of the generated report. Possible values "html", "sonar" or a funciton |
| sonarFilePath | string   | Option is used when generating the sonar report, in order to make the issue visible on SonarCloud            |
| srcEcoIndex   | string   | Option is used for defined ecoIndex reports path                                                             |
| srcLighthouse | string   | Option is used for defined lighthouse reports path                                                           |
| v             | boolean  | Option is used for verbose task                                                                              |

## Example usage

```shell
npx lighthouse-eco-index-aggregator --srcLighthouse="./reports/lighthouse" --srcEcoIndex="./reports/ecoindex" --reports="html" --outputPath="report_final"
```

You can also used this module programmatically

```js
const aggregate = require("lighthouse-eco-index-aggregator/src/main");

console.log(
  aggregate({
    srcLighthouse: "./reports/lighthouse",
    srcEcoIndex: "./reports/ecoindex",
    outputPath: "report_final",
  })
);
```

## How to generate Lighthouse and EcoIndex reports

This aggregator tool can also be used directly inside a cypress test. For example, we can generate the global report once the Cypress tests suite has finished.

```javascript
// cypress.config.js
const aggregate = require("lighthouse-eco-index-aggregator/src/main");
const path = require("path");

const lighthouseOutputPathDir = path.join(__dirname, "reports/lighthouse");
const ecoIndexOutputPathDir = path.join(__dirname, "reports/ecoindex");
const globalOutputPathDir = path.join(__dirname, "report_final");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("after:run", async () => {
        await aggregate({
          reports: ["html"],
          verbose: true,
          srcLighthouse: lighthouseOutputPathDir,
          srcEcoIndex: ecoIndexOutputPathDir,
          outputPath: globalOutputPathDir,
        });
      });
    },
  },
});
```

But in order to generate this global report, we need the lighthouse and ecoindex reports available in the `lighthouse` and `ecoindex` subfolders. In order to do so, we will use two extra NPM packages :

- [Cypress Audit](https://github.com/mfrachet/cypress-audit) in order to run Lighthouse
- [Eco Index Audit](https://github.com/EmmanuelDemey/eco-index-audit) in order to run EcoIndex.

You will find a sample Cypress tests suite in the `cypress-demo` folder. Please have a look to the `demo.cy.js` and `cypress.config.js`.

In order to run the Cypress tests suite, you have to execute the following commands :

```shell
cd cypress-demo
npm i
npx cypress run -b chrome
```

## Sonar report

This tool can also generate a external sonar report you can add to the Sonar configuration (via the `sonar.externalIssuesReportPaths` option).

You need to define the path to one of your file managed by Sonar, in order to make the rule visible in Sonar Cloud and use the `sonar` reporter.

```bash
node ./src/cli.js  --srcLighthouse="./reports/lighthouse" --srcEcoIndex="./reports/ecoindex" --reports="sonar" --sonarFilePath="./package.json"
```

## Generate any type of report

In fact, the `output` option can receive a javaScript function. Thanks to this possibility, you can send the result anywhere (Elastic, DataDog, ...)

```javascript
// cypress.config.js
const aggregate = require("lighthouse-eco-index-aggregator/src/main");
const path = require("path");

const lighthouseOutputPathDir = path.join(__dirname, "reports/lighthouse");
const ecoIndexOutputPathDir = path.join(__dirname, "reports/ecoindex");
const globalOutputPathDir = path.join(__dirname, "report_final");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("after:run", async () => {
        await aggregate({
          reports: [
            "html",
            (options, results) => {
              const { Client } = require("@elastic/elasticsearch");
              const client = new Client();
              return client.index({
                index: "lighthouse-ecoindex",
                document: {
                  ...results,
                  "@timestamp": new Date(),
                },
              });
            },
          ],
          verbose: true,
          srcLighthouse: lighthouseOutputPathDir,
          srcEcoIndex: ecoIndexOutputPathDir,
          outputPath: globalOutputPathDir,
        });
      });
    },
  },
});
```
