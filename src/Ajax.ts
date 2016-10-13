import {TokenizationResponse} from "./types/TokenizationResponse";

export interface Request {
    type: string;
    url?: string;
    payload?: any;
}

export class CorsRequest implements Request {
    public type = "cors";
    constructor(public url = "", public payload = "") {}
}

export class JsonpRequest implements Request {
    public type = "jsonp";
    constructor(public url = "", public payload = "") {}
}

export class NullRequest implements Request {
    public type = "null";
    constructor(public payload = {}) {}
}

/**
 * @namespace Heartland.Ajax
 */
export class Ajax {
  /**
   * Heartland.Ajax.jsonp
   *
   * Creates a new DOM node containing a created JSONP callback handler for an
   * impending Ajax JSONP request. Removes need for `XMLHttpRequest`.
   *
   * @param {string} url
   * @param {function} callback
   */
  public static jsonp(request: JsonpRequest, callback: (data: TokenizationResponse) => void) {
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
   * Creates a new `XMLHttpRequest` object for a POST request to the given `url`.
   *
   * @param {string} url
   * @param {function} callback
   */
  public static cors(request: CorsRequest, callback: (data: TokenizationResponse) => void) {
    let xhr: any;
    let method = 'POST';
    let timeout: number;

    if ((new XMLHttpRequest()).withCredentials === undefined) {
      xhr = new (<any>window).XDomainRequest();
      method = 'GET';
      request.url = request.url.split('?')[0];
      request.url = request.url + '?' + request.payload;
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
    xhr.send(request.payload);
    timeout = setTimeout(function () {
      xhr.abort();
      callback({error: {message: 'timeout'}});
    }, 5000);
  }
}
