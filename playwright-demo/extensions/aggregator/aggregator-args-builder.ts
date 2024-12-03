import fs from "fs";
import { AGGREGATOR_OPTIONS } from './aggregator-config.js';

const { reports, verbose, srcLighthouse, srcEcoIndex, outputPath } = AGGREGATOR_OPTIONS;

export const buildAggregatorArgs = () => ({
  reports,
  verbose,
  srcLighthouse,
  srcEcoIndex,
  outputPath,
});

export const shouldRunAggregator = () => fs.existsSync(srcLighthouse) && fs.existsSync(srcEcoIndex);