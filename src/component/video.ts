import {Card} from "./card.ts";
import {html} from "rune-ts";

export class Video extends Card {
    override template() {
        return html`
            <div>
                <span >Video</span>
            </div>
        `;
    }
}