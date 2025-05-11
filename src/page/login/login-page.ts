import {html, View} from "rune-ts";
import {LoginPageForm} from "./login-page-form.ts";

export class LoginPage extends View<any>{
    override template() {
        return html`
            <div>
                <div class="login-box">
                    <h2>Login</h2>
                    ${new LoginPageForm({})}
                    <div class="extra-links">
                        <p><a href="#">Create an account</a></p>
                    </div>
                </div>
            </div>
        `;
    }
}