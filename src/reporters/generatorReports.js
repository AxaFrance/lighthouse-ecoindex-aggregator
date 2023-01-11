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
        .replace(htmlPerPageTag, htmlPerPageResult);

};
const populateTemplatePerPage = async (options, results) => {

    const numberPageTag = "{{numberPageTag}}";
    const pageNameTag = "{{PageName}}";
    let htmlPerPage = "";
    const templatePath = path.join(__dirname, folderTemplate, "templatePerPage.html");
    const templatePerPage = fs.readFileSync(templatePath).toString();
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
        htmlPerPage +=
            templatePerPage
                .replace(performanceBlock, performanceBlockTemplate)
                .replace(accessibilityBlock, accessibilityBlockTemplate)
                .replace(bestPracticesBlock, bestPracticesBlockTemplate)
                .replace(ecoIndexBlock, ecoIndexBlockTemplate)
                .replace(numberPageTag, numberPage)
                .replace(pageNameTag, page.pageName);
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