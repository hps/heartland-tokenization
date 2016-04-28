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

      makeXHR(options.gatewayUrl + '?api_key=' + options.publicKey, params, function (data) {
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
      var timeout: number;

      if ((new XMLHttpRequest()).withCredentials === undefined) {
        xhr = new (<any>window).XDomainRequest();
        method = 'GET';
        url = url.split('?')[0];
        url = url + '?' + payload;
        payload = null;
        xhr.open(method, url);
      } else {
        xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.setRequestHeader(
          'Content-Type',
          'application/x-www-form-urlencoded'
        );
      }
      var cb = function (e: Event) {
        clearTimeout(timeout);

        if (e.type === 'error') {
          callback({error: {message: 'communication error'}});
          return;
        }

        if (xhr.readyState === 4 || (xhr.readyState !== 4 && xhr.responseText !== '')) {
          var data = JSON.parse(xhr.responseText);
          callback(data);
        } else {
          callback({error: {message: 'no data'}});
        }
      };

      xhr.onload = cb;
      xhr.onerror = cb;
      xhr.send(payload);
      timeout = setTimeout(function () {
        xhr.abort();
        callback({error: {message: 'timeout'}});
      }, 5000);
    }
  }
}
