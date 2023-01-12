const fs = require("fs");
const path = require("path");

const performanceTag = "{{Performance}}";
const accessibilityTag = "{{Accessibility}}";
const bestPracticesTag = "{{BestPractices}}";
const htmlPerPageTag = "{{PerPages}}";
const ecoIndexTag = "{{EcoIndex}}";

const cssClassTag = "{{Class}}";
const folderTemplate = "templates";

const performanceBlock = "{{PerformanceBlock}}";
const accessibilityBlock = "{{AccecibilityBlock}}";
const bestPracticesBlock = "{{BestPracticesBlock}}";
const ecoIndexBlock = "{{EcoIndexBlock}}";

const lighthouseReportPath = "{{LighthouseReportPath}}";

const NumberOfRequest = "{{NumberOfRequest}}";
const NumberOfRequestRecommendation = "{{NumberOfRequestRecommendation}}";
const PageSize = "{{PageSize}}";
const PageSizeRecommendation = "{{PageSizeRecommendation}}";
const PageComplexity = "{{PageComplexity}}";
const PageComplexityRecommendation = "{{PageComplexityRecommendation}}";

const GreenhouseGases = "{{GreenhouseGases}}";
const GreenhouseGasesKm = "{{GreenhouseGasesKm}}";
const Water = "{{Water}}";
const WaterShower = "{{WaterShower}}";

module.exports = async (options, results) => {
    if (options?.verbose) {
        console.log("Generate reports html.");
    }
    const htmlPerPageResult = await populateTemplatePerPage(options, results);
    const htmlResult = await populateTemplate(options, results, htmlPerPageResult);
    fs.writeFileSync("globalReports.html", htmlResult);
};

const populateTemplate = async (options, results, htmlPerPageResult) => {
    const templatePath = path.join(__dirname, folderTemplate, "template.html");
    const template = fs.readFileSync(templatePath);

    return template.toString()
        .replace(performanceTag, results.performance)
        .replace(accessibilityTag, results.accessibility)
        .replace(ecoIndexTag, results.ecoIndex)
        .replace(bestPracticesTag, results.bestPractices)
        .replace(htmlPerPageTag, htmlPerPageResult)
        .replace(GreenhouseGases, results.greenhouseGases)
        .replace(GreenhouseGasesKm, results.greenhouseGasesKm)
        .replace(Water, results.water)
        .replace(WaterShower, results.waterShower);

};

const populateMetrics = (options, template, metric) => {
    if (options?.verbose) {
        console.log("Populate metrics:", metric);
    }

    const NumberOfRequestMetric = metric.find(m => m.name === "number_requests");
    const PageSizeMetric = metric.find(m => m.name === "page_size");
    const PageComplexityMetric = metric.find(m => m.name === "Page_complexity");

    return template
        .replace(NumberOfRequest, NumberOfRequestMetric.value)
        .replace(NumberOfRequestRecommendation, NumberOfRequestMetric.recommandation)
        .replace(PageSize, PageSizeMetric.value)
        .replace(PageSizeRecommendation, PageSizeMetric.recommandation)
        .replace(PageComplexity, PageComplexityMetric.value)
        .replace(PageComplexityRecommendation, PageComplexityMetric.recommandation);
};

const populateGreentItMetrics = (options, template, { greenhouseGases, greenhouseGasesKm, water, waterShower }) => {
    if (options?.verbose) {
        console.log("Populate GreenIt metrics:", { greenhouseGases, greenhouseGasesKm, water, waterShower });
    }

    return template
    .replace(GreenhouseGases, greenhouseGases)
    .replace(GreenhouseGasesKm, greenhouseGasesKm)
    .replace(Water, water)
    .replace(WaterShower, waterShower);
};

