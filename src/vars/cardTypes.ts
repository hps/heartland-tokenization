import {CardType} from "../types/CardType";

export const cardTypes: CardType[] = [
  {
    code: 'visa',
    format: /(\d{1,4})/g,
    length: 16,
    regex: /^4/
  },
  {
    code: 'mastercard',
    format: /(\d{1,4})/g,
    length: 16,
    regex: /^(5[1-5]|2[2-7])/
  },
  {
    code: 'amex',
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    length: 15,
    regex: /^3[47]/
  },
  {
    code: 'diners',
    format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
    length: 14,
    regex: /^3[0689]/
  },
  {
    code: 'discover',
    format: /(\d{1,4})/g,
    length: 16,
    regex: /^6([045]|22)/
  },
  {
    code: 'jcb',
    format: /(\d{1,4})/g,
    length: 16,
    regex: /^35/
  },
  {
    code: 'gift',
    format: /(\d{1,19})/g,
    length: 19,
    regex: /^\d/
  }
];
