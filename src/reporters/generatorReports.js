const fs = require("fs");
const path = require("path");

const folderTemplate = "templates";
const folderTranslate = "translate";

const {
  globalPerformanceTag,
  globalAccessibilityTag,
  globalBestPracticesTag,
  globalEcoIndexTag,
  performanceBlock,
  accessibilityBlock,
  bestPracticesBlock,
  ecoIndexBlock,
  htmlPerPageBlock,
} = require("./globalTag");

const {
  PageSizeTag,
  PageSizeRecommendationTag,
  PageComplexityTag,
  PageComplexityRecommendationTag,
  lighthouseReportPathTag,
  NumberOfRequestTag,
  NumberOfRequestRecommendationTag,
  greenItMetricsBlock,
  pageMetricsBlock,
  IconPerPageTag,
  numberPageTag,
  pageNameTag
} = require("./pageTag");

const ejs = require("ejs");
const computeCssClassForMetrics = require("./utils/computeCssClassForMetrics");
const pageInErrorOrWarning = require("./utils/displayPageErrorIcon");

const generateReports = async (options, results) => {
  if (options?.verbose) {
    console.log("Generate reports html.");
  }
  options.translations = populateTranslation(options);
  const htmlPerPageResult = await populateTemplatePerPage(options, results);
  let htmlResult = await populateTemplate(options, results, htmlPerPageResult);

  let outputPath = "globalReports.html";
  if (!!options.outputPath) {
    outputPath = path.join(process.cwd(), options.outputPath);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  }

  fs.writeFileSync(outputPath, htmlResult);
};

const populateTemplate = async (options, results, htmlPerPageResult) => {
  let template = readTemplate("template.html");
  const performanceBlockTemplate = populateTemplatePerformance(
    options,
    results.performance,
    "global"
  );
  const accessibilityBlockTemplate = populateTemplateAccecibility(
    options,
    results.accessibility,
    "global"
  );
  const bestPracticesBlockTemplate = populateTemplateBestPractices(
    options,
    results.bestPractices,
    "global"
  );
  const ecoIndexBlockTemplate = populateTemplateEcoIndex(
    options,
    results.ecoIndex,
    "global"
  );

  const GlobalGreenItMetricsTemplate = populateGreentItMetrics(options, {
    greenhouseGases: results.greenhouseGases,
    greenhouseGasesKm: results.greenhouseGasesKm,
    water: results.water,
    waterShower: results.waterShower,
  });
  return ejs.render(template, {
    [globalPerformanceTag]:performanceBlockTemplate,
    [globalAccessibilityTag]: accessibilityBlockTemplate,
    [globalEcoIndexTag]: ecoIndexBlockTemplate,
    [globalBestPracticesTag]: bestPracticesBlockTemplate,
    [htmlPerPageBlock]: htmlPerPageResult,
    GlobalGreenItMetrics: GlobalGreenItMetricsTemplate,
    Translations:options.translations
  });
};

const populateMetrics = (options, metric) => {
  if (options?.verbose) {
    console.log("Populate metrics:", metric);
  }
  const template = readTemplate("templatePageMetrics.html");
  const NumberOfRequestMetric =
    metric?.find((m) => m.name === "number_requests") ?? {};
  const PageSizeMetric = metric?.find((m) => m.name === "page_size") ?? {};
  const PageComplexityMetric =
    metric?.find((m) => m.name === "Page_complexity") ?? {};

  return ejs.render(template, {
    [NumberOfRequestTag]: NumberOfRequestMetric.value,
    [NumberOfRequestRecommendationTag]: NumberOfRequestMetric.recommandation,
    NumberOfRequestCssClass: computeCssClassForMetrics(NumberOfRequestMetric),
    [PageSizeTag]: PageSizeMetric.value,
    [PageSizeRecommendationTag]: PageSizeMetric.recommandation,
    PageSizeCssClass: computeCssClassForMetrics(PageSizeMetric),
    [PageComplexityTag]: PageComplexityMetric.value,
    [PageComplexityRecommendationTag]: PageComplexityMetric.recommandation,
    PageComplexityCssClass: computeCssClassForMetrics(PageComplexityMetric),
    Translations: options.translations,
  });
};

const readTemplate = (templateFile) => {
  const templatePath = path.join(__dirname, folderTemplate, templateFile);
  return fs.readFileSync(templatePath).toString();
};

const populateGreentItMetrics = (
  options,
  { greenhouseGases, greenhouseGasesKm, water, waterShower }
) => {
  if (options?.verbose) {
    console.log("Populate GreenIt metrics:", {
      greenhouseGases,
      greenhouseGasesKm,
      water,
      waterShower,
    });
  }

  const template = readTemplate("templateGreenItMetrics.html");

  return ejs.render(template, {
    greenhouseGases,
    greenhouseGasesKm,
    water,
    waterShower,
    Translations : options.translations
  });
};

