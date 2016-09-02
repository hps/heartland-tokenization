import {DOM} from "./DOM.ts";
import {Util} from "./Util.ts";
import {Options} from "./types/Options";
import {TokenizationResponse} from "./types/TokenizationResponse";

interface Request {
    url?: string;
    payload?: string;
}

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
    const cardType = Util.getCardType(type, options);
    const params = Util.getParams(type, options);
    const request: Request = {
        payload: params,
        url: options.gatewayUrl
    };

    Ajax.jsonp(request, function (data) {
      if (data.error) {
        Util.throwError(options, data);
      } else {
        const card = data.card || data.encryptedcard;
        const lastfour = card.number.slice(-4);

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
  private static jsonp(request: Request, callback: (data: TokenizationResponse) => void) {
    const script = document.createElement('script');
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    (<any>window)[callbackName] = function (data: TokenizationResponse): void {
      (<any>window)[callbackName] = undefined;
      document.body.removeChild(script);
      callback(data);
    };

    script.src = request.url + (request.url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName
        + '&' + request.payload;
    document.body.appendChild(script);
  }

  /**
   * Heartland.Ajax.cors
   *
   * Creates a new XMLHttpRequest object for a POST request to the given `url`.
   *
   * @param {string} url
   * @param {function} callback
   */
  private static cors(request: Request, payload: string, callback: (data: TokenizationResponse) => void) {
    let xhr: any;
    let method = 'POST';
    let timeout: number;

    if ((new XMLHttpRequest()).withCredentials === undefined) {
      xhr = new (<any>window).XDomainRequest();
      method = 'GET';
      request.url = request.url.split('?')[0];
      request.url = request.url + '?' + request.payload;
      payload = null;
      xhr.open(method, request.url);
    } else {
      xhr = new XMLHttpRequest();
      xhr.open(method, request.url);
      xhr.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded'
      );
    }
    const cb = function (e: Event) {
      clearTimeout(timeout);

      if (e.type === 'error') {
        callback({error: {message: 'communication error'}});
        return;
      }

      if (xhr.readyState === 4 || (xhr.readyState !== 4 && xhr.responseText !== '')) {
        const data = JSON.parse(xhr.responseText);
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
