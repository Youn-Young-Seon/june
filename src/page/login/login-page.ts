import {html, View} from "rune-ts";

export class LoginPage extends View<any>{
    override template() {
        return html`
            <div>
                <div class="login-box">
                    <h2>Login</h2>
                    <form>
                        <div class="form-group">
                            <label for="id">ID</label>
                            <input type="text" id="id" placeholder="Enter your ID" />
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" placeholder="Enter your password" />
                        </div>
                        <button type="submit" class="login-button">Sign In</button>
                    </form>
                    <div class="extra-links">
                        <p><a href="#">Create an account</a></p>
                    </div>
                </div>
            </div>
        `;
    }
}