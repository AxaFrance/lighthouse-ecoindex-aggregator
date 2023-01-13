const fs = require("fs");
const path = require("path");
const {
    globalPerformanceTag,
    globalAccessibilityTag,
    globalBestPracticesTag,
    globalEcoIndexTag,
    performanceBlock,
    accessibilityBlock,
    bestPracticesBlock,
    ecoIndexBlock,
    htmlPerPageBlock
} = require("./globalTag");

const {
 performanceTag ,
 accessibilityTag ,
 bestPracticesTag ,
 ecoIndexTag ,
 cssClassTag ,
 PageSizeTag ,
 PageSizeRecommendationTag,
 PageComplexityTag ,
 PageComplexityRecommendationTag ,
 lighthouseReportPathTag ,
 NumberOfRequestTag ,
 NumberOfRequestRecommendationTag ,
 GreenhouseGasesTag ,
 GreenhouseGasesKmTag,
 WaterTag ,
 WaterShowerTag,
 greenItMetricsBlock,
 pageMetricsBlock 
} = require("./pageTag");
const computeCssClassForMetrics = require("./utils/computeCssClassForMetrics");

const pageInErrorOrWarning = require("./utils/displayPageErrorIcon");
const folderTemplate = "templates";
const generateReports = async (options, results) => {
  if (options?.verbose) {
    console.log("Generate reports html.");
  }
  const htmlPerPageResult = await populateTemplatePerPage(options, results);
  const htmlResult = await populateTemplate(
    options,
    results,
    htmlPerPageResult
  );
  fs.writeFileSync("globalReports.html", htmlResult);
};

const populateTemplate = async (options, results, htmlPerPageResult) => {
  const templatePath = path.join(__dirname, folderTemplate, "template.html");
  const template = fs.readFileSync(templatePath);
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
  return template
    .toString()
    .replace(globalPerformanceTag, performanceBlockTemplate)
    .replace(globalAccessibilityTag, accessibilityBlockTemplate)
    .replace(globalEcoIndexTag, ecoIndexBlockTemplate)
    .replace(globalBestPracticesTag, bestPracticesBlockTemplate)
    .replace(htmlPerPageBlock, htmlPerPageResult)
    .replace(GreenhouseGasesTag, results.greenhouseGases)
    .replace(GreenhouseGasesKmTag, results.greenhouseGasesKm)
    .replace(WaterTag, results.water)
    .replace(WaterShowerTag, results.waterShower);
};

const populateMetrics = (options,metric) => {
  if (options?.verbose) {
    console.log("Populate metrics:", metric);
  }
  const templatePath = path.join(
    __dirname,
    folderTemplate,
    "templatePageMetrics.html"
  );
  const template = fs.readFileSync(templatePath).toString();
  const NumberOfRequestMetric = metric.find(
    (m) => m.name === "number_requests"
  );
  const PageSizeMetric = metric.find((m) => m.name === "page_size");
  const PageComplexityMetric = metric.find((m) => m.name === "Page_complexity");
  
  return template
    .replace(NumberOfRequestTag, NumberOfRequestMetric.value)
    .replace(
      NumberOfRequestRecommendationTag,
      NumberOfRequestMetric.recommandation
    )
    .replace("{{NumberOfRequestCssClass}}", computeCssClassForMetrics(NumberOfRequestMetric))
    .replace(PageSizeTag, PageSizeMetric.value)
    .replace(PageSizeRecommendationTag, PageSizeMetric.recommandation)
    .replace("{{PageSizeCssClass}}", computeCssClassForMetrics(PageSizeMetric))
    .replace(PageComplexityTag, PageComplexityMetric.value)
    .replace(PageComplexityRecommendationTag, PageComplexityMetric.recommandation)
    .replace("{{PageComplexityCssClass}}", computeCssClassForMetrics(PageComplexityMetric));
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
  const templatePath = path.join(
    __dirname,
    folderTemplate,
    "templateGreenItMetrics.html"
  );
  const template = fs.readFileSync(templatePath).toString();
  
  return template
    .replace(GreenhouseGasesTag, greenhouseGases)
    .replace(GreenhouseGasesKmTag, greenhouseGasesKm)
    .replace(WaterTag, water)
    .replace(WaterShowerTag, waterShower);
};

