/// <reference path="Events.ts" />
/// <reference path="HPS.ts" />

module Heartland {
  // Heartland.Messages (constructor)
  //
  // Initializes a new object for wrapping `window.postMessage` and a fallback
  // method for legacy browsers.
  export class Messages {
    hps: HPS;
    intervalId: number;
    lastHash: string;
    pushIntervalStarted: boolean;

    constructor(hps: HPS) {
      this.hps = hps;
      this.intervalId = null;
      this.lastHash = '';
      this.pushIntervalStarted = false;
    }

    // Heartland.Messages.pushMessages
    //
    // For legacy browsers, a mailbox (buffer) must be used to ensure all messages
    // are sent between parent and child windows. When ready, this function builds
    // the final message, encodes it, sends it, and resets the mailbox to `[]`.
    pushMessages(hps: HPS): () => void {
      return function() {
        var data: Array<any> = []
        var messageArr: Array<any> = [];
        var message = '';
        var i = 0, length = 0;
        var targetUrl = '', url = '';
        var current: any;
        var targetNode: Window;
        var re = /^#?\d+&/;

        length = hps.mailbox.length;
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
        console.log(window.location.hash)
        if (re.test(window.location.hash)) {
          current = JSON.parse(decodeURIComponent(window.location.hash.replace(re, '')));
          data.concat(current);
        }
        console.log(data);

        if (messageArr !== []) {
          hps.cacheBust = hps.cacheBust || 1
          data.push({source: {name: hps.field || 'parent'}, data: messageArr});
          console.log(data);
          message = JSON.stringify(data);
          url = targetUrl.replace(/#.*$/, '') + '#' +
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

    // Heartland.Messages.post
    //
    // When present, wraps the built-in `window.postMessage`. When not present,
    // pushes the message onto the mailbox for eventual sending, and on first use,
    // starts the interval for `Messages.pushMessages`.
    post(message: Object | string, target: string): void {
      var frame: any;
      var targetNode: Window;
      var targetUrl: string;

      if (!this.hps.frames) {
        return;
      }

      frame = (<any>this.hps)[target] || this.hps.frames[target];

      if (!frame) {
        return;
      }

      targetUrl = this.hps.frames[target].url;

      if (typeof frame.targetNode !== 'undefined') {
        targetNode = frame.targetNode;
      } else if (typeof frame.frame !== 'undefined') {
        targetNode = frame.frame
      } else {
        targetNode = frame;
      }

      if (window.postMessage) {
        targetNode.postMessage(
          message,
          targetUrl
          );
      } else {
        this.hps.mailbox = this.hps.mailbox || [];
        this.hps.mailbox.push({
          message: message,
          targetUrl: targetUrl,
          targetNode: targetNode
        });
        if (!this.pushIntervalStarted) {
          setInterval(this.pushMessages(this.hps), 10);
        }
      }
    }

    // Heartland.Messages.receive
    //
    // When present, wraps the built-in `window.postMesage`'s `message` or
    // `onmessage` window events. When not present, uses a single interval to
    // check for changes to `window.location.hash` when the other window sends a
    // message and will decode the JSON and URI encoded hash.
    receive(callback: Function, sourceOrigin: string): void {
      if (window.postMessage) {
        if (window.addEventListener) {
          (<any>window)[callback ? 'addEventListener' : 'removeEventListener']('message', callback, !1);
        } else {
          (<any>window)[callback ? 'attachEvent' : 'detachEvent']('onmessage', callback);
        }
      } else {
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
        this.intervalId = null;

        if (callback) {
          this.intervalId = setInterval(function() {
            var hash = document.location.hash,
              re = /^#?\d+&/;
            if (hash !== this.lastHash && re.test(hash)) {
              var data = JSON.parse(decodeURIComponent(hash.replace(re, '')));;
              var i: any, j: any;
              var m: any;
              this.lastHash = hash;

              for (i in data) {
                m = data[i];
                if (Object.prototype.toString.call(m.data) !== '[object Array]') {
                  callback(m);
                  continue;
                }

                for (j in m.data) {
                  callback({ source: m.source, data: m.data[j] });
                }
              }
            }
          }, 100);
        }
      }
      Heartland.Events.trigger('receiveMessageHandlerAdded', document);
    }
  }
}
