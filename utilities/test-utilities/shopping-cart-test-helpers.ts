import { expect, Locator, Page } from "@playwright/test";
import { IndividualProductPage } from "../../pages/IndividualProductPage";
import { ShoppingCartPage } from "../../pages/ShoppingCartPage";
import { NavigationBarPage } from "../../pages/NavigationBarPage";

// the following method adds products to the shopping cart and verifies the item is added
async function addCurrentProductToCart(page: Page, ammount: number = 1): Promise<void>{

    // before adding a new item, first fetch the original number of items present
    let navBar: NavigationBarPage = await NavigationBarPage.getInstance(page);
    let itemsInCart: string = await navBar.getCurrentNumberOfItemsInCart();

    // adding the current product displayed on the page to the shopping cart
    let individualProductPage: IndividualProductPage = await IndividualProductPage.getInstance(page)
    let productName: string = await individualProductPage.getProductName();
    let productPrice: string =  await individualProductPage.getProductPrice()
    expect(individualProductPage.ammount_input_textbox).toBeVisible();
    await individualProductPage.ammount_input_textbox.click();
    await page.keyboard.press('Control+A');
    await page.keyboard.type(ammount.toString());
    await individualProductPage.clickAddToCart();
    await page.waitForLoadState('domcontentloaded');

    let shoppingCart: ShoppingCartPage = await ShoppingCartPage.getInstance(page);
    await expect(shoppingCart.shopping_cart_title).toBeVisible();

    // verifying that the product is present in the shopping cart
    let item: Locator | null = await shoppingCart.getShoppingCartItem(productName);
    if(item != null){
        await expect(item, 'The shopping cart item was not visible').toBeVisible();
    } else {
        throw new Error('The shopping cart item was null')
    }

    // verifying the given product's name and price are correctly added on the shopping cart
    let itemName: string = await shoppingCart.getItemName(item);
    expect(productName).toBe(itemName);
    let itemPrice: string = await shoppingCart.getItemPrice(item);
    expect(productPrice).toBe(itemPrice);

    // verifying the subtotal listed in the shopping cart was correctly calculated
    let calculatedCartSubtotal = await shoppingCart.calculateShoppingCartSubtotal();
    expect(calculatedCartSubtotal).toBe(await shoppingCart.getShoppingCartSubtotal())

    // verifying that the total quantity of items present in the shopping cart is correct
    let totalNumberOfCartItems: string = await shoppingCart.getTotalQuantityOfItemsInCart();
    let expectedNumberOfItems: string = (parseInt(itemsInCart) + ammount).toString();
    expect(totalNumberOfCartItems).toBe(expectedNumberOfItems);
}

export{
    addCurrentProductToCart
}