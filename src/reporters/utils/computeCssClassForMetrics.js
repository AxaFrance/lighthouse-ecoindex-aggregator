const FAILED_CSS_CLASS = "lh-audit--fail lh-audit__display-text";

const computeCssClassForMetrics = (metric) => {
  if (metric.status === "error") {
    return FAILED_CSS_CLASS;
  }
  return "";
};

module.exports = computeCssClassForMetrics;
