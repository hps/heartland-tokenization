/// <reference path="../types/Validator.ts" />

module Heartland {
  export module Validator {
    export class Expiration implements Validator {
      validate(exp: string): boolean {
        var month: number;
        var year: number;
        var split: string[];
        var m: string, y: string;

        if (!exp) {
          return false;
        }

        split = exp.split('/');
        [m, y] = split;

        if (!m || !y) {
          return false;
        }

        m = m.replace(/^\s+|\s+$/g, '');
        y = y.replace(/^\s+|\s+$/g, '');

        if (!/^\d+$/.test(m)) {
          return false;
        }
        if (!/^\d+$/.test(y)) {
          return false;
        }

        if (y.length === 2) {
          y = (new Date).getFullYear().toString().slice(0, 2) + y;
        }

        month = parseInt(m, 10);
        year = parseInt(y, 10);

        if (!(1 <= month && month <= 12)) {
          return false;
        }

        // creates date as 1 day past end of
        // expiration month since JS months
        // are 0 indexed
        return (new Date(year, month, 1)) > (new Date);
      }
    }
  }
}