const populateTemplatePerPage = async (options, results) => {

    const numberPageTag = "{{numberPageTag}}";
    const pageNameTag = "{{PageName}}";
    let htmlPerPage = "";
    const templatePath = path.join(__dirname, folderTemplate, "templatePerPage.html");
    let templatePerPage = fs.readFileSync(templatePath).toString();
    let numberPage = 0;
    results.perPages.forEach((page) => {
        numberPage += 1;
        if (options?.verbose) {
            console.log("Populate reports page:", numberPage);
        }
        const performanceBlockTemplate = populateTemplatePerformance(options, page.performance,numberPage);
        const accessibilityBlockTemplate = populateTemplateAccecibility(options, page.accessibility,numberPage);
        const bestPracticesBlockTemplate = populateTemplateBestPractices(options, page.bestPractices,numberPage);
        const ecoIndexBlockTemplate = populateTemplateEcoIndex(options, page.ecoIndex,numberPage);
        
        templatePerPage =
            templatePerPage
                .replace(performanceBlock, performanceBlockTemplate)
                .replace(accessibilityBlock, accessibilityBlockTemplate)
                .replace(bestPracticesBlock, bestPracticesBlockTemplate)
                .replace(ecoIndexBlock, ecoIndexBlockTemplate)
                .replace(numberPageTag, numberPage)
                .replace(pageNameTag, page.pageName)
                .replace(lighthouseReportPath, page.lighthouseReport);
        
        
        templatePerPage = populateMetrics(options, templatePerPage, page.metrics);    
        templatePerPage = populateGreentItMetrics(options, templatePerPage, {
            greenhouseGasesKm: page.greenhouseGasesKm,
            waterShower: page.waterShower,
            greenhouseGases: page.greenhouseGases,
            water: page.water
        });    
        htmlPerPage += templatePerPage;
    });
    return htmlPerPage;
};

const populateTemplatePerformance = (options, performance,numberPage) => {
    if (options?.verbose) {
        console.log(`populate performance with value:${performance} for page ${numberPage}`);
    }
    const templatePath = path.join(__dirname, folderTemplate, "templatePerfomance.html");
    const template = fs.readFileSync(templatePath).toString();
    return defineCssClass(performance, template, performanceTag);
};

const populateTemplateAccecibility = (options, accessibility,numberPage) => {
    if (options?.verbose) {
        console.log(`populate accessibility with value: ${accessibility} for page ${numberPage}`);
    }
    const templatePath = path.join(__dirname, folderTemplate, "templateAccecibility.html");
    const template = fs.readFileSync(templatePath).toString();
    return defineCssClass(accessibility, template, accessibilityTag);
};

const populateTemplateBestPractices = (options, bestPractices,numberPage) => {
    if (options?.verbose) {
        console.log(`populate bestPractices with value ${bestPractices} for page ${numberPage}` );
    }
    const templatePath = path.join(__dirname, folderTemplate, "templateBestPractices.html");
    const template = fs.readFileSync(templatePath).toString();
    return defineCssClass(bestPractices, template, bestPracticesTag);
};

const populateTemplateEcoIndex = (options, ecoIndex,numberPage) => {
    if (options?.verbose) {
        console.log(`populate ecoIndex with value: ${ecoIndex} for page: ${numberPage}`);
    }
    const templatePath = path.join(__dirname, folderTemplate, "templateEcoIndex.html");
    const template = fs.readFileSync(templatePath).toString();
    return defineCssClass(ecoIndex, template, ecoIndexTag);
};

const defineCssClass = (value, template, tagReplace) => {
    const cssPassClass = "lh-gauge__wrapper--pass";
    const cssAverageClass = "lh-gauge__wrapper--average";
    const cssFailClass = "lh-gauge__wrapper--fail";
    const cssNotApplicableClass = "lh-gauge__wrapper--not-applicable";
    let classUsed = "";

    if (value > 66)
        classUsed = cssPassClass;
    else if (value < 66 && value > 33)
        classUsed = cssAverageClass;
    else if (value < 33 && value !== 0)
        classUsed = cssFailClass;
    else
        classUsed = cssNotApplicableClass;
    return template.replace(cssClassTag, classUsed).replace(tagReplace, value);
};