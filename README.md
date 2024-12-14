# nautical
To run the test case:

1. Clone the project repo into your local machine
2. Navigate to the project directory in your local machine
3. Open a terminal (i.e. open the project in visual studio code and open a new terminal) and install the playwright required dependencies by running the commands:

npm install @playwright/test

npx playwright install

4.  Run the testcase itself by typing in the command:

npm test CheckoutFlowTest.spec.ts

Project Notes:
1. The project framework is set up using the Page Object Modal (POM) design pattern
2. The directory “test” holds the code for the automated test case script itself: CheckoutFlowTest.spec.ts
3. The directory “pages” holds the code for all the class files corresponding to each page visited during the execution of the test case


 
