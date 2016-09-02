import {Validator} from "../types/Validator";
import {Card} from "../Card";

export class CardNumber implements Validator {
  validate(number: string): boolean {
    if (!number) {
      return false;
    }

    number = number.replace(/[-\s]/g, '');
    const type = Card.typeByNumber(number);

    if (!type) {
      return false;
    }
    return Card.luhnCheck(number)
      && number.length === type.length;
  }
}