const populateTemplatePerPage = async (options, results) => {
  const numberPageTag = "{{numberPageTag}}";
  const pageNameTag = "{{PageName}}";
  let htmlPerPage = "";
  const templatePath = path.join(
    __dirname,
    folderTemplate,
    "templatePerPage.html"
  );
  let defaultTemplatePerPage = fs.readFileSync(templatePath).toString();
  let numberPage = 0;
  results.perPages.forEach((page) => {
    numberPage += 1;
    if (options?.verbose) {
      console.log("Populate reports page:", numberPage);
    }
    let templatePerPage = pageInErrorOrWarning(page, defaultTemplatePerPage);
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
    const greenItMetricsTemplate =  populateGreentItMetrics(options,  {
        greenhouseGasesKm: page.greenhouseGasesKm,
        waterShower: page.waterShower,
        greenhouseGases: page.greenhouseGases,
        water: page.water,
      });
    templatePerPage = templatePerPage
      .replace(performanceBlock, performanceBlockTemplate)
      .replace(accessibilityBlock, accessibilityBlockTemplate)
      .replace(bestPracticesBlock, bestPracticesBlockTemplate)
      .replace(ecoIndexBlock, ecoIndexBlockTemplate)
      .replace(numberPageTag, numberPage)
      .replace(pageNameTag, page.pageName)
      .replace(lighthouseReportPathTag, page.lighthouseReport)
      .replace(pageMetricsBlock, metricsTemplate)
      .replace(greenItMetricsBlock,greenItMetricsTemplate);

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
  const templatePath = path.join(
    __dirname,
    folderTemplate,
    "templatePerfomance.html"
  );
  const template = fs.readFileSync(templatePath).toString();
  return defineCssClass(performance, template, performanceTag);
};

const populateTemplateAccecibility = (options, accessibility, numberPage) => {
  if (options?.verbose) {
    console.log(
      `populate accessibility with value: ${accessibility} for page ${numberPage}`
    );
  }
  const templatePath = path.join(
    __dirname,
    folderTemplate,
    "templateAccecibility.html"
  );
  const template = fs.readFileSync(templatePath).toString();
  return defineCssClass(accessibility, template, accessibilityTag);
};

const populateTemplateBestPractices = (options, bestPractices, numberPage) => {
  if (options?.verbose) {
    console.log(
      `populate bestPractices with value ${bestPractices} for page ${numberPage}`
    );
  }
  const templatePath = path.join(
    __dirname,
    folderTemplate,
    "templateBestPractices.html"
  );
  const template = fs.readFileSync(templatePath).toString();
  return defineCssClass(bestPractices, template, bestPracticesTag);
};

const populateTemplateEcoIndex = (options, ecoIndex, numberPage) => {
  if (options?.verbose) {
    console.log(
      `populate ecoIndex with value: ${ecoIndex} for page: ${numberPage}`
    );
  }
  const templatePath = path.join(
    __dirname,
    folderTemplate,
    "templateEcoIndex.html"
  );
  const template = fs.readFileSync(templatePath).toString();
  return defineCssClass(ecoIndex, template, ecoIndexTag);
};

const defineCssClass = (value, template, tagReplace) => {
  const cssPassClass = "lh-gauge__wrapper--pass";
  const cssAverageClass = "lh-gauge__wrapper--average";
  const cssFailClass = "lh-gauge__wrapper--fail";
  const cssNotApplicableClass = "lh-gauge__wrapper--not-applicable";
  let classUsed = "";

  if (value > 66) classUsed = cssPassClass;
  else if (value < 66 && value > 33) classUsed = cssAverageClass;
  else if (value < 33 && value !== 0) classUsed = cssFailClass;
  else classUsed = cssNotApplicableClass;
  return template.replace(cssClassTag, classUsed).replace(tagReplace, value);
};


module.exports = {
  generateReports,
  populateTemplatePerformance,
  populateTemplateAccecibility,
  populateTemplateBestPractices,
  populateTemplateEcoIndex,
};
