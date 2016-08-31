import {CardType} from "../types/CardType";
import {Validator} from "../types/Validator";
import {Card} from "../Card";

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
