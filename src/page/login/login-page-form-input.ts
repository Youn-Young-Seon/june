import {CustomEventWithDetail, html, on, View} from "rune-ts";

export type InputText = {
    id: string,
    type: string,
}

export class DataSubmitted extends CustomEventWithDetail<string> {}

export class LoginPageFormInput extends View<InputText> {
    override template() {
        return html`
            <div class="form-group">
                <label for="${this.data.id}">${this.data.id.toUpperCase()}</label>
                <input type="${this.data.id}" id="${this.data.id}" 
                       placeholder="Enter your ${this.data.id.toUpperCase()}" />
            </div>
        `;
    }

    @on('keypress')
    inputData(e: KeyboardEvent) {
        if (e.code === 'Enter') {
            let input = e.target as HTMLInputElement;
            let inputData = input.value.trim();
            if (inputData) {
                this.dispatchEvent(DataSubmitted, { bubbles: true, detail: inputData })
                input.value = '';
            }
        }
    }
}