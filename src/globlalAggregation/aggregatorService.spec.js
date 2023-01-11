const aggregate = require("./aggregatorService");

describe("AggregatorService", () => {
    it("should return the default output if the array is empty", () => {
        const options = {};
        const resultsGlobalLighthouse = {}; 
        const resultsGlobalEcoindex = {}; 

        const output = {
            ecoIndex: 0,
            grade: 0,
            greenhouseGases: 0,
            water: 0,
            performance: 0,
            accessibility: 0,
            bestPractices: 0,
            perPages: [],
          };

        expect(aggregate(options, resultsGlobalLighthouse, resultsGlobalEcoindex)).toEqual(output);
    });
});