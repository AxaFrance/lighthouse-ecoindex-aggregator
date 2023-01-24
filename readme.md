
![image](https://user-images.githubusercontent.com/6480596/213727763-d8cdf611-2b35-4c60-aa94-bd85d5de006c.png)

# Lighthouse EcoIndex Aggregator

This generator tool can be used if you need to generate a global reports for all pages audited by **lighthouse** and **ecoindex** tools in a **Cypress** tests suite. After the generation, we will have access to a global HTML report as the one below.

At the end of the readme, we will explain how to generate the lighthouse and ecoindex tools, used by this aggregator.


##  Options

| Nom      |      Type     |  Description |
|----------|-------------|------|
| srcEcoIndex | string   | Option is used for defined ecoIndex reports path  |
| srcLighthouse | string | Option is used for defined lighthouse reports path  |
| h | boolean | Option is used for see informations cli |
| reports | string | Option is used for defined format reports after task unique value possible used is "html" |
| lang | string | Option is used for translated report values possible used is "Fr" or "En" default is "En"  options is used for defined format reports after task unique value possible used is "html" |
| v | boolean | Option is used for verbose task |


## Example usage

```bash
node ./cli.js  --srcLighthouse="C:\Workspace\reports\lighthouse" --srcEcoIndex="C:\Workspace\reports\ecoindex" --reports="html"
```

You can also used this module programmatically

```js
const aggregate = require('lighthouse-eco-index-aggregator/src/main');

console.log(aggregate({
  srcLighthouse: './reports/lighthouse',
  srcEcoIndex: './reports/ecoindex'
}))
```

## How to generate Lighthouse and EcoIndex reports

This aggregator tool can also be used directly inside a cypress test. For example, we can generate the global report once the Cypress tests suite has finished.

```javascript
// cypress.config.js
const aggregate = require("lighthouse-eco-index-aggregator/src/main");
const path = require("path");

const lighthouseOutputPathDir = path.join(__dirname, "reports/lighthouse");
const ecoIndexOutputPathDir = path.join(__dirname, "reports/ecoindex");
const globalOutputPathDir = path.join(__dirname, "reports");

module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            on("after:run", async () => {
                await aggregate({
                    reports: "html",
                    verbose: true,
                    srcLighthouse: lighthouseOutputPathDir,
                    srcEcoIndex: ecoIndexOutputPathDir,
                    outputPath: path.resolve(globalOutputPathDir, "report.html")
                });
            });
         }
   }
})
```
But in order to generate this global report, we need the lighthouse and ecoindex reports (available in the `lighthouse` and `ecoindex` subfolders. In order to do so, we will use two extra NPM packages :

* [Cypress Audit](https://github.com/mfrachet/cypress-audit) in order to run Lighthouse
* [Eco Index Audit](https://github.com/EmmanuelDemey/eco-index-audit) in order to run EcoIndex.

You will find a sample Cypress tests suite in the `cypress-demo` folder. Please have a look to the `demo.cy.js` and `cypress.config.js`.

In order to run the Cypress tests suite, you will execute the following commands :

```shell
cd cypress-demo
npm i
npx cypress run -b chrome
```