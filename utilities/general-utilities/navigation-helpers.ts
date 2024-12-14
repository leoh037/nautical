import { expect, Page } from "@playwright/test";
import { links } from "../../globals";
import { StoreFrontPage } from "../../pages/StoreFrontPage";

async function navigateToPage(page: Page, url: string): Promise<boolean> {
    try{
        await page.goto(url);
        await page.waitForURL(url);
        await page.waitForLoadState();
        return true;
    }
    catch(e){
        return false;
    }
}

async function navigateToStoreFront(page): Promise<void> {
    await expect(await navigateToPage(page, links.nautical.storefrontpage)).toBe(true);
}

export{
    navigateToStoreFront
}