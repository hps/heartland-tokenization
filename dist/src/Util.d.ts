import { CardData } from "./types/CardData";
import { Options } from "./types/Options";
import { TokenizationResponse } from "./types/TokenizationResponse";
/**
 * @namespace Heartland.Util
 */
export declare class Util {
    /**
     * Heartland.Util.getCardType
     *
     * Parses a credit card number to obtain the card type/brand.
     *
     * @param {string} tokenizationType
     * @param {Heartland.Options} options
     */
    static getCardType(tokenizationType: string, options: Options): string;
    /**
     * Heartland.Util.applyOptions
     *
     * Creates a single object by merging a `source` (default) and `properties`
     * obtained elsewhere, e.g. a function argument in `HPS`. Any properties in
     * `properties` will overwrite matching properties in `source`.
     *
     * @param {Heartland.Options} source
     * @param {Heartland.Options} properties
     * @returns {Heartland.Options}
     */
    static applyOptions(source: Options, properties: Options): Options;
    /**
     * Heartland.Util.throwError
     *
     * Allows a merchant-defined error handler to be used in cases where the
     * tokenization process fails. If not provided, we throw the message as a
     * JS runtime error.
     *
     * @param {Heartland.Options} options
     * @param {string | Heartland.TokenizationResponse} errorMessage
     */
    static throwError(options: Options, errorMessage: string | TokenizationResponse): void;
    /**
     * Heartland.Util.getItemByPropertyValue
     *
     * Enumerates over a `collection` to retreive an item whose `property` is
     * a given `value`.
     *
     * @param {any} collection
     * @param {string} property
     * @param {any} value
     * @returns {any}
     */
    static getItemByPropertyValue(collection: any, property: string, value: any): any;
    /**
     * Heartland.Util.getParams
     *
     * Builds param list for a particular `type` from expected properties in
     * `data`.
     *
     * @param {string} type - The tokenization type
     * @param {Heartland.Options} data
     * @returns {string}
     */
    static getParams(type: string, data: Options): string;
    /**
     * Heartland.Util.getUrlByEnv
     *
     * Selects the appropriate tokenization service URL for the
     * active `publicKey`.
     *
     * @param {Heartland.Options} options
     * @returns {string}
     */
    static getUrlByEnv(options: Options): Options;
    /**
     * Heartland.Util.addFormHandler
     *
     * Creates and adds an event handler function for the submission for a given
     * form (`options.form_id`).
     *
     * @param {Heartland.Options} options
     * @listens submit
     */
    static addFormHandler(options: Options): void;
    /**
     * Heartland.Util.getFields
     *
     * Extracts card information from the fields with names `card_number`,
     * `card_expiration_month`, `card_expiration_year`, and `card_cvc` and
     * expects them to be present as children of `formParent`.
     *
     * @param {string} formParent
     * @returns {Heartland.CardData}
     */
    static getFields(formParent: string): CardData;
}
