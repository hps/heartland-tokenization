module Heartland {
  /**
   * @namespace Heartland.Validator
   */
  export interface Validator {
    validate: (value: any) => boolean;
  }
}
