const {
  statusPerPage,
  ClassFail,
  ClassPass,
  ClassAverage,
} = require("./statusPerPage");

describe("statusPerPage", () => {
  it("All pass", () => {
    const input = {
      performance: 96,
      accessibility: 96,
      ecoIndex: 96,
      bestPractises: 96,
    };
    const result = statusPerPage(input);
    expect(result).toEqual(ClassPass);
  });

  it("Performance Fail", () => {
    const input = {
      performance: 30,
      accessibility: 96,
      ecoIndex: 96,
      bestPractises: 96,
    };
    const result = statusPerPage(input);
    expect(result).toEqual(ClassFail);
  });

  it("Accessibility Fail", () => {
    const input = {
      performance: 96,
      accessibility: 30,
      ecoIndex: 96,
      bestPractises: 96,
    };
    const result = statusPerPage(input);
    expect(result).toEqual(ClassFail);
  });

  it("BestPerformances Fail", () => {
    const input = {
      performance: 96,
      accessibility: 96,
      ecoIndex: 96,
      bestPractises: 30,
    };
    const result = statusPerPage(input);
    expect(result).toEqual(ClassFail);
  });
  it("EcoIndex Fail", () => {
    const input = {
      performance: 96,
      accessibility: 96,
      ecoIndex: 96,
      bestPractises: 30,
    };
    const result = statusPerPage(input);
    expect(result).toEqual(ClassFail);
  });
  it("PerforMance Average", () => {
    const input = {
      performance: 56,
      accessibility: 96,
      ecoIndex: 96,
      bestPractises: 30,
    };
    const result = statusPerPage(input);
    expect(result).toEqual(ClassAverage);
  });
  it("Accessibility Average", () => {
    const input = {
      performance: 96,
      accessibility: 56,
      ecoIndex: 96,
      bestPractises: 30,
    };
    const result = statusPerPage(input);
    expect(result).toEqual(ClassAverage);
  });
  it("BestPractices Average", () => {
    const input = {
      performance: 96,
      accessibility: 96,
      ecoIndex: 96,
      bestPractises: 56,
    };
    const result = statusPerPage(input);
    expect(result).toEqual(ClassAverage);
  });
  it("EcoIndex Average", () => {
    const input = {
      performance: 96,
      accessibility: 96,
      ecoIndex: 60,
      bestPractises: 96,
    };
    const result = statusPerPage(input);
    expect(result).toEqual(ClassAverage);
  });

  it("No Applicable", () => {
    const input = {
    };
    const result = statusPerPage(input);
    expect(result).toEqual("");
  });
});
