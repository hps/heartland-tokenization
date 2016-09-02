import {Formatter} from "../types/Formatter";
import {Card} from "../Card";

export class CardNumber implements Formatter {
  format(number: string): string {
    number = number.replace(/\D/g, '');
    const type = Card.typeByNumber(number);

    if (!type) { return number; }

    const matches = number.match(type.format);

    if (!matches) { return number; }

    if (!type.format.global) {
      matches.shift();
    }
    return matches.join(' ').replace(/^\s+|\s+$/gm, '');
  }
}
