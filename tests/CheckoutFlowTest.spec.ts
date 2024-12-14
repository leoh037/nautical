import {test, expect, Locator, FrameLocator } from "@playwright/test";
import { navigateToStoreFront } from "../utilities/general-utilities/navigation-helpers";
import { StoreFrontPage } from "../pages/StoreFrontPage";
import { ProductsPage } from "../pages/ProductsPage";
import { IndividualProductPage } from "../pages/IndividualProductPage";
import { addCurrentProductToCart } from "../utilities/test-utilities/shopping-cart-test-helpers";
import { ShoppingCartPage } from "../pages/ShoppingCartPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { ThankYouPage } from "../pages/ThankYouPage";

test("An automated test covering an e-commerce checkout flow", async ({ page,request }) => {
    test.setTimeout(100 * 1000)

    // navigating to the store front 
    await navigateToStoreFront(page);

    // navigating to the products page and selecting a product
    let storeFrontPage: StoreFrontPage = await StoreFrontPage.getInstance(page);
    await expect(storeFrontPage.storefront_image).toBeVisible();
    await expect(storeFrontPage.shop_now_button).toBeVisible();
    await storeFrontPage.shop_now_button.click();
    await page.waitForLoadState()
    
    let productsPage: ProductsPage = await ProductsPage.getInstance(page);
    await expect(productsPage.page_title).toBeVisible()
    expect(await productsPage.page_title.textContent()).toBe('All Products')

    const productName: string = 'Classic Leather Jacket';
    let product: Locator | null = await productsPage.getProduct(productName);
    if(product != null){
        await expect(product, 'The product was not visible').toBeVisible();
    } else {
        throw new Error('The product was null');
    }
    await expect(product).toBeVisible();
    let listedPrice: string = await productsPage.getProductPrice(product);
    await product.click();
    await page.waitForLoadState();

    // ensuring that the page for the right product was opened
    let individualProductPage: IndividualProductPage = await IndividualProductPage.getInstance(page);
    await expect(individualProductPage.add_to_cart_button).toBeVisible();
    let actualProductName: string = await individualProductPage.getProductName();
    expect(actualProductName).toMatch(productName);
    let actualProductPrice: string = await individualProductPage.getProductPrice();
    expect(actualProductPrice).toBe(listedPrice);

    // adding the selected product to the shopping cart, verifying the contents of the shoopping cart and clicking on "checkout"
    const productCount: number = 1;
    await addCurrentProductToCart(page, productCount);
    let shoppingCart: ShoppingCartPage = await ShoppingCartPage.getInstance(page);
    await shoppingCart.clickCheckoutButton();

    let checkoutPage = await CheckoutPage.getInstance(page);
    await expect(checkoutPage.shipping_information_form).toBeVisible();
    await expect(checkoutPage.shipping_methods_form).toBeVisible();
    await expect(checkoutPage.billing_information_form).toBeVisible();

    // attempting to save empty shipping/billing information
    await checkoutPage.clickShippingSaveButton();
    let requiredFieldLabels = await checkoutPage.shipping_information_form.locator(checkoutPage.required_field_label_selector)
    await expect(requiredFieldLabels).toHaveCount(4)
    await page.reload();

    checkoutPage = await CheckoutPage.getInstance(page);
    await checkoutPage.clickBillinggSaveButton();
    requiredFieldLabels = await checkoutPage.billing_information_form.locator(checkoutPage.required_field_label_selector)
    await expect(requiredFieldLabels).toHaveCount(3)
    await page.reload();

    checkoutPage = await CheckoutPage.getInstance(page);
    let checkbox = await checkoutPage.billing_information_form.locator(checkoutPage.use_shipping_address_checkbox);
    await expect(checkbox).toBeVisible();
    await checkbox.click();
    await expect(checkbox).toBeChecked();
    await checkoutPage.clickBillinggSaveButton();
    requiredFieldLabels = await checkoutPage.billing_information_form.locator(checkoutPage.required_field_label_selector)
    await expect(requiredFieldLabels).toHaveCount(3)

    await page.reload();
    checkoutPage = await CheckoutPage.getInstance(page);

    let country: string = "canada"
    let postalCode: string = 'M6N 1C7'

    // Filling in all the shipping/billing details with test data
    let userInformation = {
        email: "dummy@gmail.com",
        firstname: "Firstname",
        lastname: "Lastname",
        country: `${country}`,
        addressline: "123 Dummy Street",
        city: "Dummytown",
        province: "ontario",
        postalcode: `${postalCode}`,
        phone: "16478385624"
    }
    await checkoutPage.fillBillingInformation(userInformation)
    await checkoutPage.clickShippingSaveButton();

    // verifying that the right shipping information was recorded
    let shippingAddress = await checkoutPage.shipping_information_form.locator(checkoutPage.address_selector);
    await expect(shippingAddress).toBeVisible();
    await expect(await shippingAddress.locator('span').filter({ hasText: `${userInformation.firstname} ${userInformation.lastname}`})).toBeVisible();
    await expect(await shippingAddress.locator('span').filter({ hasText: `${userInformation.addressline}`})).toBeVisible();
    await expect(await shippingAddress.locator('span').filter({ hasText: `${userInformation.country}`})).toBeVisible();
    await expect(await shippingAddress.locator('span').filter({ hasText: `+${userInformation.phone}`})).toBeVisible();

    const delivery: string = 'QA Automation Quick Delivery';
    let shippingCost: string = await checkoutPage.selectShippingMethod(delivery)
    await checkoutPage.clickShippingMethodSaveButton();
    let deliveryMethod =  await checkoutPage.shipping_methods_form.locator('dl[class="space-y-3"]');
    await expect(deliveryMethod).toBeVisible();
    await expect(await deliveryMethod.locator('dd').filter({ hasText: `${delivery} - $${shippingCost}`})).toBeVisible();

    // Selecting the same shopping address for the billing address
    await checkoutPage.checkUseShippingAddress();
    await checkoutPage.clickBillinggSaveButton();

    // verifying that the right billing information was recorded
    let billingAddress = await checkoutPage.billing_information_form.locator(checkoutPage.address_selector);
    await expect(billingAddress).toBeVisible();
    await expect(await billingAddress.locator('span').filter({ hasText: `${userInformation.firstname} ${userInformation.lastname}`})).toBeVisible();
    await expect(await billingAddress.locator('span').filter({ hasText: `${userInformation.addressline}`})).toBeVisible();
    await expect(await billingAddress.locator('span').filter({ hasText: `${userInformation.country}`})).toBeVisible();
    await expect(await billingAddress.locator('span').filter({ hasText: `+${userInformation.phone}`})).toBeVisible();

    // verifying the order summary
    let summaryItem: Locator | null = await checkoutPage.getOrderSummaryItem(productName);
    await expect(summaryItem!).toBeVisible();
    let summaryItemPrice: string = await checkoutPage.getItemPrice(summaryItem!);
    await expect(summaryItemPrice).toBe(listedPrice)
    let summaryItemCount: string = await checkoutPage.getItemCount(summaryItem!);
    await expect(parseInt(summaryItemCount)).toBe(productCount);

    let calculatedSummarySubtotal: string = await checkoutPage.calculateSummarySubtotal();
    let calculatedSummaryTotal: string = await checkoutPage.calculateSummaryTotal();
    expect(calculatedSummarySubtotal).toBe(await checkoutPage.getSummarySubTotal())
    expect(await checkoutPage.getSummaryShippingCost()).toBe(shippingCost);
    expect(calculatedSummaryTotal).toBe(await checkoutPage.getSummaryTotal());

    // Filling in payment information using Stripe’s test data
    let paymentsection: Locator =  await page.locator(checkoutPage.payment_section_selector);
    await expect(paymentsection).toBeVisible();

    // Getting the stripe payment form iframe handle
    let paymentIframe: FrameLocator = await page.frameLocator(checkoutPage.payment_iframe_selector)
    await expect(paymentIframe).toBeTruthy();

    // Attempting to provide an incorrect credit card number
    let incorrectCreditCardNumber: string = "4242 4242 4242 4241"
    await checkoutPage.enterCardNumber(incorrectCreditCardNumber);
    await (await paymentIframe.locator(checkoutPage.card_button_selector)).click();
    let paymentError: Locator = await paymentIframe.locator(checkoutPage.payment_error_seletor).filter({ hasText: 'Your card number is invalid.' })
    await expect(paymentError).toBeVisible();

    let insufficientCreditCardNumber: string = '4000 0000 0000 9995';
    let expiredCreditCardNumber: string = '4000 0000 0000 0069';
    let validCreditCardNumber: string = '4242 4242 4242 4242';
    let creditCard = {
       number: "",
       cvc: "123",
       date: "01 / 26",
       country: `${country}`,
       postalcode: `${postalCode}`
    }

    // Attempting to complete a transaction with a credit card that does not have sufficient funds
    creditCard.number = insufficientCreditCardNumber;
    await checkoutPage.fillCreditCardInformation(creditCard);
    await checkoutPage.clickConfirmOrderButton();
    paymentError = await paymentIframe.locator(checkoutPage.payment_error_seletor).filter({ hasText: 'Your card has insufficient funds. Try a different card.' });
    await expect(paymentError).toBeVisible();
    let checkoutError: Locator = await page.locator('[class="color-red-600"]').filter({ hasText: 'Your card has insufficient funds. Try a different card.' });
    await expect(checkoutError).toBeVisible();

    // Attempting to complete a transaction with an expired credit card
    await checkoutPage.enterCardNumber(expiredCreditCardNumber);
    await checkoutPage.clickConfirmOrderButton();
    paymentError = await paymentIframe.locator(checkoutPage.payment_error_seletor).filter({ hasText: 'Your card has expired.' });
    await expect(paymentError).toBeVisible();
    checkoutError = await page.locator('[class="color-red-600"]').filter({ hasText: 'Your card is expired. Try a different card.' });
    await expect(checkoutError).toBeVisible();

    // Attempting to complete a transaction with a valid credit card
    await checkoutPage.enterCardNumber(validCreditCardNumber);
    await checkoutPage.clickConfirmOrderButton();
    await page.waitForLoadState();

    // Completing the checkout process and verifying it was successful
    let thankYouPage: ThankYouPage = await ThankYouPage.getInstance(page);
    await expect(thankYouPage.thank_you_messsage).toBeVisible();
    await expect(thankYouPage.continue_shopping_link).toBeVisible();

    // Navigating back to the storefront page
    await thankYouPage.continue_shopping_link.click();
    await page.waitForLoadState();
    storeFrontPage = await StoreFrontPage.getInstance(page);
    await expect(storeFrontPage.storefront_image).toBeVisible();
    
})