import { AnalyseConfiguration, PwExtension } from "../extensionWrapper.js";
import check from "@cnumr/eco-index-audit";
import { ECOINDEX_OPTIONS } from "./ecoIndexConfig.js";


export class EcoIndexExtension implements PwExtension {
  async analyse(config: AnalyseConfiguration) {
    const page = config.page
    var cookies = await page.context().cookies();
    await check(
    {
        outputFileName: config.stepName,
        url: page.url(),
        cookies,
        remote_debugging_address : "127.0.0.1",
        remote_debugging_port: 9222,
        waitForSelector: config.selectorToWaitBeforeAnalyse,
        ...ECOINDEX_OPTIONS
        },
        true
    ); 
  }
}