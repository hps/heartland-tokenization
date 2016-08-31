import {CardType} from "../types/CardType";
import {Formatter} from "../types/Formatter";
import {Card} from "../Card";

export class CardNumber implements Formatter {
  format(number: string): string {
    var type: CardType;
    var matches: string[];

    number = number.replace(/\D/g, '');
    type = Card.typeByNumber(number);

    if (!type) { return number; }

    matches = number.match(type.format);

    if (!matches) { return number; }

    if (!type.format.global) {
      matches.shift();
    }
    return matches.join(' ').replace(/^\s+|\s+$/gm, '');
  }
}
