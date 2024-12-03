import { test, expect } from '@playwright/test';
import { ExtensionWrapper } from "../extensions/extensionWrapper.js";

const extensions = new ExtensionWrapper();


test('test welcome page', async ({ page }) => { 
  await page.goto('https://www.axa.fr/');
  await page.getByRole('button', { name: 'Accepter et fermer' }).click();
  await extensions.analyse({page, stepName: "1_Welcome_page_AXA", selectorToWaitBeforeAnalyse:'.o-herobanner__content' });
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Véhicules' }).click();
  await page.getByRole('link', { name: 'Assurance auto' }).click();

  await expect(page.locator('h1')).toContainText('Assurance auto');
  
  await page.getByText('Estimation express').click({
    button: 'right'
  });

  await extensions.analyse({page, stepName: "2_Auto_page_AXA", selectorToWaitBeforeAnalyse:'.universe-auto' });

});



test('test health page', async ({ page }) => { 
  await page.goto('https://www.axa.fr/complementaire-sante.html');
  await page.getByRole('button', { name: 'Accepter et fermer' }).click();
  await extensions.analyse({page, stepName: "3_health_page_AXA", selectorToWaitBeforeAnalyse:'.universe-health' });
 });

test.afterAll(async ({}, testinfo) => {
  if (testinfo.status === 'passed')
  {
    await extensions.generateFinalReports();
  }
});
