const {defineConfig} = require("cypress");
const {lighthouse, prepareAudit} = require("@cypress-audit/lighthouse");
const fs = require("fs");
const path = require("path");
const aggregate = require("../src/main");

const { prepareAudit: prepareEcoIndexAudit, checkEcoIndex } = require("eco-index-audit/src/cypress");
const { cwd } = require("process");


const lighthouseOutputPathDir = path.join(__dirname, "reports/lighthouse");
const ecoIndexOutputPathDir = path.join(__dirname, "reports/ecoindex");

if(fs.existsSync(lighthouseOutputPathDir)){
    fs.rmdirSync(lighthouseOutputPathDir, { recursive: true, force: true });
}
if(fs.existsSync(ecoIndexOutputPathDir)){
    fs.rmdirSync(ecoIndexOutputPathDir, { recursive: true, force: true });
}

fs.mkdirSync(ecoIndexOutputPathDir, {recursive: true});
fs.mkdirSync(lighthouseOutputPathDir, {recursive: true});


module.exports = defineConfig({
    e2e: {
        setupNodeEvents(on) {
            on("after:run", async () => {
                await aggregate({
                    config: path.resolve(cwd(), "./config.js")
                });
            });

            on("before:browser:launch", (_browser = {}, launchOptions) => {
                prepareAudit(launchOptions);
                prepareEcoIndexAudit(launchOptions);
            });
            on("task", {
                lighthouse: lighthouse(result => {
                    const url = result.lhr.finalUrl;
                    fs.writeFileSync(
                        path.resolve(__dirname, path.join(lighthouseOutputPathDir, `${url.replace("://", "_").replace("/", "_")}.json`)),
                        JSON.stringify(result.lhr, undefined, 2));
                    fs.writeFileSync(
                        path.resolve(__dirname, path.join(lighthouseOutputPathDir, `${url.replace("://", "_").replace("/", "_")}.html`)),
                        result.report);
                }),
                checkEcoIndex: ({ url }) => checkEcoIndex({ 
                    url, 
                    options: {
                        output: ["json"],
                        outputPathDir: ecoIndexOutputPathDir,
                        outputFileName: url.replace("://", "_").replace("/", "_"),
                    } 
                })
            });
        },
    },
});
