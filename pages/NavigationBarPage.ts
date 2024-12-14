import { expect, Locator, Page } from "@playwright/test";

export class NavigationBarPage {

    private page: Page;

    shopping_cart_button: Locator;

    private constructor(page: Page){
        this.page = page;
    }

    private async initialise(): Promise<void> {
        this.shopping_cart_button = await this.page.locator('[class="flow-root"] > button')
    }

    static async getInstance(page): Promise<NavigationBarPage> {
        const instance: NavigationBarPage = new NavigationBarPage(page);
        await instance.initialise();
        return instance;
    }

    async clickShoppingCartButton(){
        await expect(this.shopping_cart_button).toBeVisible();
        await this.shopping_cart_button.click();
    }

    async getCurrentNumberOfItemsInCart(): Promise<string> {
        await expect(this.shopping_cart_button).toBeVisible();
        const numberOfItems: string = (await this.shopping_cart_button.locator('span.text-sm').textContent())!.toString();
        return numberOfItems;
    }

}