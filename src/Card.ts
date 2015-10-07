/// <reference path="types/CardType.ts" />
/// <reference path="vars/cardTypes.ts" />
/// <reference path="Formatter/CardNumber.ts" />
/// <reference path="Formatter/Expiration.ts" />
/// <reference path="Validator/CardNumber.ts" />
/// <reference path="Validator/Cvv.ts" />
/// <reference path="Validator/Expiration.ts" />

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

      if (!number) { return null; }

      for (i in Card.types) {
        cardType = Card.types[i];
        if (cardType.regex.test(number)) {
          break;
        }
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
      var digits: string[];
      var i = 0;
      var length = 0;
      var digit: number;

      if (!number) {
        return false;
      }

      digits = number.split('').reverse();
      length = digits.length;

      for (i; i < length; i++) {
        digit = parseInt(digits[i], 10);
        if (odd = !odd) {
          digit *= 2;
        }
        if (digit > 9) {
          digit -= 9;
        }
        sum += digit;
      }

      return sum % 10 === 0;
    }

    export function addType(e: Event) {
      var target = <HTMLInputElement>e.currentTarget;
      var type = typeByNumber(target.value);
      var length = target.classList.length;
      var i = 0;
      var c = '';

      for (i; i < length; i++) {
        c = target.classList.item(i);
        if (c && c.indexOf('card-type-') === 0) {
          target.classList.remove(c);
        }
      }

      if (type) {
        target.classList.add('card-type-' + type.code);
      }
    }

    export function formatNumber(e: Event) {
      var target = <HTMLInputElement>e.currentTarget;
      var value = target.value;
      value = (new Formatter.CardNumber).format(value);
      target.value = value;
    }

    export function formatExpiration(e: Event) {
      var target = <HTMLInputElement>e.currentTarget;
      var value = target.value;
      value = (new Formatter.Expiration).format(value);
      target.value = value;
    }

    export function restrictNumeric(e: KeyboardEvent) {
      // allow: backspace, delete, tab, escape and enter
      if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
          // allow: Ctrl+A
          (e.keyCode === 65 && e.ctrlKey === true) ||
          // allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }
      // ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
      }
    }

    export function validateNumber(e: Event) {
      var target = <HTMLInputElement>e.currentTarget;
      var value = target.value;
      if ((new Validator.CardNumber).validate(value)) {
        target.classList.remove('invalid');
        target.classList.add('valid');
      } else {
        target.classList.add('invalid');
        target.classList.remove('valid');
      }
    }

    export function validateCvv(e: Event) {
      var target = <HTMLInputElement>e.currentTarget;
      var value = target.value;
      if ((new Validator.Cvv).validate(value)) {
        target.classList.remove('invalid');
        target.classList.add('valid');
      } else {
        target.classList.add('invalid');
        target.classList.remove('valid');
      }
    }

    export function validateExpiration(e: Event) {
      var target = <HTMLInputElement>e.currentTarget;
      var value = target.value;
      if ((new Validator.Expiration).validate(value)) {
        target.classList.remove('invalid');
        target.classList.add('valid');
      } else {
        target.classList.add('invalid');
        target.classList.remove('valid');
      }
    }
  }
}
