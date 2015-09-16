module Heartland {
  // Heartland.Messages (constructor)
  //
  // Initializes a new object for wrapping `window.postMessage` and a fallback
  // method for legacy browsers.
  export class Messages {
    hps: HPS;
    interval_id: number;
    lastHash: string;
    pushIntervalStarted: boolean;

    constructor(hps: HPS) {
      this.hps = hps;
      this.interval_id = null;
      this.lastHash = null;
      this.pushIntervalStarted = false;
    }
  
    // Heartland.Messages.pushMessages
    //
    // For legacy browsers, a mailbox (buffer) must be used to ensure all messages
    // are sent between parent and child windows. When ready, this function builds
    // the final message, encodes it, sends it, and resets the mailbox to `[]`.
    pushMessages(hps: HPS): () => void {
      return function() {
        var messageArr: Array<any> = [];
        var message = '';
        var i = 0, length = 0;
        var targetUrl: string;
        var current: any;
        var targetNode: Window;
    
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
    
        if (messageArr !== []) {
          message = JSON.stringify(messageArr);
          var location = new Location();
          location.href = targetUrl.replace(/#.*$/, '') + '#' +
            (+new Date()) + (hps.cache_bust++) + '&' +
            encodeURIComponent(message);
           targetNode.location = location;
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
    
      targetNode = frame.targetNode || frame.frame || frame;
      targetUrl = frame.url;
    
      if (window.postMessage) {
        targetNode.postMessage(
          message,
          targetUrl
          );
      } else {
        this.hps.mailbox.push({
          message: message,
          targetUrl: targetUrl,
          targetNode: targetNode
        });
        if (!this.pushIntervalStarted) {
          setInterval(this.pushMessages(this.hps), 100);
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
        if (this.interval_id) {
          clearInterval(this.interval_id);
        }
        this.interval_id = null;
    
        if (callback) {
          this.interval_id = setInterval(function() {
            var hash = document.location.hash,
              re = /^#?\d+&/;
            if (hash !== this.lastHash && re.test(hash)) {
              var m: MessageEvent = new MessageEvent();
              var i: string;
              m.data = JSON.parse(decodeURIComponent(hash.replace(re, '')));
              this.lastHash = hash;
              if (Object.prototype.toString.call(m.data) !== '[object Array]') {
                callback(m);
                return;
              }
    
              for (i in m.data) {
                callback({ data: m.data[i] });
              }
            }
          }, 100);
        }
      }
      Heartland.Events.trigger('receiveMessageHandlerAdded', document);
    }
  }
}
