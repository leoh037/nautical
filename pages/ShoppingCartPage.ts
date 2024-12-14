import { expect, Locator, Page } from "@playwright/test";
import { selectors } from "../globals";

export class ShoppingCartPage {

    private page: Page;
    dialog: Locator

    shopping_cart_title: Locator;
    shopping_cart_item_selector: string = 'ul > li';
    sub_total_selector: string = `div.text-base > p > span${selectors.price_selector}`;
    checkout_button: Locator;

    private constructor(page: Page){
        this.page = page;
    }

    private async initialise(): Promise<void> {
        this.dialog = await this.page.locator('[id*="headlessui-dialog-panel-:r"]');
        await expect(this.dialog, 'The shopping cart dialog was not visible').toBeVisible();
        this.shopping_cart_title = await this.dialog.locator('[id*="headlessui-dialog-title-:r"]');
        this.checkout_button = await this.dialog.locator('button[type="submit"]').filter({ hasText: 'Checkout'});
    }

    static async getInstance(page: Page): Promise<ShoppingCartPage> {
        const instance: ShoppingCartPage = new ShoppingCartPage(page);
        await instance.initialise();
        return instance;
    }

    async getShoppingCartItem(itemName: string): Promise<Locator | null> {
        let items: Locator[] = await this.dialog.locator(this.shopping_cart_item_selector).all();
        const numberOfItems: number = items.length;
        let currentItem: Locator;
        let currentItemName: string = '';
        for(let i = 0; i < numberOfItems; i++){
            currentItem = items[i];
            currentItemName = (await currentItem.locator('h3 > a').textContent())!.toString();
            if(currentItemName.includes(itemName)){
                return currentItem;
            }
        }
        return null;
    }

    async calculateShoppingCartSubtotal(): Promise<string> {
        let total: number = 0.0;
        let items: Locator[] = await this.dialog.locator(this.shopping_cart_item_selector).all();
        const numberOfItems: number = items.length;
        let currentItem: Locator;
        let currentItemPrice: number;
        let currentItemQuantity: number;
        let currentItemTotal: number;
        for(let i = 0; i < numberOfItems; i++){
            currentItem = items[i];
            currentItemPrice = (parseFloat(await this.getItemPrice(currentItem)));
            currentItemQuantity = parseInt(await this.getItemCount(currentItem));
            currentItemTotal = currentItemPrice * currentItemQuantity;
            total += currentItemTotal;
        }
        return total.toFixed(2);
    }

    async getTotalQuantityOfItemsInCart(): Promise<string>{
        let totalQuantity: number = 0;
        let items: Locator[] = await this.dialog.locator(this.shopping_cart_item_selector).all();
        const numberOfItems: number = items.length;
        let currentItem: Locator;
        let currentItemQuantity: number;
        for(let i = 0; i < numberOfItems; i++){
            currentItem = items[i];
            currentItemQuantity = parseInt(await this.getItemCount(currentItem))
            totalQuantity += currentItemQuantity;
        }
        return totalQuantity.toString();
    }

    async getItemName(item: Locator): Promise<string> {
        let itemName: Locator = await item.locator('h3 > a');
        await expect(itemName).toBeVisible();
        let itemPriceText = (await itemName.textContent())!.toString()
        return itemPriceText;
    }

    async getItemPrice(item: Locator): Promise<string> {
        let itemPrice: Locator = await item.locator(selectors.price_selector);
        await expect(itemPrice).toBeVisible();
        let itemPriceText = (await itemPrice.textContent())!.toString();
        return itemPriceText.slice(1);
    }

    async getItemCount(item: Locator): Promise<string> {
        let ammountTextBox = await this.dialog.locator(selectors.ammount_textbox_selector);
        await expect(ammountTextBox).toBeVisible();
        let count: null | string = await ammountTextBox.getAttribute('value');
        return count!.toString();
    }

    async increaseItemCountByOne(item: Locator): Promise<boolean> {
        return true
    }

    async decreaseItemCountByOne(item: Locator): Promise<boolean> {
        return true
    }

    async clickRemoveButton(item: Locator, itemName: string): Promise<void> {
        let removeBtn = await this.dialog.locator('button').filter({ hasText: 'Remove'});
        await expect(removeBtn).toBeVisible();
        await removeBtn.click();
        await this.page.waitForLoadState('domcontentloaded');
    }

    async getShoppingCartSubtotal(): Promise<string> {
        let subTotal: Locator = await this.dialog.locator(this.sub_total_selector);
        await expect(subTotal).toBeVisible();
        let subTotalText: string = (await subTotal.textContent())!.toString();
        return subTotalText.slice(1);
    }

    async clickCheckoutButton(): Promise<void> {
        await expect(this.checkout_button).toBeVisible();
        await this.checkout_button.click();
        await this.page.waitForLoadState();
    }


}