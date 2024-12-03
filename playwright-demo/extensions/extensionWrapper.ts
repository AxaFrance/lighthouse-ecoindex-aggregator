import { Page } from "playwright-core";
import { LighthouseExtension } from "./lighthouse/lighthouseExtension.js";
import { EcoIndexExtension } from "./ecoIndex/ecoIndexExtension.js";
import { AggregatorExtension } from "./aggregator/aggregatorExtension.js";

export type AnalyseConfiguration = {
  stepName: string;
  selectorToWaitBeforeAnalyse?:string;
  page: Page;
};


export interface PwExtension {
  analyse(config: AnalyseConfiguration): Promise<void>;
}

export class ExtensionWrapper {
  extensions: PwExtension[] = [];

  constructor(extensions?: PwExtension[]) {
    this.extensions = extensions ?? getExtensions();
  }

  public  analyse = async (config: AnalyseConfiguration)  =>
   await Promise.all(this.extensions.map(async (o) => await o.analyse(config)));

  public generateFinalReports = () =>{
    console.log("aggrege");
    new AggregatorExtension().generateFinalReports();
  }
}

const getExtensions = (): PwExtension[] => {
  const lh = [new EcoIndexExtension(), new LighthouseExtension()];
  return [...lh];
};
