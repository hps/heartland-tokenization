import {Validator} from "../types/Validator";

export class Cvv implements Validator {
  validate(cvv: string): boolean {
    if (!cvv) {
      return false;
    }

    cvv = cvv.replace(/^\s+|\s+$/g, '');

    if (!/^\d+$/.test(cvv)) {
      return false;
    }
    return 3 <= cvv.length && cvv.length <= 4;
  }
}
