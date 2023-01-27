const ClassFail = "lh-audit--fail";
const ClassPass = "lh-audit--pass";
const ClassAverage = "lh-audit--average";

const statusPerPage = (page,{pass,fail}) => {
  if (
    page?.performance > pass &&
    page?.bestPractices > pass &&
    page?.accessibility > pass &&
    page?.ecoIndex > pass
  ){
    return ClassPass;
  }
  else if (
    (page?.performance <= pass && page?.performance > fail) ||
    (page?.bestPractices <= pass && page?.bestPractices > fail) ||
    (page?.accessibility <= pass && page?.accessibility > fail) ||
    (page?.ecoIndex <= pass && page?.ecoIndex > fail)
  ){
    return ClassAverage;
  }
  else if (
    (page?.performance <= fail) ||
    (page?.bestPractices <= fail) ||
    (page?.accessibility <=  fail) ||
    (page?.ecoIndex <= fail)
  ){
    return ClassFail;
  }
  else return "";
};

module.exports = {
    statusPerPage,
    ClassFail,
    ClassPass,
    ClassAverage
};
