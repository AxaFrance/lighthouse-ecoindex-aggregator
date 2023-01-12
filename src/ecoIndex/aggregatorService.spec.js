const aggregate = require("./aggregatorService");
const fs = require("fs");
jest.mock("fs");

describe("AggregatorService", () => {
 
    const inputValue = {
        score: 71,
        grade: "B",
        estimatation_co2: {
            comment:
                "Pour un total de undefined visites par mois, ceci correspond à NaNkm en voiture (Peugeot 208 5P 1.6 BlueHDi FAP (75ch) BVM5)",
            commentDetails: {
                value_km: "10",
            },
        },
        estimatation_water: {
            comment:
                "Pour un total de undefined visites par mois, ceci correspond à NaN douche",
            commentDetails: {
                value_shower: "10",
            },
        },
        pages: [
            {
                url: "http://localhost:3000",
                ecoIndex: 71,
                grade: "B",
                greenhouseGasesEmission: 1.58,
                waterConsumption: 2.37,
                metrics: [
                    {
                        name: "number_requests",
                        value: 9,
                        status: "info",
                        recommandation: "< 30 requests",
                    },
                    {
                        name: "page_size",
                        value: 5243,
                        estimatation_co2: {
                            comment:
                                "Pour un total de undefined visites par mois, ceci correspond à NaNkm en voiture (Peugeot 208 5P 1.6 BlueHDi FAP (75ch) BVM5)",
                            commentDetails: {
                                value_km: null,
                            },
                        },
                        estimatation_water: {
                            comment:
                                "Pour un total de undefined visites par mois, ceci correspond à NaN douche",
                            commentDetails: {
                                value_shower: null,
                            },
                        },
                    },
                ],
            }]
    };

    it("should return the default output if options srcEcoIndex undefined", async () => {
        const options = {};
        const output = { perPages: [] };

        const result = await aggregate(options);
        expect(result).toEqual(output);
    });
    it("should return the default output if not found folder", async () => {
        const options = {
            srcEcoIndex: "",
        };
        const output = { perPages: [] };
        const result = await aggregate(options);
        expect(result).toEqual(output);
    });

    it("should return global ecoIndex", async () => {
        const options = {srcEcoIndex:"test",verbose:true};
        const output = 
        {
            "ecoIndex": 71,
            "grade": "B",
            "greenhouseGases": 3.16,
            "greenhouseGasesKm": 0,
            "perPages":  [
                  {
                   "ecoIndex": 71,
                   "grade": "B",
                   "greenhouseGases": 1.58,
                   "greenhouseGasesKm": 0,
                   "metrics":  [
                      {
                       "name": "number_requests",
                       "recommandation": "< 30 requests",
                       "status": "info",
                       "value": 9,
                     },
                      {
                       "estimatation_co2":  {
                         "comment": "Pour un total de undefined visites par mois, ceci correspond à NaNkm en voiture (Peugeot 208 5P 1.6 BlueHDi FAP (75ch) BVM5)",
                         "commentDetails":  {
                           "value_km": null,
                         },
                       },
                       "estimatation_water":  {
                         "comment": "Pour un total de undefined visites par mois, ceci correspond à NaN douche",
                         "commentDetails":  {
                           "value_shower": null,
                         },
                       },
                       "name": "page_size",
                       "value": 5243,
                     },
                   ],
                   "pageName": "foo",
                   "water": 2.37,
                   "waterShower": 0,
                 },
                  {
                   "ecoIndex": 71,
                   "grade": "B",
                   "greenhouseGases": 1.58,
                   "greenhouseGasesKm": 0,
                   "metrics":  [
                      {
                       "name": "number_requests",
                       "recommandation": "< 30 requests",
                       "status": "info",
                       "value": 9,
                     },
                      {
                       "estimatation_co2":  {
                         "comment": "Pour un total de undefined visites par mois, ceci correspond à NaNkm en voiture (Peugeot 208 5P 1.6 BlueHDi FAP (75ch) BVM5)",
                         "commentDetails":  {
                           "value_km": null,
                         },
                       },
                       "estimatation_water":  {
                         "comment": "Pour un total de undefined visites par mois, ceci correspond à NaN douche",
                         "commentDetails":  {
                           "value_shower": null,
                         },
                       },
                       "name": "page_size",
                       "value": 5243,
                     },
                   ],
                   "pageName": "bar",
                   "water": 2.37,
                   "waterShower": 0,
                 },
               ],
               "water": 4.74,
               "waterShower": 0,
             };
        jest.spyOn(fs, 'readdirSync').mockImplementation(() => {
            return ['foo.json', 'bar.json'];
          });
          jest.spyOn(fs, 'existsSync').mockImplementation(() => true);
          jest.spyOn(fs, 'readFileSync').mockImplementation(() => {
            return JSON.stringify(inputValue);
          });
        
        const result = await aggregate(options);
        console.log(result);
        expect(result).toEqual(output);
    });
});
