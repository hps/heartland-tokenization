import { HPS } from "./HPS";
import { Options } from "./types/Options";
/**
 * @namespace Heartland.Events
 */
export declare class Events {
    /**
     * Heartland.Events.addHandler
     *
     * Adds an `event` handler for a given `target` element.
     *
     * @param {string | EventTarget} target
     * @param {string} event
     * @param {EventListener} callback
     */
    static addHandler(target: string | EventTarget, event: string, callback: EventListener): void;
    /**
     * Heartland.Events.removeHandler
     *
     * Removes an `event` handler for a given `target` element.
     *
     * @param {string | EventTarget} target
     * @param {string} event
     * @param {EventListener} callback
     */
    static removeHandler(target: string | EventTarget, event: string, callback: EventListener): void;
    /**
     * Heartland.Events.trigger
     *
     * Fires off an `event` for a given `target` element.
     *
     * @param {string} name
     * @param {any} target
     * @param {any} data [optional]
     */
    static trigger(name: string, target: any, data?: any, bubble?: boolean): void;
    /**
     * Heartland.Events.frameHandleWith
     *
     * Wraps `hps` state in a closure to provide a `Heartland.Messages.receive`
     * callback handler for iFrame children.
     *
     * @param {Heartland.HPS} hps
     */
    static frameHandleWith(hps: HPS): (m: any) => void;
    /**
     * tokenizeIframe
     *
     * Tokenizes card data. Used in iframe integrations to tokenize on Heartland's
     * servers.
     *
     * @param {Heartland.HPS} hps
     * @param {string} publicKey
     */
    static tokenizeIframe(hps: HPS, data: Options): void;
    /**
     * addFieldFrameFocusEvent
     *
     * Ensures an iframe's document forwards its received focus
     * to the input field. Helps provide consistent behavior in
     * all browsers.
     *
     * @param {Heartland.HPS} hps
     */
    static addFieldFrameFocusEvent(hps: HPS): void;
}
