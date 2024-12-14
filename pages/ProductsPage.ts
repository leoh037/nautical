import { expect, Locator, Page } from "@playwright/test";
import { selectors } from "../globals";

export class ProductsPage {

    private page: Page;

    // page locators
    page_title: Locator;

    // page selectors
    product_selector: string = 'section[aria-labelledby="product-heading"] > div > div';

    private constructor(page: Page){
        this.page = page;
    }

    private async initialise(): Promise<void> {
        this.page_title = await this.page.locator('h1.text-global-font-color');
    }

    static async getInstance(page): Promise<ProductsPage> {
        const instance = new ProductsPage(page);
        await instance.initialise();
        return instance;
    }

    async getProduct(productName: string): Promise<Locator | null> {
        let products: Locator[] = await this.page.locator(this.product_selector).all();
        const numberOfProducts: number = products.length;
        let currentProduct: Locator;
        let currentProductName: string = '';
        for(let i = 0; i < numberOfProducts; i++){
            currentProduct = products[i];
            currentProductName = (await currentProduct.locator('h3 > a').textContent())!.toString();
            if(currentProductName.includes(productName)){
                return currentProduct;
            }
        }
        return null;
    }

    async getProductPrice(productLocator: Locator): Promise<string> {
        let productPrice: Locator = await productLocator.locator(selectors.price_selector);
        await expect(productPrice).toBeVisible();
        let productPriceText: string = (await productPrice.textContent())!.toString();
        return productPriceText.slice(1);;
    }

}