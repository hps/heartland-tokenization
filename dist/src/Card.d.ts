import { CardType } from "./types/CardType";
/**
 * @namespace Heartland.Card
 */
export declare class Card {
    /**
     * Heartland.Card.typeByNumber
     *
     * Helper function to grab the CardType for a given card number.
     *
     * @param {string} number - The card number
     * @returns {Heartland.CardType}
     */
    static typeByNumber(number: string): CardType;
    /**
     * Heartland.Card.typeByTrack
     *
     * @param {string} data - track data
     * @param {boolean} isEncrypted - (default: false)
     * @param {string} trackNumber
     *
     * @returns CardType
     */
    static typeByTrack(data: string, isEncrypted?: boolean, trackNumber?: string): CardType;
    /**
     * Heartland.Card.luhnCheck
     *
     * Runs a mod 10 check on a given card number.
     *
     * @param {string} number - The card number
     * @returns {boolean}
     */
    static luhnCheck(number: string): boolean;
    /**
     * Heartland.Card.addType
     *
     * Adds a class to the target element with the card type
     * inferred from the target's current value.
     *
     * @param {Event} e
     */
    static addType(e: Event): void;
    /**
     * Heartland.Card.formatNumber
     *
     * Formats a target element's value based on the
     * inferred card type's formatting regex.
     *
     * @param {Event} e
     */
    static formatNumber(e: Event): void;
    /**
     * Heartland.Card.formatExpiration
     *
     * Formats a target element's value.
     *
     * @param {KeyboardEvent} e
     */
    static formatExpiration(e: KeyboardEvent): void;
    /**
     * Heartland.Card.restrictLength
     *
     * Restricts input in a target element to a
     * certain length data.
     *
     * @param {number} length
     *
     * @returns {(e: KeyboardEvent) => ()}
     */
    static restrictLength(length: number): (e: KeyboardEvent) => void;
    /**
     * Heartland.Card.restrictNumeric
     *
     * Restricts input in a target element to only
     * numeric data.
     *
     * @param {KeyboardEvent} e
     */
    static restrictNumeric(e: KeyboardEvent): void;
    /**
     * Heartland.Card.deleteProperly
     *
     * Places cursor on the correct position to
     * let the browser delete the digit instead
     * of the space.
     *
     * @param {KeyboardEvent} e
     */
    static deleteProperly(e: KeyboardEvent): void;
    /**
     * Heartland.Card.validateNumber
     *
     * Validates a target element's value based on the
     * inferred card type's validation regex. Adds a
     * class to the target element to note `valid` or
     * `invalid`.
     *
     * @param {Event} e
     */
    static validateNumber(e: Event): void;
    /**
     * Heartland.Card.validateCvv
     *
     * Validates a target element's value based on the
     * possible CVV lengths. Adds a class to the target
     * element to note `valid` or `invalid`.
     *
     * @param {Event} e
     */
    static validateCvv(e: Event): void;
    /**
     * Heartland.Card.validateExpiration
     *
     * Validates a target element's value based on the
     * current date. Adds a class to the target element
     * to note `valid` or `invalid`.
     *
     * @param {Event} e
     */
    static validateExpiration(e: Event): void;
    /**
     * Heartland.Card.attachNumberEvents
     *
     * @param {string} selector
     */
    static attachNumberEvents(selector: string): void;
    /**
     * Heartland.Card.attachExpirationEvents
     *
     * @param {string} selector
     */
    static attachExpirationEvents(selector: string): void;
    /**
     * Heartland.Card.attachCvvEvents
     *
     * @param {string} selector
     */
    static attachCvvEvents(selector: string): void;
}
