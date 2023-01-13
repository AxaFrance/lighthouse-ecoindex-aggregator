const PAGE_ERROR_ICON = "{{IconPerPageTag}}";
const HTML_ICON = "<span class='lh-audit__score-icon' aria-label='Page à améliorer'></span>";

const THRESHOLD = 66;

const pageInErrorOrWarning = (page, template) => {
  
  if (
    page.ecoIndex < THRESHOLD ||
    page.performance < THRESHOLD ||
    page.accessibility < THRESHOLD ||
    page.bestPractices < THRESHOLD
  ) {
    console.log("value lesser than 66");
    return template.replace(PAGE_ERROR_ICON, HTML_ICON);
  }
  return template.replace(PAGE_ERROR_ICON, "");
};

module.exports = pageInErrorOrWarning;