const populateTemplatePerPage = async (options, results) => {

  let htmlPerPage = "";
  const defaultTemplatePerPage = readTemplate("templatePerPage.html");
  let numberPage = 0;
  results.perPages.forEach(page => {
    numberPage += 1;
    if (options?.verbose) {
      console.log("Populate reports page:", numberPage);
    }
    
    const performanceBlockTemplate = populateTemplatePerformance(
      options,
      page.performance,
      numberPage
    );
    const accessibilityBlockTemplate = populateTemplateAccecibility(
      options,
      page.accessibility,
      numberPage
    );
    const bestPracticesBlockTemplate = populateTemplateBestPractices(
      options,
      page.bestPractices,
      numberPage
    );
    const ecoIndexBlockTemplate = populateTemplateEcoIndex(
      options,
      page.ecoIndex,
      numberPage
    );
    const metricsTemplate = populateMetrics(options, page.metrics);
    const greenItMetricsTemplate = populateGreentItMetrics(options, {
      greenhouseGasesKm: page.greenhouseGasesKm,
      waterShower: page.waterShower,
      greenhouseGases: page.greenhouseGases,
      water: page.water,
    });

    const templatePerPage = ejs.render(defaultTemplatePerPage, {
      [performanceBlock]: performanceBlockTemplate,
      [accessibilityBlock]: accessibilityBlockTemplate,
      [bestPracticesBlock]: bestPracticesBlockTemplate,
      [ecoIndexBlock]: ecoIndexBlockTemplate,
      [pageMetricsBlock]: metricsTemplate,
      [greenItMetricsBlock]: greenItMetricsTemplate,
      [numberPageTag]: numberPage,
      [pageNameTag]: page.pageName,
      [lighthouseReportPathTag]: page.lighthouseReport,
      [IconPerPageTag]:pageInErrorOrWarning(page),
      Translations : options.translations
    });
    htmlPerPage += templatePerPage;
  });
  return htmlPerPage;
};

const populateTemplatePerformance = (options, performance, numberPage) => {
  if (options?.verbose) {
    console.log(
      `populate performance with value:${performance} for page ${numberPage}`
    );
  }
  const template = readTemplate("templatePerfomance.html");
  return defineCssClass(performance, template, options);
};

const populateTemplateAccecibility = (options, accessibility, numberPage) => {
  if (options?.verbose) {
    console.log(
      `populate accessibility with value: ${accessibility} for page ${numberPage}`
    );
  }
  const template = readTemplate("templateAccecibility.html");
  return defineCssClass(accessibility, template, options);
};

const populateTemplateBestPractices = (options, bestPractices, numberPage) => {
  if (options?.verbose) {
    console.log(
      `populate bestPractices with value ${bestPractices} for page ${numberPage}`
    );
  }
  const template = readTemplate("templateBestPractices.html");
  return defineCssClass(bestPractices, template, options);
};

const populateTemplateEcoIndex = (options, ecoIndex, numberPage) => {
  if (options?.verbose) {
    console.log(
      `populate ecoIndex with value: ${ecoIndex} for page: ${numberPage}`
    );
  }
  const template = readTemplate("templateEcoIndex.html");
  return defineCssClass(ecoIndex, template, options);
};

const populateTranslation = (options) => {
  let templateFile = "En-en.json";
  switch (options?.lang) {
    case "Fr":
      templateFile = "Fr-fr.json";
      break;
    case "En":
    default:
      templateFile = "En-en.json";
  }
  if (options?.verbose) {
    console.log("Translate by files:", templateFile);
  }
  const templatePath = path.join(__dirname, folderTranslate, templateFile);
  return require(templatePath);
};

const defineCssClass = (value, template, options) => {
  const cssPassClass = "lh-gauge__wrapper--pass";
  const cssAverageClass = "lh-gauge__wrapper--average";
  const cssFailClass = "lh-gauge__wrapper--fail";
  const cssNotApplicableClass = "lh-gauge__wrapper--not-applicable";
  let classUsed = "";

  if (value > 89) classUsed = cssPassClass;
  else if (value <= 89 && value > 49) classUsed = cssAverageClass;
  else if (value <= 49 && value > 0) classUsed = cssFailClass;
  else classUsed = cssNotApplicableClass;
  let variables = {
    Class: classUsed,
    Value: value,
    Translations: options.translations,
  };
  return ejs.render(template, variables);
};

module.exports = {
  generateReports,
  populateTemplatePerformance,
  populateTemplateAccecibility,
  populateTemplateBestPractices,
  populateTemplateEcoIndex,
};
