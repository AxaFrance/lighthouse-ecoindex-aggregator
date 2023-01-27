module.exports = (options, resultsGlobalLighthouse, resultsGlobalEcoindex) => {
    if (options?.verbose) {
        console.log("Global aggregations.");
    }
    return globalBaseEcoIndex(options, resultsGlobalEcoindex, resultsGlobalLighthouse);
};

const globalBaseEcoIndex = (options, ecoindex, lighthouse = {}) => {
    if (options?.verbose) {
        console.log("Aggregate lighthouse and ecoindex results");
    }
    const resultAggregatePerPage = [];
    ecoindex?.perPages?.forEach((pageEcoIndex) => {
        const pageLighthouse = lighthouse.perPages.find((pageLighthouse) => pageEcoIndex.pageName === pageLighthouse.pageName);

        resultAggregatePerPage.push({
            pageName: pageEcoIndex.pageName,
            lighthouseReport: pageLighthouse?.lighthouseReport ?? "",
            accessibility: pageLighthouse?.accessibility ?? 0,
            bestPractices: pageLighthouse?.bestPractices ?? 0,
            performance: pageLighthouse?.performance ?? 0,

            ecoIndex: pageEcoIndex.ecoIndex,
            grade: pageEcoIndex.grade,
            greenhouseGases: pageEcoIndex.greenhouseGases,
            water: pageEcoIndex.water,
            metrics: pageEcoIndex.metrics,
            greenhouseGasesKm: pageEcoIndex.greenhouseGasesKm,
            waterShower: pageEcoIndex?.waterShower
        });
    });



    return {
        ecoIndex: ecoindex.ecoIndex ?? 0,
        grade: ecoindex.grade ?? "G",
        greenhouseGases:ecoindex.greenhouseGases?Math.round(ecoindex.greenhouseGases * 100) /100 : 0,
        water:  ecoindex.water ? Math.round( ecoindex.water *100 ) / 100 : 0,
        greenhouseGasesKm: ecoindex.greenhouseGasesKm ?? 0,
        waterShower: ecoindex.waterShower? ecoindex.waterShower : 0,
        performance: lighthouse.performance ?? 0,
        accessibility: lighthouse.accessibility ?? 0,
        bestPractices: lighthouse.bestPractices ?? 0,
        perPages: resultAggregatePerPage,
    };
};

