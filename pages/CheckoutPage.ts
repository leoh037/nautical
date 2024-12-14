import { expect, FrameLocator, Locator, Page } from "@playwright/test";
import { selectors } from "../globals";

export class CheckoutPage {
    private page: Page;

    // selectors
    first_name_textbox_selector: string = 'input#firstName';
    last_name_textbox_selector: string = 'input#lastName';
    Country_dropdown_selector: string = 'select#country';
    address_line_1_textbox_selector: string = 'input#streetAddress1';
    address_line_2_textbox_selector: string = 'input#streetAddress2';
    city_textbox_selector: string = 'input#city';
    country_area_dropdown_selector: string = 'select#countryArea';
    postal_code_textbox_selector: string = 'input#postalCode';
    phone_textbox_selector: string = 'input#phone';
    required_field_label_selector: string = '[class="text-red-600"]';
    shipping_method_dropdown_selector: string = 'select#marketplace';
    shipping_save_button_selector: string = 'button[value="saveShippingInformation"]';
    billing_save_button_selector: string = 'button[value="saveBillingInformation"]';
    shipping_method_save_button_selector: string = 'button[value="updateShippingMethods"]';
    address_selector: string = 'dd > address';

    card_number_selector: string = 'input#Field-numberInput'; 
    card_date_selector: string = 'input#Field-expiryInput';
    card_security_code_selector: string = 'input#Field-cvcInput';
    card_country_dropdown_selector: string = 'select#Field-countryInput';
    card_postal_code_selector: string = 'input#Field-postalCodeInput';

    payment_section_selector: string = '[dir="ltr"][data-orientation="horizontal"]';
    payment_iframe_selector: string = 'form#payment-form > .StripeElement > div > iframe';
    card_button_selector: string = 'button[data-testid="card"]';
    payment_error_seletor: string = '.p-FieldError';

    // Locators 
    email_textbox: Locator;
    shipping_first_name_textbox: Locator;
    shipping_last_name_textbox: Locator;
    shipping_Country_dropdown: Locator;
    shipping_address_line_1_textbox: Locator;
    shipping_address_line_2_textbox: Locator;
    shipping_city_textbox: Locator;
    shipping_country_area_dropdown : Locator;
    shipping_postal_code_textbox: Locator;
    shipping_phone_textbox: Locator;

    shipping_information_form: Locator;
    shipping_methods_form: Locator;
    billing_information_form: Locator;
    use_shipping_address_checkbox: Locator;

    order_summary_section: Locator;

    confirm_order_button: Locator


    private constructor(page: Page){
        this.page = page;
    }

    private async initialise(): Promise<void> {
        this.email_textbox = await this.page.locator('[id="email"]');
        this.shipping_information_form = await this.page.locator('form').filter({ hasText: 'Shipping Information' });
        this.billing_information_form = await this.page.locator('form').filter({ hasText: 'Billing Information' });
        this.shipping_methods_form = await this.page.locator('form').filter({ hasText: 'Shipping Methods' });
        this.shipping_first_name_textbox = await this.page.locator(this.first_name_textbox_selector).first();
        this.shipping_last_name_textbox = await this.page.locator(this.last_name_textbox_selector).first();
        this.shipping_Country_dropdown = await this.page.locator(this.Country_dropdown_selector).first();
        this.shipping_address_line_1_textbox = await this.page.locator(this.address_line_1_textbox_selector).first();
        this.shipping_address_line_2_textbox = await this.page.locator(this.address_line_2_textbox_selector).first();
        this.shipping_city_textbox = await this.page.locator(this.city_textbox_selector).first();
        this.shipping_country_area_dropdown = await this.page.locator(this.country_area_dropdown_selector).first();
        this.shipping_postal_code_textbox = await this.page.locator(this.postal_code_textbox_selector).first();
        this.shipping_phone_textbox = await this.page.locator(this.phone_textbox_selector).first();
        this.use_shipping_address_checkbox = await this.page.locator('[name="useShippingAddressAsBilling"]');
        this.confirm_order_button = await this.page.locator('button').filter({ hasText: 'Confirm order' });
        this.order_summary_section = await this.page.locator('div.mt-4.rounded-lg');
    }

    static async getInstance(page: Page): Promise<CheckoutPage> {
        const instance: CheckoutPage = new CheckoutPage(page);
        await instance.initialise();
        return instance;
    }

    async clickShippingSaveButton(): Promise<void> {
        let saveBtn = await this.page.locator(this.shipping_save_button_selector)
        await expect(saveBtn).toBeVisible();
        await saveBtn.click();
    }

