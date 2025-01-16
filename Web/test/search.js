before(browser => browser.navigateTo("http://automationpractice.multiformis.com/index.php")
    .window.maximize()
    .waitForElementVisible("body", 5000)
)
describe("Search test cases", function () {
    const search = browser.page.SearchPage()
    const item = 'dress'
    const emptyItem=""
    const invalidItem="asdasdasdasd"
    it("Testing search for a dress", async function (browser) {
        search.searchforitem(item)
        let elements = await browser.findElements(search.elements.items)
        const firstElement = elements[0] 
        browser.assert.textContains(firstElement, "Dressyigi")
    })
    it("Testing search with empty string", function (browser) {
        search.searchforitem(emptyItem)
        browser.assert.textContains(search.elements.alert, "Please enter a search keyword")
    })
    it("Testing search with invalid string", function (browser) {
        search.searchforitem(invalidItem)
        browser.assert.textContains(search.elements.alert, "No results were found for your search")
    })
    after(browser => browser.pause(5000).end())
})
