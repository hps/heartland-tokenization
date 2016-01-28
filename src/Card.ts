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
     * Runs a mod 10 check on a given card number.
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

    /**
     * Heartland.Card.addType
     *
     * Adds a class to the target element with the card type
     * inferred from the target's current value.
     *
     * @param {Event} e
     */
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

    /**
     * Heartland.Card.formatNumber
     *
     * Formats a target element's value based on the
     * inferred card type's formatting regex.
     *
     * @param {Event} e
     */
    export function formatNumber(e: Event) {
      var target = <HTMLInputElement>e.currentTarget;
      var value = target.value;
      value = (new Formatter.CardNumber).format(value);
      target.value = value;
    }

    /**
     * Heartland.Card.formatExpiration
     *
     * Formats a target element's value.
     *
     * @param {KeyboardEvent} e
     */
    export function formatExpiration(e: KeyboardEvent) {
      var target = <HTMLInputElement>e.currentTarget;
      var value = target.value;
      // allow: delete, backspace
      if ([46, 8].indexOf(e.keyCode) !== -1 ||
          // allow: home, end, left, right
          (e.keyCode >= 35 && e.keyCode <= 39)) {
        return;
      }
      value = (new Formatter.Expiration).format(value, e.type === 'blur');
      target.value = value;
    }

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
    export function restrictLength(length: number) {
      return function (e: KeyboardEvent) {
        var target = <HTMLInputElement>e.currentTarget;
        var value = target.value;
        // allow: backspace, delete, tab, escape and enter
        if ([46, 8, 9, 27, 13, 110].indexOf(e.keyCode) !== -1 ||
            // allow: Ctrl+A
            (e.keyCode === 65 && e.ctrlKey === true) ||
            // allow: home, end, left, right
            (e.keyCode >= 35 && e.keyCode <= 39)) {
          // let it happen, don't do anything
          return;
        }
        if (value.length >= length) {
          e.preventDefault();
        }
      };
    }

    /**
     * Heartland.Card.restrictNumeric
     *
     * Restricts input in a target element to only
     * numeric data.
     *
     * @param {KeyboardEvent} e
     */
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

    /**
     * Heartland.Card.validateCvv
     *
     * Validates a target element's value based on the
     * possible CVV lengths. Adds a class to the target
     * element to note `valid` or `invalid`.
     *
     * @param {Event} e
     */
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

    /**
     * Heartland.Card.validateExpiration
     *
     * Validates a target element's value based on the
     * current date. Adds a class to the target element
     * to note `valid` or `invalid`.
     *
     * @param {Event} e
     */
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

    /**
     * Heartland.Card.attachNumberEvents
     *
     * @param {string} selector
     */
    export function attachNumberEvents(selector: string) {
      Heartland.Events.addHandler(document.querySelector(selector), 'keydown', restrictNumeric);
      Heartland.Events.addHandler(document.querySelector(selector), 'keydown', restrictLength(19));
      Heartland.Events.addHandler(document.querySelector(selector), 'input', formatNumber);
      Heartland.Events.addHandler(document.querySelector(selector), 'input', validateNumber);
      Heartland.Events.addHandler(document.querySelector(selector), 'input', addType);
    }

    /**
     * Heartland.Card.attachExpirationEvents
     *
     * @param {string} selector
     */
    export function attachExpirationEvents(selector: string) {
      Heartland.Events.addHandler(document.querySelector(selector), 'keydown', restrictNumeric);
      Heartland.Events.addHandler(document.querySelector(selector), 'keydown', restrictLength(9));
      Heartland.Events.addHandler(document.querySelector(selector), 'keyup', formatExpiration);
      Heartland.Events.addHandler(document.querySelector(selector), 'blur', formatExpiration);
      Heartland.Events.addHandler(document.querySelector(selector), 'input', validateExpiration);
    }

    /**
     * Heartland.Card.attachCvvEvents
     *
     * @param {string} selector
     */
    export function attachCvvEvents(selector: string) {
      Heartland.Events.addHandler(document.querySelector(selector), 'keydown', restrictNumeric);
      Heartland.Events.addHandler(document.querySelector(selector), 'keydown', restrictLength(4));
      Heartland.Events.addHandler(document.querySelector(selector), 'input', validateCvv);
    }
  }
}
