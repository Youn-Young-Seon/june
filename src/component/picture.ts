import {Card} from "./card.ts";
import {html} from "rune-ts";

export class Picture extends Card {
    override template() {
        return html`
            <div>
                <span>Picture</span>
            </div>
        `
    }
}