import { HPS } from "./HPS";
/**
 * @namespace Heartland.Frames
 */
export declare class Frames {
    /**
     * Heartland.Frames.configureIframe
     *
     * Prepares the pages iFrames for communication with the parent window.
     *
     * @param {Heartland.HPS} hps
     * @listens click
     * @listens message
     */
    static configureIframe(hps: HPS): void;
    /**
     * Heartland.Frames.makeFieldsAndLink
     *
     * Creates a set of single field iFrames and stores a reference to
     * them in the parent window's state.
     *
     * @param {Heartland.HPS} hps
     */
    static makeFieldsAndLink(hps: HPS): void;
    /**
     * Heartland.Frames.monitorFieldEvents
     *
     * @param {Heartland.HPS} hps
     * @param {string | EventTarget} target
     */
    static monitorFieldEvents(hps: HPS, target: string | EventTarget): void;
}
