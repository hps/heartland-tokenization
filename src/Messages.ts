import {Events} from "./Events";
import {HPS} from "./HPS";

/**
 * Heartland.Messages
 *
 * Initializes a new object for wrapping `window.postMessage` and a fallback
 * method for legacy browsers.
 */
export class Messages {
  hps: HPS;
  intervalId: number;
  lastHash: string;
  pushIntervalStarted: boolean;
  private callback: (m: any) => any;

  /**
   * Heartland.Messages (constructor)
   *
   * @constructor
   * @param {Heartland.HPS} hps
   * @returns {Heartland.Messages}
   */
  constructor(hps: HPS) {
    this.hps = hps;
    this.intervalId = null;
    this.lastHash = '';
    this.pushIntervalStarted = false;
  }

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
  pushMessages(hps: HPS): () => void {
    return function () {
      const data: Array<any> = [];
      const messageArr: Array<any> = [];
      let i = 0;
      let targetUrl = '';
      let current: any;
      let targetNode: Window;
      const re = /^#?\d+&/;

      const length = hps.mailbox.length;
      if (!length) {
        return;
      }

      for (i = 0; i < length; i++) {
        current = hps.mailbox.shift();
        if (!targetUrl) {
          targetUrl = current.targetUrl;
          targetNode = current.targetNode;
        }
        messageArr.push(current.message);
      }

      current = null;
      if (re.test(window.location.hash)) {
        current = JSON.parse(decodeURIComponent(window.location.hash.replace(re, '')));
        data.concat(current);
      }

      if (messageArr !== []) {
        hps.cacheBust = hps.cacheBust || 1;
        data.push({ data: messageArr, source: { name: hps.field || 'parent' } });
        const message = JSON.stringify(data);
        const url = targetUrl.replace(/#.*$/, '') + '#' +
          (+new Date()) + (hps.cacheBust++) + '&' +
          encodeURIComponent(message);
        if (targetNode.location) {
          targetNode.location.href = url;
        } else {
          (<any>targetNode).src = url;
        }
      }

      messageArr.length = 0;
      hps.mailbox.length = 0;
    };
  }

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
  post(message: Object | string, target: string): void {
    let  targetNode: Window;

    (<any>message).source = (<any>message).source || {};
    (<any>message).source.name = window.name;

    if (!this.hps.frames) {
      return;
    }

    const frame = (<any>this.hps.frames)[target] || (<any>this.hps)[target];

    if (!frame) {
      return;
    }

    const targetUrl = (<any>this.hps.frames)[target].url;

    try {
      if (typeof frame.targetNode !== 'undefined') {
        targetNode = frame.targetNode;
      } else if (typeof frame.frame !== 'undefined') {
        targetNode = frame.frame;
      }
    } catch (e) {
      targetNode = frame;
    }

    if (window.postMessage) {
      targetNode.postMessage(
        JSON.stringify(message),
        targetUrl
      );
    } else {
      this.hps.mailbox = this.hps.mailbox || [];
      this.hps.mailbox.push({
        message: message,
        targetNode: targetNode,
        targetUrl: targetUrl
      });
      if (!this.pushIntervalStarted) {
        setInterval(this.pushMessages(this.hps), 10);
      }
    }
  }

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
  receive(callback: Function, sourceOrigin: string): void {
    if (window.postMessage) {
      this.callback = function (m) {
        try { callback(JSON.parse(m.data)); } catch (e) { /* */ }
      };
      if (window.addEventListener) {
        window.addEventListener('message', this.callback, !1);
      } else {
        (<any>window).attachEvent('onmessage', this.callback);
      }
    } else {
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      this.intervalId = null;

      if (callback) {
        this.intervalId = setInterval(function () {
          const hash = document.location.hash,
            re = /^#?\d+&/;
          if (hash !== this.lastHash && re.test(hash)) {
            const data = JSON.parse(decodeURIComponent(hash.replace(re, '')));
            this.lastHash = hash;

            for (const i in data) {
              const m = data[i];
              if (Object.prototype.toString.call(m.data) !== '[object Array]') {
                callback(m);
                continue;
              }

              for (const j in m.data) {
                callback({ data: m.data[j], source: m.source });
              }
            }
          }
        }, 100);
      }
    }
    Events.trigger('receiveMessageHandlerAdded', document);
  }

  /**
   * Heartland.Messages.removeReceiver
   *
   * Removes active `message` event handler function.
   */
  removeReceiver() {
    if (window.addEventListener) {
      window.removeEventListener('message', this.callback, !1);
    } else {
      (<any>window).detachEvent('onmessage', this.callback);
    }
  }

  /**
   * Heartland.Messages.dispose
   *
   * Removes active `message` event handler function and any
   * active intervals.
   */
  dispose(): void {
    this.removeReceiver();
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
