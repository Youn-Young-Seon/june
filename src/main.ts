import {MainPage} from "./page/main/main-page.ts";
// @ts-ignore
import "./style.scss";

document.querySelector('#app')!.append(new MainPage({}).render());
