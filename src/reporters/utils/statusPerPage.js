const ClassFail = "lh-audit--fail";
const ClassPass = "lh-audit--pass";
const ClassAverage = "lh-audit--average";

const statusPerPage = (page) => {
  if (
    page.performance > 89 &&
    page.bestPractises > 89 &&
    page.accessibility > 89 &&
    page.ecoIndex > 66
  )
    return ClassPass;
  else if (
    (page.performance < 89 && page.performance > 49) ||
    (page.bestPractises < 89 && page.bestPractises > 49) ||
    (page.accessibility < 89 && page.accessibility > 49) ||
    (page.ecoIndex < 66 && page.ecoIndex > 33)
  )
    return ClassAverage;
  else if (
    page.performance < 49 ||
    page.bestPractises < 49 ||
    page.accessibility < 49 ||
    page.ecoIndex < 33
  )
    return ClassFail;
  else return "";
};

module.exports = {
    statusPerPage,
    ClassFail,
    ClassPass,
    ClassAverage
};
