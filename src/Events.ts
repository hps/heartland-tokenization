/// <reference path="types/Card.ts" />
/// <reference path="DOM.ts" />
/// <reference path="SecureSubmit.ts" />

module Heartland {
  export module Events {
    // Heartland.Events.addHandler
    //
    // Adds an `event` handler for a given `target` element.
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
    
    // Heartland.Events.trigger
    //
    // Fires off an `event` for a given `target` element.
    export function trigger(name: string, target: any, data?: any) {
      var event = target.createEvent('Event');
      event.initEvent(name, true, true);
      target.dispatchEvent(event);
    }
    
    // hearltand.Events.frameHandleWith
    //
    // Wraps `hps` state in a closure to provide a `Heartland.Messages.receive`
    // callback handler for iFrame children.
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
    
    // tokenizeIframe
    //
    // Tokenizes card data. Used in iframe integrations to tokenize on Heartland's
    // servers.
    function tokenizeIframe(hps: HPS, publicKey: string) {
      var card: Card = {};
    
      card.number = (document.getElementById('heartland-field') || document.getElementById('heartland-card-number')).getAttribute('value');
      card.cvv = (document.getElementById('cardCvv') || document.getElementById('heartland-cvv')).getAttribute('value');
      card.exp = document.getElementById('cardExpiration');
    
      if (card.exp) {
        var cardExpSplit = card.exp.getAttribute('value').split('/');
        card.expMonth = cardExpSplit[0];
        card.expYear = cardExpSplit[1];
        delete card.exp;
      } else {
        card.expMonth = document.getElementById('heartland-expiration-month').getAttribute('value');
        card.expYear = document.getElementById('heartland-expiration-year').getAttribute('value');
      }
    
      hps.tokenize({
        publicKey: publicKey,
        card_number: card.number,
        card_cvc: card.cvv,
        card_exp_month: card.expMonth,
        card_exp_year: card.expYear,
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
