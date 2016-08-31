import {CardType} from "./types/CardType";
import {cardTypes} from "./vars/cardTypes";
import {CardNumber as CardNumberFormatter} from "./Formatter/CardNumber";
import {Expiration as ExpirationFormatter} from "./Formatter/Expiration";
import {CardNumber as CardNumberValidator} from "./Validator/CardNumber";
import {Cvv as CvvValidator} from "./Validator/Cvv";
import {Expiration as ExpirationValidator} from "./Validator/Expiration";

import {Events} from "./Events";

/**
 * @namespace Heartland.Card
 */
export class Card {
  /**
   * Heartland.Card.typeByNumber
   *
   * Helper function to grab the CardType for a given card number.
   *
   * @param {string} number - The card number
   * @returns {Heartland.CardType}
   */
  public static typeByNumber(number: string): CardType {
    var cardType: CardType;
    var i: any;

    if (!number) { return null; }
    if (number.replace(/^\s+|\s+$/gm, '').length < 4) { return null; }

    for (i in cardTypes) {
      cardType = cardTypes[i];
      if (cardType && cardType.regex && cardType.regex.test(number)) {
        break;
      }
    }

    return cardType;
  }

  /**
   * Heartland.Card.typeByTrack
   *
   * @param {string} data - track data
   * @param {boolean} isEncrypted - (default: false)
   * @param {string} trackNumber
   *
   * @returns CardType
   */
  public static typeByTrack(data: string, isEncrypted = false, trackNumber?: string) {
    var number: string;

    if (isEncrypted && trackNumber && trackNumber === '02') {
      number = data.split('=')[0];
    } else {
      var temp = data.split('%');
      if (temp[1]) {
        temp = temp[1].split('^');
        if (temp[0]) {
          number = temp[0].toString().substr(1);
        }
      }
    }

    return this.typeByNumber(number);
  }

