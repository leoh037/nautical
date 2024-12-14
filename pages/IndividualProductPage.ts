import { expect, Locator, Page } from "@playwright/test";
import { selectors } from "../globals";

export class IndividualProductPage {

    private page: Page;

    product_name: Locator;
    product_price: Locator;
    add_to_cart_button: Locator;
    ammount_input_textbox: Locator;

    private constructor(page: Page){
        this.page = page;
    }

    private async initialise(): Promise<void> {
        this.product_name = await this.page.locator('h1.tracking-tight');
        this.product_price = await this.page.locator(`.text-base > ${selectors.price_selector}`);
        this.add_to_cart_button = await this.page.locator('button').filter({ hasText: 'Add to Cart'});
        this.ammount_input_textbox = await this.page.locator(selectors.ammount_textbox_selector);  
    }

    static async getInstance(page): Promise<IndividualProductPage> {
        const instance: IndividualProductPage = new IndividualProductPage(page);
        await instance.initialise();
        return instance;
    }

    async getProductName(): Promise<string> {
        await expect(this.product_name).toBeVisible();
        let name = (await this.product_name.textContent())!.toString();
        return name;
    }

    async getProductPrice(): Promise<string> {
        await expect(this.product_price).toBeVisible();
        let price = (await this.product_price.textContent())!.toString();
        return price.slice(1);
    }

    async clickAddToCart(): Promise<void> {
        await expect(this.add_to_cart_button).toBeVisible();
        await this.add_to_cart_button.click();
    }
}