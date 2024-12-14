import { Locator, Page } from "@playwright/test";

export class ThankYouPage {

    private page: Page;

    thank_you_messsage: Locator;
    order_number: Locator;
    continue_shopping_link: Locator;

    private constructor(page: Page){
        this.page = page;
    }

    private async initialise(): Promise<void> {
        this.thank_you_messsage = await this.page.locator('p').filter({ hasText: 'Thanks for shopping with us!'});
        this.order_number = await this.page.locator('.mt-16 > dd.mt-2');
        this.continue_shopping_link = await this.page.locator('a').filter({ hasText: 'Continue Shopping' });
    }

    static async getInstance(page): Promise<ThankYouPage> {
        const instance: ThankYouPage = new ThankYouPage(page);
        await instance.initialise();
        return instance;
    }

}