  /**
   * Heartland.Card.luhnCheck
   *
   * Runs a mod 10 check on a given card number.
   *
   * @param {string} number - The card number
   * @returns {boolean}
   */
  public static luhnCheck(number: string): boolean {
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
  public static addType(e: Event) {
    var target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    var type = this.typeByNumber(target.value);
    var classList = target.className.split(' ');
    var length = classList.length;
    var i = 0;
    var c = '';

    for (i; i < length; i++) {
      c = classList[i];
      if (c && c.indexOf('card-type-') !== -1) {
        delete classList[i];
      }
    }

    if (type) {
      classList.push('card-type-' + type.code);
    }

    target.className = classList.join(' ').replace(/^\s+|\s+$/gm, '');
  }

  /**
   * Heartland.Card.formatNumber
   *
   * Formats a target element's value based on the
   * inferred card type's formatting regex.
   *
   * @param {Event} e
   */
  public static formatNumber(e: Event) {
    var target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    var value = target.value;

    if (value.length === 0) { return; }

    var formatted = (new CardNumberFormatter).format(value);
    target.value = formatted;

    if (!target.setSelectionRange) { return; }

    var cursor = target.selectionStart;

    // copy and paste, space inserted on formatter
    if (value.length < formatted.length) {
      cursor += formatted.length - value.length;
    }

    // check if before new inserted digit is a space
    if (value.charAt(cursor) === ' ' &&
      formatted.charAt(cursor - 1) === ' ') {
      cursor += 1;
    }

    target.setSelectionRange(cursor, cursor);
  }

  /**
   * Heartland.Card.formatExpiration
   *
   * Formats a target element's value.
   *
   * @param {KeyboardEvent} e
   */
  public static formatExpiration(e: KeyboardEvent) {
    var target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    var value = target.value;
    // allow: delete, backspace
    if ([46, 8].indexOf(e.keyCode) !== -1 ||
      // allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    value = (new ExpirationFormatter).format(value, e.type === 'blur');
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
  public static restrictLength(length: number) {
    return function (e: KeyboardEvent) {
      var target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
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
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
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
  public static restrictNumeric(e: KeyboardEvent) {
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
      e.preventDefault ? e.preventDefault() : (e.returnValue = false);
    }
  }

  /**
   * Heartland.Card.deleteProperly
   *
   * Places cursor on the correct position to
   * let the browser delete the digit instead
   * of the space.
   *
   * @param {KeyboardEvent} e
   */
  public static deleteProperly(e: KeyboardEvent) {
    var target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    var value = target.value;

    if (!target.setSelectionRange) { return; }

    var cursor = target.selectionStart;

    // allow: delete, backspace
    if ([46, 8].indexOf(e.keyCode) !== -1 &&
      // if space to be deleted
      (value.charAt(cursor - 1) === ' ')) {
      // placing cursor before space to delete digit instead
      target.setSelectionRange(cursor - 1, cursor - 1);
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
  public static validateNumber(e: Event) {
    var target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    var value = target.value;
    var classList = target.className.split(' ');
    var length = classList.length;
    var c = '';

    for (var i = 0; i < length; i++) {
      c = classList[i];
      if (c.indexOf('valid') !== -1) {
        delete classList[i];
      }
    }

    if ((new CardNumberValidator).validate(value)) {
      classList.push('valid');
    } else {
      classList.push('invalid');
    }

    target.className = classList.join(' ').replace(/^\s+|\s+$/gm, '');
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
  public static validateCvv(e: Event) {
    var target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    var value = target.value;
    var classList = target.className.split(' ');
    var length = classList.length;
    var c = '';

    for (var i = 0; i < length; i++) {
      c = classList[i];
      if (c.indexOf('valid') !== -1) {
        delete classList[i];
      }
    }

    if ((new CvvValidator).validate(value)) {
      classList.push('valid');
    } else {
      classList.push('invalid');
    }

    target.className = classList.join(' ').replace(/^\s+|\s+$/gm, '');
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
  public static validateExpiration(e: Event) {
    var target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    var value = target.value;
    var classList = target.className.split(' ');
    var length = classList.length;
    var c = '';

    for (var i = 0; i < length; i++) {
      c = classList[i];
      if (c.indexOf('valid') !== -1) {
        delete classList[i];
      }
    }

    if ((new ExpirationValidator).validate(value)) {
      classList.push('valid');
    } else {
      classList.push('invalid');
    }

    target.className = classList.join(' ').replace(/^\s+|\s+$/gm, '');
  }

  /**
   * Heartland.Card.attachNumberEvents
   *
   * @param {string} selector
   */
  public static attachNumberEvents(selector: string) {
    Events.addHandler(document.querySelector(selector), 'keydown', this.restrictNumeric);
    Events.addHandler(document.querySelector(selector), 'keydown', this.restrictLength(19));
    Events.addHandler(document.querySelector(selector), 'keydown', this.deleteProperly);
    Events.addHandler(document.querySelector(selector), 'input', this.formatNumber);
    Events.addHandler(document.querySelector(selector), 'input', this.validateNumber);
    Events.addHandler(document.querySelector(selector), 'input', this.addType);
  }

  /**
   * Heartland.Card.attachExpirationEvents
   *
   * @param {string} selector
   */
  public static attachExpirationEvents(selector: string) {
    Events.addHandler(document.querySelector(selector), 'keydown', this.restrictNumeric);
    Events.addHandler(document.querySelector(selector), 'keydown', this.restrictLength(9));
    Events.addHandler(document.querySelector(selector), 'keyup', this.formatExpiration);
    Events.addHandler(document.querySelector(selector), 'blur', this.formatExpiration);
    Events.addHandler(document.querySelector(selector), 'input', this.validateExpiration);
    Events.addHandler(document.querySelector(selector), 'blur', this.validateExpiration);
  }

  /**
   * Heartland.Card.attachCvvEvents
   *
   * @param {string} selector
   */
  public static attachCvvEvents(selector: string) {
    Events.addHandler(document.querySelector(selector), 'keydown', this.restrictNumeric);
    Events.addHandler(document.querySelector(selector), 'keydown', this.restrictLength(4));
    Events.addHandler(document.querySelector(selector), 'input', this.validateCvv);
  }
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (var i = (start || 0), j = this.length; i < j; i++) {
      if (this[i] === obj) { return i; }
    }
    return -1;
  };
}
