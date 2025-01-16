before(browser => browser.navigateTo("http://automationpractice.multiformis.com/index.php")
    .window.maximize()
    .waitForElementVisible("body", 5000)
)
describe("Contact us test cases", function () {
    const path = require('path');
    const filePath = path.resolve(__dirname, '../file.png');
    const contact = browser.page.contactUsPage()
    const subject = 'Webmaster'
    const email = 'test@gmail.com'
    const Invalidemail = "test"
    const order = 'order'
    const InvalidOrder= "%^&%$"
    const message = 'message'
    const Invalidmessage = " "
    it("Testing submit with all fields", function (browser) {
        contact.navigateToContactPage()
            .setForm(subject, email, order, filePath, message)
            .submitform()
            .waitForElementVisible(contact.elements.success, 5000) //checking alert is visable
        browser.assert.textContains(contact.elements.success, "Your message has been successfully sent to our team.")  //checking the contenct of the alert pop-up
    })
    it("Testing submit with required fields and file upload", function (browser) {
        contact.navigateToContactPage()
            .setForm(subject, email, '', filePath, message)
            .submitform()
            .waitForElementVisible(contact.elements.success, 5000) //checking alert is visable
        browser.assert.textContains(contact.elements.success, "Your message has been successfully sent to our team.")  //checking the contenct of the alert pop-up
    })
    it("Testing submit with invalid order format", function () {
        contact.navigateToContactPage()
            .setForm(subject, email, InvalidOrder, filePath,message)
            .submitform()
            .waitForElementVisible(contact.elements.error, 5000)
        browser.assert.textContains(contact.elements.error, "Invalid")
    })
    it("Testing submit with message containing only whitespace ", function () {
        contact.navigateToContactPage()
            .setForm(subject, email, order, filePath,Invalidmessage)
            .submitform()
            .waitForElementVisible(contact.elements.error, 5000)
        browser.assert.textContains(contact.elements.error, "The message cannot be blank.")
    })
    it("Testing submit with an invalid email format", function (browser) {
        contact.navigateToContactPage()
            .setForm(subject, Invalidemail, order, filePath, message)
            .submitform()
            .waitForElementVisible(contact.elements.error, 5000) //checking alert is visable
        browser.assert.textContains(contact.elements.error, "Invalid email address.")  //checking the contenct of the alert pop-up
    })
    it("Testing submit with required fields only", function (browser) {
        contact.navigateToContactPage()
            .setForm(subject, email, '', '', message)
            .submitform()
            .waitForElementVisible(contact.elements.success, 5000) //checking alert is visable
        browser.assert.textContains(contact.elements.success, "Your message has been successfully sent to our team.")  //checking the contenct of the alert pop-up
    })
    it("Testing submit without required fields", function (browser) {
        contact.navigateToContactPage()
            .setForm(subject, '', order, filePath, message)
            .submitform()
            .waitForElementVisible(contact.elements.error, 5000) //checking alert is visable
        browser.assert.textContains(contact.elements.error, "Invalid email address.")  //checking the contenct of the alert pop-up
        contact.emptyform()
            .setForm('', email, order, filePath, message)
            .submitform()
            .waitForElementVisible(contact.elements.error, 5000)
        browser.assert.textContains(contact.elements.error, "Please select a subject from the list provided.")
        contact.emptyform()
            .setForm(subject, email, order, filePath, '')
            .submitform()
            .waitForElementVisible(contact.elements.error, 5000)
        browser.assert.textContains(contact.elements.error, "The message cannot be blank.")
    })
    after(browser => browser.pause(5000).end())
})