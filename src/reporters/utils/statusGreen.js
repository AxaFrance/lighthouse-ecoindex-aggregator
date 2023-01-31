const ejs = require("ejs");
const { readTemplate } = require("../readTemplate");
const statusGreen = (note, { pass, fail, verbose }) => {
  const cssPassClass = "green-audit--pass";
  const cssFailClass = "green-audit--fail";
  const svgTemplate = readTemplate("sheet.svg");
  const svgClassTag = "svgClassTag";
  const firstSheetClass = cssPassClass;
  let secondSheetClass = cssFailClass;
  let threeSheetClass = cssFailClass;

  if (note >= pass) {
    secondSheetClass = cssPassClass;
    threeSheetClass = cssPassClass;
  } else if (note < pass && note >= fail) {
    secondSheetClass = cssPassClass;
  }
  if (verbose) {
    console.log("firstSheetClass", firstSheetClass);
    console.log("secondSheetClass", secondSheetClass);
    console.log("threeSheetClass", threeSheetClass);
  }
  const firtSheet = ejs.render(svgTemplate, {
    [svgClassTag]: firstSheetClass,
  });
  
  const secondSheet = ejs.render(svgTemplate, {
    [svgClassTag]: secondSheetClass,
  });

  const ThreeSheet = ejs.render(svgTemplate, {
    [svgClassTag]: threeSheetClass,
  });

  let template = readTemplate("templateStatusGreen.html");
  return ejs.render(template, {
    mySvg: {
      firtSheet: firtSheet,
      secondSheet: secondSheet,
      ThreeSheet: ThreeSheet,
    },
  });
};

module.exports = {
  statusGreen,
};
