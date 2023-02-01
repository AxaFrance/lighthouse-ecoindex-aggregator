const aggregate = require("./aggregatorService");

describe("AggregatorService", () => {
    it("should return the default output if the array is empty", () => {
        const options = {};
        const resultsGlobalLighthouse = {};
        const resultsGlobalEcoindex = {};

        const output = {
            ecoIndex: 0,
            grade: "G",
            greenhouseGases: 0,
            greenhouseGasesKm: 0,
            water: 0,
            waterShower: 0,
            performance: 0,
            accessibility: 0,
            bestPractices: 0,
            globalNote: 0,
            waterNumberOfVisits: 0,
            gasesNumberOfVisits: 0,
            perPages: [],
        };

        expect(aggregate(options, resultsGlobalLighthouse, resultsGlobalEcoindex)).toEqual(output);
    });

    it("should return the base is lighthouse ", () => {
        const options = {verbose: true};
        const resultsGlobalLighthouse = {
            accessibility: 70,
            bestPractices: 70,
            performance: 70,
            perPages: [
                {
                    pageName: "test1",
                    lighthouseReport: "reports/test1.html",
                    accessibility: 70,
                    bestPractices: 70,
                    performance: 70,
                },
            ],
        };
        const resultsGlobalEcoindex = {
            ecoIndex: 86,
            grade: "A",
            greenhouseGases: 1.56,
            water: 2,
            metrics: [],
            greenhouseGasesKm: 2500,
            waterShower: 250,
            waterNumberOfVisits: 100,
            gasesNumberOfVisits: 100,
            perPages: [
                {
                    pageName: "test1",
                    ecoIndex: 86,
                    grade: "A",
                    greenhouseGases: 2500,
                    water: 2,
                    metrics: [],
                    greenhouseGasesKm: 2500,
                    waterShower: 250,
                    waterNumberOfVisits: 100,
                    gasesNumberOfVisits: 100,
                },
            ],
        };

        const output = {
            ecoIndex: 86,
            globalNote: 74,
            grade: "A",
            greenhouseGases: 1.56,
            greenhouseGasesKm: 2500,
            water: 2,
            waterShower: 250,
            performance: 70,
            accessibility: 70,
            bestPractices: 70,
            waterNumberOfVisits: 100,
            gasesNumberOfVisits: 100,
            perPages: [
                {
                    pageName: "test1",
                    lighthouseReport: "reports/test1.html",
                    accessibility: 70,
                    bestPractices: 70,
                    performance: 70,
                    ecoIndex: 86,
                    grade: "A",
                    greenhouseGases: 2500,
                    water: 2,
                    metrics: [],
                    greenhouseGasesKm: 2500,
                    waterShower: 250,
                    waterNumberOfVisits: 100,
                    gasesNumberOfVisits: 100,
                },
            ],
        };
        let result = aggregate(options, resultsGlobalLighthouse, resultsGlobalEcoindex);
        expect(result).toEqual(output);
    });

    it("should return the base is ecoIndex ", () => {
        const options = {verbose: true};
        const resultsGlobalLighthouse = {
            perPages: [],
        };
        const resultsGlobalEcoindex = {
            ecoIndex: 86,
            grade: "A",
            greenhouseGases: 1.56,
            water: 2,
            metrics: [],
            greenhouseGasesKm: 2500,
            waterShower: 250,
            waterNumberOfVisits: 100,
            gasesNumberOfVisits: 100,
            perPages: [
                {
                    pageName: "test1",
                    ecoIndex: 86,
                    grade: "A",
                    greenhouseGases: 2500,
                    water: 2,
                    metrics: [],
                    greenhouseGasesKm: 2500,
                    waterShower: 250,
                    waterNumberOfVisits: 100,
                    gasesNumberOfVisits: 100,
                },
            ],
        };

        const output = {
            ecoIndex: 86,
            globalNote: 22,
            grade: "A",
            greenhouseGases: 1.56,
            water: 2,
            performance: 0,
            accessibility: 0,
            bestPractices: 0,
            greenhouseGasesKm: 2500,
            waterShower: 250,
            waterNumberOfVisits: 100,
            gasesNumberOfVisits: 100,
            perPages: [
                {
                    pageName: "test1",
                    lighthouseReport: "",
                    accessibility: 0,
                    bestPractices: 0,
                    performance: 0,
                    ecoIndex: 86,
                    grade: "A",
                    greenhouseGases: 2500,
                    greenhouseGasesKm: 2500,
                    water: 2,
                    metrics: [],
                    waterShower: 250,
                    waterNumberOfVisits: 100,
                    gasesNumberOfVisits: 100,
                },
            ],
        };
        let result = aggregate(options, resultsGlobalLighthouse, resultsGlobalEcoindex);
        expect(result).toEqual(output);
    });
});
