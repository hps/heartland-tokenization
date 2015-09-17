/// <reference path="../types/CardType.ts" />

module Heartland {
  export module Card {
    export var types: CardType[] = [
      {
        code: 'visa',
        regex: /^4[0-9]{12}(?:[0-9]{3})?$/
      },
      {
        code: 'mastercard',
        regex: /^5[1-5][0-9]{14}$/
      },
      {
        code: 'amex',
        regex: /^3[47][0-9]{13}$/
      },
      {
        code: 'diners',
        regex: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/
      },
      {
        code: 'discover',
        regex: /^6(?:011|5[0-9]{2})[0-9]{12}$/
      },
      {
        code: 'jcb',
        regex: /^(?:2131|1800|35\d{3})\d{11}$/
      }
    ];
  }
}
