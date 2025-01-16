const searchcommands = {
    searchforitem(message) {
        this.setValue("@Search", message)
            .pause(2000)
            .click("@submit")
    }
}
module.exports = {
    elements: {
        Search: {
            selector: "input#search_query_top"
        },
        submit: {
            selector: "button[name='submit_search']"
        },
        items: {
            selector: "ul#product_list li h5"
        },
        alert: {
            selector: "p.alert"
        }
    },
    commands: [searchcommands]
}