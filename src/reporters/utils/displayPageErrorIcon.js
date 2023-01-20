const HTML_ICON = "<span class='lh-audit__score-icon' aria-label='Page à améliorer'></span>";

const THRESHOLD = 66;

const pageInErrorOrWarning = (page) => {
  
  if (
    page.ecoIndex < THRESHOLD ||
    page.performance < THRESHOLD ||
    page.accessibility < THRESHOLD ||
    page.bestPractices < THRESHOLD
  ) {
    console.log("value lesser than 66");
    return HTML_ICON;
  }
  return "";
};

module.exports = pageInErrorOrWarning;