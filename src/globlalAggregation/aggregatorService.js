module.exports = (options, resultsGlobalLighthouse, resultsGlobalEcoindex) => {
  if (options?.verbose) {
    console.log("Global aggregations.");
  }
  let globalersults = {
    ecoIndex: 0,
    grade: 0,
    greenhouseGases: 0,
    water: 0,
    performance: 0,
    accessibility: 0,
    bestPractices: 0,
    perPages: [],
  };

  if (resultsGlobalLighthouse?.perPages?.length > 0 && resultsGlobalEcoindex?.perPages?.length > 0) {
    globalersults = globalBaseLighthouse(options, resultsGlobalLighthouse, resultsGlobalEcoindex);
  }
  else if (resultsGlobalLighthouse?.perPages?.length === 0 && resultsGlobalEcoindex?.perPages?.length > 0) {
    globalersults = globalBaseEcoIndex(options, resultsGlobalLighthouse, resultsGlobalEcoindex);
  }
  return globalersults;
};

const globalBaseEcoIndex = (options, resultsGlobalEcoindex) => {
  if (options?.verbose) {
    console.log("Aggregate base ecoIndex");
  }
  const resultAggregatePerPage = [];
  resultsGlobalEcoindex.perPages.forEach((pageEcoIndex) => {
    resultAggregatePerPage.push({
      pageName: pageEcoIndex.pageName,
      lighthouseReport: "",
      accessibility: 0,
      bestPractices: 0,
      performance: 0,
      ecoIndex: pageEcoIndex.ecoIndex,
      grade: pageEcoIndex.grade,
      greenhouseGases: pageEcoIndex.greenhouseGases,
      water: pageEcoIndex.water,
      metrics: pageEcoIndex.metrics,
      greenhouseGasesKm: pageEcoIndex?.greenhouseGasesKm,
      waterShower: pageEcoIndex?.waterShower
    });
  });

  return {
    ecoIndex: resultsGlobalEcoindex.ecoIndex,
    grade: resultsGlobalEcoindex.grade,
    greenhouseGases: resultsGlobalEcoindex.greenhouseGases,
    water: resultsGlobalEcoindex.water,
    performance: 0,
    accessibility: 0,
    bestPractices: 0,
    perPages: resultAggregatePerPage,
  };
};

const globalBaseLighthouse = (options, resultsGlobalLighthouse, resultsGlobalEcoindex) => {
  if (options?.verbose) {
    console.log("Aggregate base lighthouse");
  }
  const resultAggregatePerPage = [];
  resultsGlobalLighthouse.perPages.forEach((pageLighthouse) => {
    const pageEcoIndexFound = resultsGlobalEcoindex.perPages.filter((pageEcoIndex) => pageEcoIndex.pageName === pageLighthouse.pageName)[0];
    resultAggregatePerPage.push({
      pageName: pageLighthouse.pageName,
      lighthouseReport: pageLighthouse.lighthouseReport,
      accessibility: pageLighthouse.accessibility ? pageLighthouse.accessibility : 0,
      bestPractices: pageLighthouse.bestPractices ? pageLighthouse.bestPractices : 0,
      performance: pageLighthouse.performance ? pageLighthouse.performance : 0,
      ecoIndex: pageEcoIndexFound ? pageEcoIndexFound.ecoIndex : 0,
      grade: pageEcoIndexFound ? pageEcoIndexFound?.grade : "",
      greenhouseGases: pageEcoIndexFound ? pageEcoIndexFound?.greenhouseGases : 0,
      water: pageEcoIndexFound ? pageEcoIndexFound?.water : 0,
      metrics: pageEcoIndexFound?.metrics,
      greenhouseGasesKm: pageEcoIndexFound?.greenhouseGasesKm,
      waterShower: pageEcoIndexFound?.waterShower
    });
  });
  return {
    ecoIndex: resultsGlobalEcoindex.ecoIndex,
    grade: resultsGlobalEcoindex.grade,
    greenhouseGases: resultsGlobalEcoindex.greenhouseGases,
    water: resultsGlobalEcoindex.water,
    performance: resultsGlobalLighthouse.performance,
    accessibility: resultsGlobalLighthouse.accessibility,
    bestPractices: resultsGlobalLighthouse.bestPractices,
    perPages: resultAggregatePerPage,
  };
};
