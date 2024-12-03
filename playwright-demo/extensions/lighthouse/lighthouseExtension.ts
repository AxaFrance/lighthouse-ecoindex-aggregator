import { LIGHTHOUSE_CONFIG, LIGHTHOUSE_OPTIONS, LIGHTHOUSE_PATHS, LIGHTHOUSE_REPORT_OPTIONS, LIGHTHOUSE_THRESHOLDS, LighthouseReportOptions} from "./lighthouseConfig.js";
import lighthouse from 'lighthouse';
import { launch } from 'puppeteer';
import {
  AnalyseConfiguration,
  PwExtension,
} from "../extensionWrapper.js";
import { lighthouseReport } from "./lighthouseReport.js";


export class LighthouseExtension implements PwExtension {
  async analyse(config: AnalyseConfiguration) {   
    const page = config.page;
    const puppeteerBrowser = await launch({headless: 'new'});
    
    const puppeteerPage = await  puppeteerBrowser.newPage(); 
    const cookies = await page.context().cookies();
    await  puppeteerPage.setCookie(...cookies);
    const url = page.url();
   
    await puppeteerPage.goto(url);
    
    if (config.selectorToWaitBeforeAnalyse)
    {
      await puppeteerPage.waitForSelector(config.selectorToWaitBeforeAnalyse);
    }
   
    const lighthouseAudit = await lighthouse(url, LIGHTHOUSE_OPTIONS, LIGHTHOUSE_CONFIG, puppeteerPage);
    const reportOption = LIGHTHOUSE_REPORT_OPTIONS;
    reportOption.fileName = config.stepName;
      

    lighthouseReport(reportOption, LIGHTHOUSE_PATHS, lighthouseAudit);
  }
}

