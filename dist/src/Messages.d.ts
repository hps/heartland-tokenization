/// <reference types="node" />
import { HPS } from "./HPS";
/**
 * Heartland.Messages
 *
 * Initializes a new object for wrapping `window.postMessage` and a fallback
 * method for legacy browsers.
 */
export declare class Messages {
    hps: HPS;
    intervalId: NodeJS.Timer;
    lastHash: string;
    pushIntervalStarted: boolean;
    private callback;
    /**
     * Heartland.Messages (constructor)
     *
     * @constructor
     * @param {Heartland.HPS} hps
     * @returns {Heartland.Messages}
     */
    constructor(hps: HPS);
    /**
     * Heartland.Messages.pushMessages
     *
     * For legacy browsers, a mailbox (buffer) must be used to ensure all messages
     * are sent between parent and child windows. When ready, this function builds
     * the final message, encodes it, sends it, and resets the mailbox to `[]`.
     *
     * @param {Heartland.HPS} hps
     * @returns {function}
     */
    pushMessages(hps: HPS): () => void;
    /**
     * Heartland.Messages.post
     *
     * When present, wraps the built-in `window.postMessage`. When not present,
     * pushes the message onto the mailbox for eventual sending, and on first use,
     * starts the interval for `Messages.pushMessages`.
     *
     * @param {Object | string} message
     * @param {string} target
     */
    post(message: Object | string, target: string): void;
    /**
     * Heartland.Messages.receive
     *
     * When present, wraps the built-in `window.postMesage`'s `message` or
     * `onmessage` window events. When not present, uses a single interval to
     * check for changes to `window.location.hash` when the other window sends a
     * message and will decode the JSON and URI encoded hash.
     *
     * @param {Function} callback
     * @param {string} sourceOrigin
     */
    receive(callback: Function, sourceOrigin: string): void;
    /**
     * Heartland.Messages.removeReceiver
     *
     * Removes active `message` event handler function.
     */
    removeReceiver(): void;
    /**
     * Heartland.Messages.dispose
     *
     * Removes active `message` event handler function and any
     * active intervals.
     */
    dispose(): void;
}
