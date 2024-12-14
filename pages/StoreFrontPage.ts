import { Locator, Page } from "@playwright/test";

export class StoreFrontPage {

    private page: Page;

    storefront_image: Locator;
    shop_now_button: Locator;

    private constructor(page: Page){
        this.page = page;
    }

    private async initialise(): Promise<void> {
        this.storefront_image = await this.page.locator('[class="mx-auto rounded-lg h-sm object-cover"]')
        this.shop_now_button = await this.page.locator('[href="/products"]');
    }

    static async getInstance(page): Promise<StoreFrontPage> {
        const instance: StoreFrontPage = new StoreFrontPage(page);
        await instance.initialise();
        return instance;
    }


}