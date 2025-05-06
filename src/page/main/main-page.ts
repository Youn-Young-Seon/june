import {html, View} from "rune-ts";

export class MainPage extends View<any> {
    override template() {
        return html`
            <div>
                <div>
                    <span>Picture</span>
                </div>
                <div>
                    <span>Video</span>
                </div>
            </div>
        `;
    }
}