import { TokenizationResponse } from "./types/TokenizationResponse";
export interface Request {
    type: string;
    url?: string;
    payload?: any;
}
export declare class CorsRequest implements Request {
    url: string;
    payload: string;
    type: string;
    constructor(url?: string, payload?: string);
}
export declare class JsonpRequest implements Request {
    url: string;
    payload: string;
    type: string;
    constructor(url?: string, payload?: string);
}
export declare class NullRequest implements Request {
    payload: {};
    type: string;
    constructor(payload?: {});
}
/**
 * @namespace Heartland.Ajax
 */
export declare class Ajax {
    /**
     * Heartland.Ajax.jsonp
     *
     * Creates a new DOM node containing a created JSONP callback handler for an
     * impending Ajax JSONP request. Removes need for `XMLHttpRequest`.
     *
     * @param {string} url
     * @param {function} callback
     */
    static jsonp(request: JsonpRequest, callback: (data: TokenizationResponse) => void): void;
    /**
     * Heartland.Ajax.cors
     *
     * Creates a new `XMLHttpRequest` object for a POST request to the given `url`.
     *
     * @param {string} url
     * @param {function} callback
     */
    static cors(request: CorsRequest, callback: (data: TokenizationResponse) => void): void;
}
