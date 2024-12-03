/* eslint-disable import/no-extraneous-dependencies */
import fs  from "fs";
import { minify } from "html-minifier";
import { LighthousePaths, LighthouseReportOptions } from './lighthouseConfig.js';

const createLighthouseReportsDirectories = (paths: LighthousePaths) => {
  if (!fs.existsSync(paths.reportsPath)) {
    fs.mkdirSync(paths.reportsPath);
  }

  if (!fs.existsSync(paths.lighthouseReportsPath)) {
    fs.mkdirSync(paths.lighthouseReportsPath, {recursive : true});
  }
};

const cleanLighthouseReportsFiles = (options: LighthouseReportOptions, paths : LighthousePaths) => {
  if (fs.existsSync(`${paths.lighthouseReportsPath}${options.fileName}.json`)) {
    fs.unlinkSync(`${paths.lighthouseReportsPath}${options.fileName}.json`);
  }
  if (fs.existsSync(`${paths.lighthouseReportsPath}${options.fileName}.html`)) {
    fs.unlinkSync(`${paths.lighthouseReportsPath}${options.fileName}.html`);
  }
};

const writeLighthouseReportJsonFile = (options: LighthouseReportOptions, paths : LighthousePaths, lighthouseAudit) => {
  const reportContent = JSON.stringify(lighthouseAudit.lhr);
  fs.writeFileSync(`${paths.lighthouseReportsPath}${options.fileName}.json`, reportContent, { flag: 'a+' });
};

const writeLighthouseReportHtmlFile = (options : LighthouseReportOptions, paths : LighthousePaths, lighthouseAudit) => {
  let reportContent = lighthouseAudit.report;
  if (options && options.minifyHtmlReports) {
    reportContent = minify(reportContent, options.htmlMinifierOptions);
  }
  fs.writeFileSync(`${paths.lighthouseReportsPath}${options.fileName}.html`, reportContent, {
    flag: 'a+',
  });
};
export const lighthouseReport = (options : LighthouseReportOptions, paths : LighthousePaths, lighthouseAudit) => {
  createLighthouseReportsDirectories(paths);
  cleanLighthouseReportsFiles(options, paths);
  writeLighthouseReportJsonFile(options, paths, lighthouseAudit);
  writeLighthouseReportHtmlFile(options, paths, lighthouseAudit);
  return lighthouseReport;
};