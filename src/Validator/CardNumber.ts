/// <reference path="../types/CardType.ts" />
/// <reference path="../types/Validator.ts" />
/// <reference path="../Card.ts" />

module Heartland {
  export module Validator {
    export class CardNumber implements Validator {
      validate(number: string): boolean {
        var type: CardType;

        if (!number) {
          return false;
        }

        number = number.replace(/[-\s]/g, '');
        type = Card.typeByNumber(number);

        if (!type) {
          return false;
        }
        return Card.luhnCheck(number)
          && number.length === type.length;
      }
    }
  }
}
