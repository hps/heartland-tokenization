import {Ajax} from "./Ajax";
import {Card} from "./Card";
import {DOM} from "./DOM";
import {Events} from "./Events";
import * as Formatter from "./Formatter";
import {Frames} from "./Frames";
import {HPS} from "./HPS";
import {Messages} from "./Messages";
import {Styles} from "./Styles";
import {Util} from "./Util";
import * as Validator from "./Validator";
import {JSON2} from "./vendor/json2";

(window as any).HPS = HPS;

export default {
    Ajax: Ajax,
    Card: Card,
    DOM: DOM,
    Events: Events,
    Formatter: Formatter,
    Frames: Frames,
    HPS: HPS,
    JSON: JSON2,
    Messages: Messages,
    Styles: Styles,
    Util: Util,
    Validator: Validator
}
