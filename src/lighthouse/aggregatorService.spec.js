const aggregate = require("./aggregatorService");
const fs = require("fs");
const path = require("path");
jest.mock("fs");

describe("AggregatorService", () => {

  const inputValue = {
    categories: {
      performance: {
        score: 0.76
      },
      accessibility: {
        score: 0.60
      },
      "best-practices": {
        score: 0.78
      }
    }
  };


  it("should return the default output if options srcLighthouse undefined", async () => {
    const options = {};
    const output = { perPages: [] };

    const result = await aggregate(options);
    expect(result).toEqual(output);
  });
  it("should return the default output if not found folder", async () => {
    const options = {
      srcLighthouse: "",
    };
    const output = { perPages: [] };
    const result = await aggregate(options);
    expect(result).toEqual(output);
  });

  it("should return the lightouse output", async () => {
    const options = { srcLighthouse: "test", verbose: true };
    const output =
    {
      performance: 76,
      accessibility: 60,
      bestPractices: 78,
      perPages: [
        {
          pageName: "foo",
          lighthouseReport: path.join("test", "foo.html"),
          performance: 76,
          accessibility: 60,
          bestPractices: 78,
        },
        {
          pageName: "bar",
          lighthouseReport: path.join("test", "bar.html"),
          performance: 76,
          accessibility: 60,
          bestPractices: 78,
        }]
    };
    jest.spyOn(fs, "readdirSync").mockImplementation(() => {
      return ["foo.json", "bar.json"];
    });
    jest.spyOn(fs, "existsSync").mockImplementation(() => true);
    jest.spyOn(fs, "readFileSync").mockImplementation(() => {
      return JSON.stringify(JSON.stringify(inputValue));
    });

    const result = await aggregate(options);
    console.log(result);
    expect(result).toEqual(output);
  });
});
