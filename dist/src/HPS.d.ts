import { Messages } from "./Messages";
import { Options } from "./types/Options";
export interface Frame {
    frame?: Window;
    name?: string;
    options?: any;
    target?: string;
    targetNode?: EventTarget;
    url?: string;
}
export interface FrameCollection {
    cardNumber?: Frame;
    cardExpiration?: Frame;
    cardCvv?: Frame;
    submit?: Frame;
    child?: Frame;
    parent?: Frame;
}
/**
 * Heartland.HPS
 *
 * Initializes options and adds the default form handler if a `formId` is
 * passed as an option. This expects the default fields (see `getFields`) to
 * be present as children of `formId`.
 */
export declare class HPS {
    options: Options;
    frames: FrameCollection;
    iframe_url: string;
    Messages: Messages;
    mailbox: any;
    cacheBust: number;
    parent: Window;
    field: string;
    clickHandler: (e: Event) => void;
    loadHandler: () => void;
    receiveMessageHandlerAddedHandler: () => void;
    /**
     * Heartland.HPS (constructor)
     *
     * @constructor
     * @param {Heartland.Options} options [optional]
     * @returns {Heartland.HPS}
     */
    constructor(options?: Options);
    /**
     * Heartland.HPS.tokenize
     *
     * Tokenizes card data. Used in manual integrations where the merchant's
     * credit card fields cannot/do not match the names expected in the default
     * form handler (see `getFields`).
     *
     * @param {Heartland.Options} options [optional]
     */
    tokenize(options?: Options): void;
    /**
     * Heartland.HPS.configureInternalIframe
     *
     * Sets up a child iframe window to prepare it for communication with the
     * parent and for tokenization.
     *
     * @param {Heartland.Options} options
     */
    configureInternalIframe(options: Options): void;
    /**
     * Heartland.HPS.configureButtonFieldIframe
     *
     * Same as `Heartland.HPS.configureFieldIframe` excet the added click event
     * handler for the button.
     *
     * @param {Heartland.Options} options
     */
    configureButtonFieldIframe(options: Options): void;
    /**
     * Heartland.HPS.configureFieldIframe
     *
     * Sets up a child iframe window to prepare it for communication with the
     * parent and for tokenization.
     *
     * @param {Heartland.Options} options
     */
    configureFieldIframe(options: Options): void;
    /**
     * Heartland.HPS.resizeIFrame
     *
     * Called automatically when the child iframe window alerts the parent to
     * resize.
     *
     * @param {HTMLIFrameElement} frame
     * @param {string} height
     */
    resizeIFrame(frame: HTMLIFrameElement, height: string): void;
    /**
     * Heartland.HPS.setText
     *
     * Public API for setting an element's inner text.
     *
     * @param {string} elementid
     * @param {string} elementtext
     */
    setText(elementid: string, elementtext: string): void;
    /**
     * Heartland.HPS.setStyle
     *
     * Public API for setting an element's style.
     *
     * @param {string} elementid
     * @param {string} elementstyle
     */
    setStyle(elementid: string, elementstyle: string): void;
    /**
     * Heartland.HPS.appendStyle
     *
     * Public API for appending to an element's style.
     *
     * @param {string} elementid
     * @param {string} elementstyle
     */
    appendStyle(elementid: string, elementstyle: string): void;
    /**
     * Heartland.HPS.setFocus
     *
     * Public API for appending to an element's style.
     *
     * @param {string} elementid
     */
    setFocus(elementid: string): void;
    /**
     * Heartland.HPS.dispose
     *
     * Removes all iframes and event listeners from the DOM.
     */
    dispose(): void;
    removeNode(node: Window): void;
}
