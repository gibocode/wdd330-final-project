export default class HTMLValidator {

    ENDPOINT = "https://validator.w3.org/nu/";

    constructor(url) {
        this.url = url;
    }

    async validate() {
        let success = false;
        const response = await fetch(`${this.ENDPOINT}?out=json&doc=${this.url}`);
        console.log(response);
        if (response.ok) {
            const data = await response.json();
            console.log(data);
            this.data = data;
            success = Object.keys(data).length > 0;
        }
        return success;
    }

    getDetails() {
        const details = this.data.messages.map(message => {
            return {
                type: message.type,
                line: message.lastLine,
                message: message.message
            };
        });
        return details;
    }
}
