const HTML_ICON_FAIL = "<span class='lh-audit__score-icon' aria-label='Page à améliorer'></span>";
const HTML_ICON_PASS = "<span class='lh-audit__score-icon' aria-label='Page correcte'></span>";

const pageInErrorOrWarning = (page,pass) => {
  
  if (
    page.ecoIndex < pass ||
    page.performance < pass ||
    page.accessibility < pass ||
    page.bestPractices < pass
  ) {
    return HTML_ICON_FAIL;
  }
  return HTML_ICON_PASS;
};

module.exports = pageInErrorOrWarning;