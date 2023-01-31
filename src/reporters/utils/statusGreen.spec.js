const { statusGreen } = require("./statusGreen");

describe("statusGreen", () => {
  const note = 80;
  it("should one sheet", async () => {
    const options = { verbose: true, lang: "Fr-fr", pass: 90, fail: 85 };
    var result = await statusGreen(note, options);
    expect(result).toMatchSnapshot();
  });

  it("should two sheet", async () => {
    const options = { verbose: true, lang: "Fr-fr", pass: 90, fail: 60 };
    var result = await statusGreen(note, options);
    expect(result).toMatchSnapshot();
  });

  it("should three sheet", async () => {
    const options = { verbose: true, lang: "Fr-fr", pass: 20, fail: 10 };
    var result = await statusGreen(note, options);
    expect(result).toMatchSnapshot();
  });
});
