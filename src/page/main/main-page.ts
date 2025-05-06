import {html, View} from "rune-ts";
import {Picture} from "../../component/picture.ts";
import {Video} from "../../component/video.ts";

export class MainPage extends View<any> {
    picture = new Picture({});
    video = new Video({});

    override template() {
        return html`
            <div>
                ${this.picture}
                ${this.video}
            </div>
        `;
    }
}