    async clickShippingMethodSaveButton(): Promise<void> {
        let saveBtn = await this.page.locator(this.shipping_method_save_button_selector)
        await expect(saveBtn).toBeVisible();
        await saveBtn.click();
    }

    async clickBillinggSaveButton(): Promise<void> {
        let saveBtn = await this.page.locator(this.billing_save_button_selector)
        await expect(saveBtn).toBeVisible();
        await saveBtn.click();
    }

    async enterEmail(email: string): Promise<void> {
        await this.fillTextbox(this.email_textbox, email)
    }

    async enterFirstName(firstName: string): Promise<void> {
        await this.fillTextbox(this.shipping_first_name_textbox, firstName);
    }

    async enterLasttName(lastName: string): Promise<void> {
        await this.fillTextbox(this.shipping_last_name_textbox, lastName);
    }

    async selectCountry(country: string){
        await this.selectOption(this.shipping_Country_dropdown, country)
    }

    async enterAddress1(address: string): Promise<void> {
        await this.fillTextbox(this.shipping_address_line_1_textbox, address);
    }

    async enterCity(city: string): Promise<void> {
        await this.fillTextbox(this.shipping_city_textbox, city);
    }

    async selectoCountryArea(area: string): Promise<void> {
        await this.selectOption(this.shipping_country_area_dropdown, area)
    }

    async enterPostalCode(code: string): Promise<void> {
        await this.fillTextbox(this.shipping_postal_code_textbox, code);
    }

    async enterPhoneNumber(number: string): Promise<void> {
        await this.fillTextbox(this.shipping_phone_textbox, number);
    }

    async fillBillingInformation(obj: {
        email: string, 
        firstname: string,
        lastname: string,
        country: string,
        addressline: string,
        city: string,
        province: string,
        postalcode: string,
        phone: string
    }): Promise<void> {
        await this.enterEmail(obj.email);
        await this.enterFirstName(obj.firstname);
        await this.enterLasttName(obj.lastname);
        await this.selectCountry(obj.country);
        await this.enterAddress1(obj.addressline);
        await this.enterCity(obj.city);
        await this.selectoCountryArea(obj.province);
        await this.enterPostalCode(obj.postalcode);
        await this.enterPhoneNumber(obj.phone);
    }

    async checkUseShippingAddress(): Promise<void> {
        let checkbox = await this.billing_information_form.locator(this.use_shipping_address_checkbox);
        let isChecked: boolean = await checkbox.isChecked();
        if(!isChecked){
            await expect(checkbox).toBeVisible();
            await checkbox.click();
            await expect(checkbox).toBeChecked();
        }
    }

    async selectShippingMethod(method: string): Promise<string> {
        let dropdown: Locator = await this.page.locator(this.shipping_method_dropdown_selector);
        await this.selectOption(dropdown, method);
        let option = await dropdown.locator('option').filter({ hasText: method});
        let optionText = (await option.textContent())!.toString();
        let dollarSignIndex = optionText.indexOf('$');
        return optionText.slice(dollarSignIndex + 1);
    }

    private async fillTextbox(textboxLocator: Locator, value: string): Promise<void> {
        await textboxLocator.scrollIntoViewIfNeeded();
        await expect(textboxLocator).toBeVisible();
        await textboxLocator.click();
        await this.page.keyboard.press('Control+A')
        await this.page.keyboard.type(value)
        let inputValue = await textboxLocator.inputValue()
        await expect(inputValue).toBe(value);
    }

    private async selectOption(selectLocator: Locator, option: string): Promise<void> {
        await expect(selectLocator).toBeVisible();
        await selectLocator.click();
        await this.page.keyboard.type(option);
        await this.page.keyboard.press('Enter')
    }

    async fillCreditCardInformation(obj: {
        number: string, 
        cvc: string,
        date: string,
        country: string,
        postalcode: string,
    }): Promise<void> {
        await this.enterCardNumber(obj.number);
        await this.entercardDate(obj.date)
        await this.enterCardSecurityCode(obj.cvc)
        await this.selectCardCountry(obj.country);
        await this.enterCardPostalCode(obj.postalcode);
    }

    async enterCardNumber(number: string): Promise<void> {
        let paymentIframe: FrameLocator = await this.page.frameLocator(this.payment_iframe_selector);
        await expect(paymentIframe).toBeTruthy();
        let cardNumberTextbox: Locator = await paymentIframe.locator(this.card_number_selector)
        await this.fillTextbox(cardNumberTextbox, number)
    }

