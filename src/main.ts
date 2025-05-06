// @ts-ignore
import "./style.scss";
import {LoginPage} from "./page/login/login-page.ts";

document.querySelector('#app')!.append(new LoginPage({}).render());
