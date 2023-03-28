const {defineConfig} = require("cypress");
const {lighthouse, prepareAudit} = require("@cypress-audit/lighthouse")
const fs = require("fs");
const path = require("path");
const aggregate = require("../src/main");
const lighthouseOutputPathDir = path.join(__dirname, "reports/lighthouse");
const ecoIndexOutputPathDir = path.join(__dirname, "reports/ecoindex");
const globalOutputPathDir = path.join(__dirname, "reports");
fs.rmdirSync(globalOutputPathDir, { recursive: true, force: true });

fs.mkdirSync(ecoIndexOutputPathDir, {recursive: true});
fs.mkdirSync(lighthouseOutputPathDir, {recursive: true});
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

            on("before:browser:launch", (_browser = {}, launchOptions) => {
                prepareAudit(launchOptions);

                const remoteDebuggingPort = launchOptions.args.find((config) => config.startsWith("--remote-debugging-port"));
                const remoteDebuggingAddress = launchOptions.args.find((config) =>
                    config.startsWith("--remote-debugging-address")
                );
                if (remoteDebuggingPort) {
                    global.remote_debugging_port = remoteDebuggingPort.split("=")[1];
                }
                if (remoteDebuggingAddress) {
                    global.remote_debugging_address = remoteDebuggingAddress.split("=")[1];
                }
            });
            on("task", {
                lighthouse: lighthouse(result => {
                    const url = result.lhr.finalUrl;
                    const finalPath = path.resolve(__dirname, path.join(lighthouseOutputPathDir, `${url.replace("://", "_").replace("/", "_")}.json`));
                    fs.writeFileSync(
                        finalPath,
                        JSON.stringify(result.lhr, undefined, 2));
                }),
                checkEcoIndex({url, overrideOptions} = {}) {
                    const check = require("eco-index-audit/src/main");
                    return check(
                        {
                            ...overrideOptions,
                            url: url,
                            output: "json",
                            outputPathDir: ecoIndexOutputPathDir,
                            outputPath: path.join(ecoIndexOutputPathDir, `${url.replace("://", "_").replace("/", "_")}.json`),
                            remote_debugging_port: global.remote_debugging_port,
                            remote_debugging_address: global.remote_debugging_address,
                        },
                        true
                    );
                },
            });
        },
    },
});
