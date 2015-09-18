/// <reference path="types/CardType.ts" />
/// <reference path="vars/cardTypes.ts" />

module Heartland {
  /**
   * @namespace Heartland.Card
   */
  export module Card {
    /**
     * Heartland.Card.typeByNumber
     *
     * Helper function to grab the CardType for a given card number.
     *
     * @param {string} number - The card number
     * @returns {Heartland.CardType}
     */
    export function typeByNumber(number: string): CardType {
      var cardType: CardType;
      var i: any;

      for (i in Card.types) {
        cardType = Card.types[i];
        if (cardType.regex.test(number)) break;
      }

      return cardType;
    }

    /**
     * Heartland.Card.luhnCheck
     *
     * @param {string} number - The card number
     * @returns {boolean}
     */
    export function luhnCheck(number: string): boolean {
      var odd = true;
      var sum = 0;
      var digits = number.split('').reverse();
      var i: number;
      var length = digits.length;
      var digit: number;

      for (i; i < length; i++) {
        digit = parseInt(digits[i], 10)
        if (odd = !odd) {
          digit *= 2
        }
        if (digit > 9) {
          digit -= 9
        }
        sum += digit
      }

      return sum % 10 === 0;
    }
  }
}
