import {html, on, View} from "rune-ts";
import {DataSubmitted, type InputText, LoginPageFormInput} from "./login-page-form-input.ts";

export class LoginPageForm extends View<any> {
    inputData: InputText[] = [
        {id: "email", type: "text"},
        {id: "password", type: "password"}
    ]

    override template() {
        return html`
            <form class="form">
                ${this.inputData.map(data => new LoginPageFormInput(data))}
                <input type="submit" class="login-button" value="Sign In"/>
            </form>
        `;
    }

    @on('submit')
    sendData(e: SubmitEvent) {
        e.preventDefault();
    }

    @on(DataSubmitted)
    submitData(e: DataSubmitted) {
        console.log(e);
    }
}