    async entercardDate(date: string): Promise<void> {
        let paymentIframe: FrameLocator = await this.page.frameLocator(this.payment_iframe_selector);
        await expect(paymentIframe).toBeTruthy();
        let dateTextbox: Locator = await paymentIframe.locator(this.card_date_selector)
        await this.fillTextbox(dateTextbox, date)
    }

    async enterCardSecurityCode(code: string): Promise<void> {
        let paymentIframe: FrameLocator = await this.page.frameLocator(this.payment_iframe_selector);
        await expect(paymentIframe).toBeTruthy();
        let codeTextbox: Locator = await paymentIframe.locator(this.card_security_code_selector)
        await this.fillTextbox(codeTextbox, code)
    }

    async enterCardPostalCode(code: string): Promise<void> {
        let paymentIframe: FrameLocator = await this.page.frameLocator(this.payment_iframe_selector);
        await expect(paymentIframe).toBeTruthy();
        let codeTextbox: Locator = await paymentIframe.locator(this.card_postal_code_selector)
        await this.fillTextbox(codeTextbox, code)
    }

    async selectCardCountry(country: string): Promise<void> {
        let paymentIframe: FrameLocator = await this.page.frameLocator(this.payment_iframe_selector);
        await expect(paymentIframe).toBeTruthy();
        let dropdown: Locator = await paymentIframe.locator(this.card_country_dropdown_selector);
        await this.selectOption(dropdown, country);
    }

    async clickConfirmOrderButton(): Promise<void> {
        await expect(this.confirm_order_button).toBeVisible();
        await expect(this.confirm_order_button).toBeEnabled();
        await this.confirm_order_button.click();
    }


    async getOrderSummaryItem(itemName: string): Promise<Locator | null> {
        let items: Locator[] = await this.page.locator('ul > li').all();
        const numberOfItems: number = items.length;
        let currentItem: Locator;
        let currentItemName: string = '';
        for(let i = 0; i < numberOfItems; i++){
            currentItem = items[i];
            currentItemName = (await currentItem.locator('h4.text-sm').textContent())!.toString();
            if(currentItemName.includes(itemName)){
                return currentItem;
            }
        }
        return null;
    }

    async getItemPrice(item: Locator): Promise<string> {
        let price: Locator = await item.locator('p').filter({ hasText: '$'})
        await expect(price).toBeVisible();
        let priceText: string = (await price.textContent())!.toString();
        return priceText.slice(1)
    }

    async getItemCount(item: Locator): Promise<string> {
        let ammountTextBox = await item.locator(selectors.ammount_textbox_selector);
        await expect(ammountTextBox).toBeVisible();
        let count: null | string = await ammountTextBox.getAttribute('value');
        return count!.toString();
    }

    async calculateSummarySubtotal(): Promise<string> {
        let total: number = 0.0;
        let items: Locator[] = await this.page.locator('ul > li').all();
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

    async getSummarySubTotal(): Promise<string> {
        let container: Locator = await this.order_summary_section.locator('div').filter({ hasText: 'Subtotal' }); 
        let containerText: string = (await container.textContent())!.toString();
        let dollarSignIndex = containerText.indexOf('$');
        return containerText.slice(dollarSignIndex + 1);
    }

    async getSummaryShippingCost(): Promise<string> {
        let container = await this.order_summary_section.locator('div').filter({ hasText: 'Shipping' }); 
        let containerText: string = (await container.textContent())!.toString();
        let dollarSignIndex = containerText.indexOf('$');
        return containerText.slice(dollarSignIndex + 1);
    }

    async getTax(): Promise<string> {
        let container = await this.order_summary_section.locator('div').filter({ hasText: 'Taxes' }); 
        let containerText: string = (await container.textContent())!.toString();
        let dollarSignIndex = containerText.indexOf('$');
        return containerText.slice(dollarSignIndex + 1);
    }

    async getSummaryTotal(): Promise<string> {
        let element = await this.order_summary_section.locator('div > dd.text-base');
        let elementText: string = (await element.textContent())!.toString();
        let dollarSignIndex = elementText.indexOf('$');
        return elementText.slice(dollarSignIndex + 1);
    }

    async calculateSummaryTotal(): Promise<string> {
        let subTotal: string = await this.calculateSummarySubtotal();
        let shipping: string = await this.getSummaryShippingCost();
        let tax: string =  await this.getTax();
        let total: number =  parseFloat(subTotal) + parseFloat(shipping) + parseFloat(tax);
        return total.toFixed(2);
    }

}