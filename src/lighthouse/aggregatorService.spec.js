const aggregate = require("./aggregatorService");
const fs = require("fs");
const path = require("path");
jest.mock("fs");

describe("AggregatorService", () => {
  const inputValue = {
    categories: {
      performance: {
        score: 0.76,
      },
      accessibility: {
        score: 0.6,
      },
      "best-practices": {
        score: 0.78,
      },
    },
  };

  it("should return the lightouse output", async () => {
    const options = { srcLighthouse: "test", verbose: true };
    const output = {
      performance: 76,
      accessibility: 60,
      bestPractices: 78,
      perPages: [
        {
          pageName: "foo",
          lighthouseReport: path.join("lighthouse", "foo.html"),
          performance: 76,
          accessibility: 60,
          bestPractices: 78,
        },
        {
          pageName: "bar",
          lighthouseReport: path.join("lighthouse", "bar.html"),
          performance: 76,
          accessibility: 60,
          bestPractices: 78,
        },
      ],
    };
    jest.spyOn(fs, "readdirSync").mockImplementation(() => {
      return ["foo.json", "bar.json"];
    });
    jest.spyOn(fs, "existsSync").mockImplementation(() => true);
    jest.spyOn(fs, "readFileSync").mockImplementation(() => {
      return JSON.stringify(inputValue);
    });

    const result = await aggregate(options);
    expect(result).toEqual(output);
  });
});
