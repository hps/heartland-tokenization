/// <reference path="types/TokenizationResponse.ts" />
/// <reference path="DOM.ts" />
/// <reference path="Util.ts" />

module Heartland {
  /**
   * @namespace Heartland.Ajax
   */
  export module Ajax {
    /**
     * Heartland.Ajax.call
     *
     * Sets up a request to be passed to `Heartland.Ajax.jsonp`. On successful tokenization,
     * `options.success` will be called with the tokenization data as the only
     * argument passed.
     *
     * @param {string} type
     * @param {Heartland.Options} options
     */
    export function call(type: string, options: Options) {
      var number = options.cardNumber.replace(/^\s+|\s+$/g, '');
      var lastfour = number.slice(-4);
      var cardType = Heartland.Util.getCardType(number);
      var params = Heartland.Util.getParams(type, options);

      jsonp(options.gatewayUrl + params, function (data) {
        if (data.error) {
          Heartland.Util.throwError(options, data);
        } else {
          data.last_four = lastfour;
          data.card_type = cardType;
          data.exp_month = options.cardExpMonth;
          data.exp_year = options.cardExpYear;

          if (options.formId && options.formId.length > 0) {
            Heartland.DOM.addField(options.formId, 'hidden', 'token_value', data.token_value);
            Heartland.DOM.addField(options.formId, 'hidden', 'last_four', lastfour);
            Heartland.DOM.addField(options.formId, 'hidden', 'card_exp_year', options.cardExpYear);
            Heartland.DOM.addField(options.formId, 'hidden', 'card_exp_month', options.cardExpMonth);
            Heartland.DOM.addField(options.formId, 'hidden', 'card_type', cardType);
          }

          options.success(data);
        }
      });
    }

    /**
     * Heartland.Ajax.jsonp
     *
     * Creates a new DOM node containing a created JSONP callback handler for an
     * impending Ajax JSONP request. Removes need for `XMLHttpRequest`.
     *
     * @param {string} url
     * @param {function} callback
     */
    function jsonp(url: string, callback: (data: TokenizationResponse) => void) {
      var script = document.createElement('script');
      var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      (<any>window)[callbackName] = function(data: TokenizationResponse) : void {
        (<any>window)[callbackName] = undefined;
        document.body.removeChild(script);
        callback(data);
      };

      script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
      document.body.appendChild(script);
    }
    
    /**
     * Heartland.Ajax.makeXHR
     *
     * Creates a new XMLHttpRequest object for a POST request to the given `url`.
     *
     * @param {string} url
     * @param {function} callback
     */
    function makeXHR(url: string, payload: string, callback: (data: TokenizationResponse) => void) {
      var xhr: any;
      var method = 'POST';
      if ((new XMLHttpRequest()).withCredentials === undefined) {
        xhr = new (<any>window).XDomainRequest();
        method = 'GET';
        url = url.split('?')[0];
        url = url + '?' + payload;
        payload = null;
      } else {
        xhr = new XMLHttpRequest();
        xhr.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        );
      }
      var cb = function (e: Event) {
        if (xhr.readyState === 4) {
          var data = JSON.parse(xhr.responseText);
          callback(data);
        }
      };

      xhr.open(method, url);
      xhr.onload = cb;
      xhr.ontimeout = cb;
      xhr.onerror = cb;
      xhr.send(payload);
    }
  }
}
