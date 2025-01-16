const contactcommands = {
    navigateToContactPage() {
        return this.click("@contactButton")
    },
    setForm(subject, email, order, file, message) {
        this.setValue("@email", email)
            .setValue("@order", order)
            .setValue("@message", message)
        if (subject) {
            this.click("@WebmasterOption")

        } if (file) {
            this.uploadFile("@file", file)
        }
        return this;
    },
    submitform() {
        return this.click("@submitButton")
    },
    emptyform() {
        return this.click("@emptyOption")
            .clearValue("@email")
            .clearValue("@order")
            .clearValue("@message")
            .clearValue("@file")
    }
}
module.exports = {
    elements: {
        contactButton: {
            selector: "div#contact-link a[title='Contact us']"
        },
        WebmasterOption: {
            selector: 'select option[value="1"]'
        },
        emptyOption: {
            selector: 'select option[value="0"]'
        },
        email: {
            selector: 'input#email'
        },
        order: {
            selector: 'input#id_order'
        },
        file: {
            selector: 'input#fileUpload'
        },
        message: {
            selector: 'textarea'
        },
        submitButton: {
            selector: 'button#submitMessage'
        },
        error: {
            selector: 'div.alert li'
        },
        success: {
            selector: 'p.alert'
        }
    },
    commands: [contactcommands]
}