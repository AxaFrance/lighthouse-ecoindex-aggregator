const HTML_ICON_FAIL = "<span class='lh-audit__score-icon' aria-label='Page à améliorer'></span>";
const HTML_ICON_PASS = "<span class='lh-audit__score-icon' aria-label='Page correcte'></span>";
const THRESHOLD = 66;

const pageInErrorOrWarning = (page) => {
  
  if (
    page.ecoIndex < THRESHOLD ||
    page.performance < THRESHOLD ||
    page.accessibility < THRESHOLD ||
    page.bestPractices < THRESHOLD
  ) {
    return HTML_ICON_FAIL;
  }
  return HTML_ICON_PASS;
};

module.exports = pageInErrorOrWarning;