/// <reference path="types/CardData.ts" />
/// <reference path="DOM.ts" />
/// <reference path="HPS.ts" />

module Heartland {
  /**
   * @namespace Heartland.Events
   */
  export module Events {
    /**
     * Heartland.Events.addHandler
     *
     * Adds an `event` handler for a given `target` element.
     *
     * @param {string | EventTarget} target
     * @param {string} event
     * @param {EventListener} callback
     */
    export function addHandler(target: string | EventTarget, event: string, callback: EventListener) {
      var node: EventTarget;
      if (typeof target === 'string') {
        node = document.getElementById(<string>target);
      } else {
        node = target;
      }

      console.log('adding handler for ' + event);

      // if (node.addEventListener) {
      //   node.addEventListener(event, callback, false);
      // } else {
      //   // create a custom property  and set t to 0
      //   (<any>node)[event] = 0;
      //   // since IE8 does not allow to listen to custom events,
      //   // just listen to onpropertychange
      //   (<any>node).attachEvent("onpropertychange", function (e: Event) {
      //     // if the property changed is the custom property
      //     if ((<any>e).propertyName === event) {
      //       callback(e);
      //       // remove listener, since it's only used once
      //       // (<any>node).detachEvent("onpropertychange", arguments.callee);
      //     }
      //   });
      // }

      // if (document.addEventListener) {
      //   node.addEventListener(event, callback, false);
      // } else {
      //   console.log(target);
      //   console.log(node);
      //   (<any>node).attachEvent(event, callback);
      //   (<any>node).attachEvent('onpropertychange', function (e: Event) {
      //     if((<any>e).propertyName === event) {
      //       callback(e);
      //     }
      //   });
      // }

      if (node.addEventListener) { // W3C DOM
        node.addEventListener(event, callback, false);
      } else if ((<any>node).attachEvent) { // IE DOM
        if (!(<any>node)[event]) {
          (<any>node)[event] = 0;
        }
        (<any>node).attachEvent("onpropertychange", function (e: Event) {
          if ((<any>e).propertyName == event) {
            callback(e);
          }
        });
      }
    }
    // }

    /**
     * Heartland.Events.trigger
     *
     * Fires off an `event` for a given `target` element.
     *
     * @param {string} name
     * @param {any} target
     * @param {any} data [optional]
     */
    export function trigger(name: string, target: any, data?: any, bubble = false) {
      var event: any;
      console.log('trigget event ' + name);

      // if (document.createEvent) {
      //   event = document.createEvent('Event');
      //   event.initEvent(name, true, true);
      //   target.dispatchEvent(event);
      // } else if ((<any>document).createEventObject) {
      //   console.log(target);
      //   if ((<any>target)[name]) {
      //     (<any>target)[name]++;
      //   }
      // }
      // if (document.createEvent) {
      //   event = document.createEvent('Event');
      //   event.initEvent(name, true, true);
      // } else {
      //   event = target[name];
      //   event += 1;
      // }
      // if (document.dispatchEvent) {
      //   target.dispatchEvent(event);
      // }
      if (document.createEvent) {
        // dispatch for firefox + others
        event = document.createEvent("HTMLEvents");
        event.initEvent(name, true, true ); // event type,bubbling,cancelable
        target.dispatchEvent(event);
      } else {
        // dispatch for IE
        bubble = !bubble ? false : true;
        if (target.nodeType === 1 && target[name] >= 0) {
          target[name]++;
        }
        if (bubble && target !== document) {
          trigger(target.parentNode, name, bubble);
        }
      }
    }

    /**
     * Heartland.Events.frameHandleWith
     *
     * Wraps `hps` state in a closure to provide a `Heartland.Messages.receive`
     * callback handler for iFrame children.
     *
     * @param {Heartland.HPS} hps
     */
    export function frameHandleWith(hps: HPS) : (m: any) => void {
      return function(m) {
        switch (m.data.action) {
          case 'tokenize':
            if (m.data.accumulateData) {
              hps.Messages.post(
                {
                  action: 'accumulateData'
                },
                'parent'
                );
              var el = document.createElement('input');
              el.id = 'publicKey';
              el.type = 'hidden';
              el.value = m.data.message;
              document
                .getElementById('heartland-field-wrapper')
                .appendChild(el);
            } else {
              tokenizeIframe(hps, m.data.message);
            }
            break;
          case 'setStyle':
            Heartland.DOM.setStyle(m.data.id, m.data.style);
            Heartland.DOM.resizeFrame(hps);
            break;
          case 'appendStyle':
            Heartland.DOM.appendStyle(m.data.id, m.data.style);
            Heartland.DOM.resizeFrame(hps);
            break;
          case 'setText':
            Heartland.DOM.setText(m.data.id, m.data.text);
            Heartland.DOM.resizeFrame(hps);
            break;
          case 'setPlaceholder':
            Heartland.DOM.setPlaceholder(m.data.id, m.data.text);
            break;
          case 'setFieldData':
            Heartland.DOM.setFieldData(m.data.id, m.data.value);
            if (document.getElementById('heartland-field') &&
              document.getElementById('cardCvv') &&
              document.getElementById('cardExpiration')) {
              tokenizeIframe(hps, document.getElementById('publicKey').getAttribute('value'));
            }
            break;
          case 'getFieldData':
            Heartland.DOM.getFieldData(hps, m.data.id);
            break;
        }
      };
    }

    /**
     * tokenizeIframe
     *
     * Tokenizes card data. Used in iframe integrations to tokenize on Heartland's
     * servers.
     *
     * @param {Heartland.HPS} hps
     * @param {string} publicKey
     */
    function tokenizeIframe(hps: HPS, publicKey: string) {
      var card: CardData = {};
      var tokenResponse = (action: string) => {
        return (response: TokenizationResponse) => {
          hps.Messages.post({action: action, response: response}, 'parent');
        };
      };

      card.number = (<HTMLInputElement>(document.getElementById('heartland-field')
        || document.getElementById('heartland-card-number'))).value;
      card.cvv = (<HTMLInputElement>(document.getElementById('cardCvv')
        || document.getElementById('heartland-cvv'))).value;
      card.exp = document.getElementById('cardExpiration');

      if (card.exp) {
        var cardExpSplit = (<HTMLInputElement>card.exp).value.split('/');
        card.expMonth = cardExpSplit[0];
        card.expYear = cardExpSplit[1];
        card.exp = undefined;
      } else {
        card.expMonth = (<HTMLInputElement>document.getElementById('heartland-expiration-month')).value;
        card.expYear = (<HTMLInputElement>document.getElementById('heartland-expiration-year')).value;
      }

      hps.tokenize({
        cardCvv: card.cvv,
        cardExpMonth: card.expMonth,
        cardExpYear: card.expYear,
        cardNumber: card.number,
        error: tokenResponse('onTokenError'),
        publicKey: publicKey,
        success: tokenResponse('onTokenSuccess'),
        type: 'pan'
      });
    }
  }
}
