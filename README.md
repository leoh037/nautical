# nautical

## To run the test case:

1. Clone the project repo into your local machine
2. Navigate to the project directory in your local machine
3. Open a terminal (i.e. open the project in visual studio code and open a new terminal) and install the playwright required dependencies by running the commands:

npm install @playwright/test

npx playwright install

4.  Run the testcase itself by typing in the command:

npm test CheckoutFlowTest.spec.ts

Project Notes:
- The project framework is set up using the Page Object Modal (POM) design pattern
- The directory “test” holds the code for the automated test case script itself: CheckoutFlowTest.spec.ts
- The directory “pages” holds the code for all the class files corresponding to each page visited during the execution of the test case

## Use Case Steps

### Step 1:
Navigate to the nautical store front

*Expected Result:*

The user should be able to successfully navigate to the nautical store front page, and the page contents should be successfully rendered 

### Step 2:
Click on the Shop now button in order to navigate to the product page and select a product

*Expected Result:*

The user should be successfully redirected to the Products page, and the page contents should be successfully rendered

### Step 3:
Select a product from the Products page and click on it

*Expected Result:*

The user should be successfully redirected to the page for the individual product, and the page contents should be successfully rendered

### Step 4:
Add the product to the shopping cart by clicking on the Add to Cart button

*Expected Result:*

A shopping cart sidebar dialog should open on the page. The product that was just added should be present on the shopping cart, and it should have the correct price, and be present in the correct quantity

### Step 5:
Click on the checkout button

*Expected Result:*

The user should be successfully redirected to the checkout page, and the page contents should be successfully rendered

### Step 6:
In the checkout page, attempt to save incomplete shipping and billing information

*Expected Result:*

The user should be presented with error labels on the page

### Step 7:
Complete the shipping information by filling out and saving the shipping form

*Expected Result:*

After successfully filling out and saving the shipping form a preview/summary of the shipping information should appear on the page. Furthermore, the shipping method section should become visible on the page, and it should contain a dropdown where a user may select a desired method

### Step 8:

Select a shipping method and save it

*Expected Result:*

After successfully selecting and saving the shipping method a preview/summary of the shipping method should appear on the page

### Step 9:
Select the same shipping address from the billing address by checking the required box, and save the changes

*Expected Result:*

After successfully saving the billing address a preview/summary of the billing information should appear on the page. This information should be identical to that of the shipping information Furthermore, the payment section should now become visible on the page

### Step 10:
Verify the order summary

*Expected Result:*

The selected item should be present in the order summary, and it should have both the correct price and quantity. Furthermore, the summary should contain values for the order subtotal, the calculated tax, and the order total, and these values should all be correct.

### Step 11: 
Fill out the payment information using an invalid credit card number

*Expected Result:*

The user should not be able to complete the transaction, and they should see a payment error informing them that the card number if invalid  

### Step 12:
Fill out the payment information using a credit card with insufficient funds

*Expected Result:*

The confirm order should become enabled. However when clicking on it the user should not be able to complete the transaction, and they should see a payment error informing them that the card does not have sufficient funds.  

### Step 13:
Fill out the payment information using a credit card that is expired

*Expected Result:*

The confirm order should become enabled. However when clicking on it the user should not be able to complete the transaction, and they should see a payment error informing them that the card is expired

### Step 14:
Fill out the payment information using a valid credit card

*Expected Result:*

The confirm order should become enabled, and when clicking on it the user should be able to complete the transaction. As a result of completing successfully completing the transaction, the user should be redirected to a thank you page, and its contents should be successfully rendered.

### Step 15:
Navigate back to the storefront by clicking on the “continue shopping” link

*Expected Result:*

The user should be redirected back to the nautical store front page, and the page contents should be successfully rendered















 
