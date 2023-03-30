const url = "https://www.google.com/";
describe("template spec", () => {
    it("ecoindex", () => {
        cy.visit(url);

        cy.task("checkEcoIndex", {
            url
        }).its("ecoIndex", {timeout: 0}).should("be.greaterThan", 70);
    });

    it("lighthouse", () => {
        cy.visit(url);
        cy.lighthouse(undefined, { output: "html"});
    });
});