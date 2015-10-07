/// <reference path="types/CardData.ts" />
/// <reference path="DOM.ts" />
/// <reference path="HPS.ts" />

module Heartland {
  /**
   * @namespace Heartland.Events
   */
  export module Events {
    class Ev {
      static listen(eventName: string, callback: EventListener) {
        if (document.addEventListener) {
          document.addEventListener(eventName, callback, false);
        } else {
          (<any>document.documentElement).attachEvent('onpropertychange', function (e: Event) {
            if ((<any>e).propertyName === eventName) {
              callback(e);
            }
          });
        }
      }
      static trigger(eventName: string) {
        if (document.createEvent) {
          var event = document.createEvent('Event');
          event.initEvent(eventName, true, true);
          document.dispatchEvent(event);
        } else {
          (<any>document.documentElement)[eventName]++;
        }
      }
    }
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

      if (document.addEventListener) {
        node.addEventListener(event, callback, false);
      } else {
        Ev.listen(event, callback);
      }
    }

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

      if (document.createEvent) {
        event = document.createEvent('Event');
        event.initEvent(name, true, true);
        target.dispatchEvent(event);
      } else {
        Ev.trigger(name);
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
        var data = JSON.parse(m.data);
        switch (data.action) {
          case 'tokenize':
            console.log('should tokenize card');
            if (data.accumulateData) {
              hps.Messages.post(
                {
                  action: 'accumulateData'
                },
                'parent'
                );
              var el = document.createElement('input');
              el.id = 'publicKey';
              el.type = 'hidden';
              el.value = data.message;
              document
                .getElementById('heartland-field-wrapper')
                .appendChild(el);
            } else {
              tokenizeIframe(hps, data.message);
            }
            break;
          case 'setStyle':
            Heartland.DOM.setStyle(data.id, data.style);
            Heartland.DOM.resizeFrame(hps);
            break;
          case 'appendStyle':
            Heartland.DOM.appendStyle(data.id, data.style);
            Heartland.DOM.resizeFrame(hps);
            break;
          case 'setText':
            Heartland.DOM.setText(data.id, data.text);
            Heartland.DOM.resizeFrame(hps);
            break;
          case 'setPlaceholder':
            Heartland.DOM.setPlaceholder(data.id, data.text);
            break;
          case 'setFieldData':
            Heartland.DOM.setFieldData(data.id, data.value);
            if (document.getElementById('heartland-field') &&
              document.getElementById('cardCvv') &&
              document.getElementById('cardExpiration')) {
              tokenizeIframe(hps, document.getElementById('publicKey').getAttribute('value'));
            }
            break;
          case 'getFieldData':
            Heartland.DOM.getFieldData(hps, data.id);
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

