import  aggregateGreenItReports from '@cnumr/lighthouse-eco-index-aggregator/src/main.js';
import { buildAggregatorArgs } from "./aggregator-args-builder.js";

export class AggregatorExtension {
   async generateFinalReports() {
        await aggregateGreenItReports(buildAggregatorArgs());
   }
}