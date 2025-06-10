export default class CSSValidator {

    ENDPOINT = "https://jigsaw.w3.org/css-validator/validator/";

    constructor(url) {
        this.url = url;
    }

    async validate() {
        let success = false;
        const response = await fetch(`${this.ENDPOINT}?output=json&&profile=css3&uri=${this.url}`);
        if (response.ok) {
            const data = await response.json();
            this.data = data;
            success = Object.keys(data).length > 0;
        }
        return success;
    }

    getDetails() {
        const details = this.data.cssvalidation.errors.map(error => {
            return {
                source: error.source,
                message: error.message
            };
        });
        return details;
    }
}
