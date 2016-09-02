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
    let cardType: CardType;
    let i: any;

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
    let number: string;

    if (isEncrypted && trackNumber && trackNumber === '02') {
      number = data.split('=')[0];
    } else {
      let temp = data.split('%');
      if (temp[1]) {
        temp = temp[1].split('^');
        if (temp[0]) {
          number = temp[0].toString().substr(1);
        }
      }
    }

    return Card.typeByNumber(number);
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
    let odd = true;
    let i = 0;
    let sum = 0;
    let digit: number;

    if (!number) {
      return false;
    }

    const digits = number.split('').reverse();
    const length = digits.length;

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
    const target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    const type = Card.typeByNumber(target.value);
    const classList = target.className.split(' ');
    const length = classList.length;
    let i = 0;
    let c = '';

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
    const target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    const value = target.value;

    if (value.length === 0) { return; }

    const formatted = (new CardNumberFormatter).format(value);
    target.value = formatted;

    if (!target.setSelectionRange) { return; }

    let cursor = target.selectionStart;

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
    const target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    const value = target.value;
    // allow: delete, backspace
    if ([46, 8].indexOf(e.keyCode) !== -1 ||
      // allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
      return;
    }
    target.value = (new ExpirationFormatter)
      .format(value, e.type === 'blur');
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
      const target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
      const value = target.value;
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
    const target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    const value = target.value;

    if (!target.setSelectionRange) { return; }

    const cursor = target.selectionStart;

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
    const target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    const value = target.value;
    const classList = target.className.split(' ');
    const length = classList.length;
    let c = '';

    for (let i = 0; i < length; i++) {
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
    const target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    const value = target.value;
    const classList = target.className.split(' ');
    const length = classList.length;
    let c = '';

    for (let i = 0; i < length; i++) {
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
    const target = <HTMLInputElement>(e.currentTarget ? e.currentTarget : e.srcElement);
    const value = target.value;
    const classList = target.className.split(' ');
    const length = classList.length;
    let c = '';

    for (let i = 0; i < length; i++) {
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
    Events.addHandler(document.querySelector(selector), 'keydown', Card.restrictNumeric);
    Events.addHandler(document.querySelector(selector), 'keydown', Card.restrictLength(19));
    Events.addHandler(document.querySelector(selector), 'keydown', Card.deleteProperly);
    Events.addHandler(document.querySelector(selector), 'input', Card.formatNumber);
    Events.addHandler(document.querySelector(selector), 'input', Card.validateNumber);
    Events.addHandler(document.querySelector(selector), 'input', Card.addType);
  }

  /**
   * Heartland.Card.attachExpirationEvents
   *
   * @param {string} selector
   */
  public static attachExpirationEvents(selector: string) {
    Events.addHandler(document.querySelector(selector), 'keydown', Card.restrictNumeric);
    Events.addHandler(document.querySelector(selector), 'keydown', Card.restrictLength(9));
    Events.addHandler(document.querySelector(selector), 'keyup', Card.formatExpiration);
    Events.addHandler(document.querySelector(selector), 'blur', Card.formatExpiration);
    Events.addHandler(document.querySelector(selector), 'input', Card.validateExpiration);
    Events.addHandler(document.querySelector(selector), 'blur', Card.validateExpiration);
  }

  /**
   * Heartland.Card.attachCvvEvents
   *
   * @param {string} selector
   */
  public static attachCvvEvents(selector: string) {
    Events.addHandler(document.querySelector(selector), 'keydown', Card.restrictNumeric);
    Events.addHandler(document.querySelector(selector), 'keydown', Card.restrictLength(4));
    Events.addHandler(document.querySelector(selector), 'input', Card.validateCvv);
  }
}

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (obj, start) {
    for (let i = (start || 0), j = this.length; i < j; i++) {
      if (this[i] === obj) { return i; }
    }
    return -1;
  };
}
