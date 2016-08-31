import {DOM} from "./DOM.ts";
import {Util} from "./Util.ts";
import {Options} from "./types/Options";
import {TokenizationResponse} from "./types/TokenizationResponse";

/**
 * @namespace Heartland.Ajax
 */
export class Ajax {
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
  public static call(type: string, options: Options) {
    var cardType = Util.getCardType(type, options);
    var params = Util.getParams(type, options);

    this.jsonp(options.gatewayUrl + params, function (data) {
      if (data.error) {
        Util.throwError(options, data);
      } else {
        var card = data.card || data.encryptedcard;
        var lastfour = card.number.slice(-4);

        data.last_four = lastfour;
        data.card_type = cardType;
        data.exp_month = options.cardExpMonth;
        data.exp_year = options.cardExpYear;

        if (options.formId && options.formId.length > 0) {
          DOM.addField(options.formId, 'hidden', 'token_value', data.token_value);
          DOM.addField(options.formId, 'hidden', 'last_four', lastfour);
          DOM.addField(options.formId, 'hidden', 'card_exp_year', options.cardExpYear);
          DOM.addField(options.formId, 'hidden', 'card_exp_month', options.cardExpMonth);
          DOM.addField(options.formId, 'hidden', 'card_type', cardType);
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
  private static jsonp(url: string, callback: (data: TokenizationResponse) => void) {
    var script = document.createElement('script');
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    (<any>window)[callbackName] = function (data: TokenizationResponse): void {
      (<any>window)[callbackName] = undefined;
      document.body.removeChild(script);
      callback(data);
    };

    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
  }
}
