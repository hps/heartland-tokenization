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
        node = document.getElementById(<string> target);
      } else {
        node = target;
      }

      if (node.addEventListener) {
        node.addEventListener(event, callback, false);
      } else if ((<any>node).attachEvent) {
        if (event === 'submit') {
          event = 'on' + event;
        }

        (<any>node).attachEvent(event, callback);
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
    export function trigger(name: string, target: any, data?: any) {
      var event = target.createEvent('Event');
      event.initEvent(name, true, true);
      target.dispatchEvent(event);
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
          case 'tokenize': {
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
          }
          case 'setStyle': {
            Heartland.DOM.setStyle(m.data.id, m.data.style);
            Heartland.DOM.resizeFrame(hps);
            break;
          }
          case 'appendStyle': {
            Heartland.DOM.appendStyle(m.data.id, m.data.style);
            Heartland.DOM.resizeFrame(hps);
            break;
          }
          case 'setText': {
            Heartland.DOM.setText(m.data.id, m.data.text);
            Heartland.DOM.resizeFrame(hps);
            break;
          }
          case 'setPlaceholder': {
            Heartland.DOM.setPlaceholder(m.data.id, m.data.text);
            break;
          }
          case 'setFieldData': {
            Heartland.DOM.setFieldData(m.data.id, m.data.value);
            if (document.getElementById('heartland-field') &&
              document.getElementById('cardCvv') &&
              document.getElementById('cardExpiration')) {
              tokenizeIframe(hps, document.getElementById('publicKey').getAttribute('value'));
            }
            break;
          }
          case 'getFieldData': {
            Heartland.DOM.getFieldData(hps, m.data.id);
            break;
          }
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

      card.number = (<HTMLInputElement>(document.getElementById('heartland-field') || document.getElementById('heartland-card-number'))).value;
      card.cvv = (<HTMLInputElement>(document.getElementById('cardCvv') || document.getElementById('heartland-cvv'))).value;
      card.exp = document.getElementById('cardExpiration');

      if (card.exp) {
        var cardExpSplit = (<HTMLInputElement>card.exp).value.split('/');
        card.expMonth = cardExpSplit[0];
        card.expYear = cardExpSplit[1];
        delete card.exp;
      } else {
        card.expMonth = (<HTMLInputElement>document.getElementById('heartland-expiration-month')).value;
        card.expYear = (<HTMLInputElement>document.getElementById('heartland-expiration-year')).value;
      }

      hps.tokenize({
        publicKey: publicKey,
        cardNumber: card.number,
        cardCvv: card.cvv,
        cardExpMonth: card.expMonth,
        cardExpYear: card.expYear,
        type: 'pan',
        success: function (response: TokenizationResponse) {
          hps.Messages.post({action: 'onTokenSuccess', response: response}, 'parent');
        },
        error: function (response: TokenizationResponse) {
          hps.Messages.post({action: 'onTokenError', response: response}, 'parent');
        }
      });
    }
  }
}
