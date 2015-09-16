/// <reference path="types/Card.ts" />
/// <reference path="types/Options.ts" />
/// <reference path="vars/urls.ts" />
/// <reference path="Events.ts" />

module Heartland {
  export module Util {
    // Heartland.Util.getCardType
    //
    // Parses a credit card number to obtain the card type/brand.
    export function getCardType(number: string) {
      var cardType = '';
      var re = {
        visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
        mastercard: /^5[1-5][0-9]{14}$/,
        amex: /^3[47][0-9]{13}$/,
        diners: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        jcb: /^(?:2131|1800|35\d{3})\d{11}$/
      };
    
      if (re.visa.test(number)) {
        cardType = 'visa';
      } else if (re.mastercard.test(number)) {
        cardType = 'mastercard';
      } else if (re.amex.test(number)) {
        cardType = 'amex';
      } else if (re.diners.test(number)) {
        cardType = 'diners';
      } else if (re.discover.test(number)) {
        cardType = 'discover';
      } else if (re.jcb.test(number)) {
        cardType = 'jcb';
      }
    
      return cardType;
    }
    
    // Heartland.Util.applyOptions
    //
    // Creates a single object by merging a `source` (default) and `properties`
    // obtained elsewhere, e.g. a function argument in `HPS`. Any properties in
    // `properties` will overwrite matching properties in `source`.
    export function applyOptions(source: Options, properties: Options) {
      var property: string;
    
      if (!source) {
        source = {};
      }
    
      for (property in properties) {
        if (properties.hasOwnProperty(property)) {
          (<any>source)[property] = (<any>properties)[property];
        }
      }
    
      return source;
    }
    
    // Heartland.Util.throwError
    //
    // Allows a merchant-defined error handler to be used in cases where the
    // tokenization process fails. If not provided, we throw the message as a
    // JS runtime error.
    export function throwError(options: Options, errorMessage: string) {
      if (typeof (options.error) === 'function') {
        options.error(errorMessage);
      } else {
        throw errorMessage;
      }
    }
    
    // Heartland.Util.getItemByPropertyValue
    //
    // Enumerates over a `collection` to retreive an item whose `property` is
    // a given `value`.
    export function getItemByPropertyValue(collection: any, property: string, value: any) {
      var length = collection.length;
      var i = 0;
    
      for (i; i < length; i++) {
        if (collection[i][property] === value) {
          return collection[i];
        }
      }
    }
    
    // Heartland.Util.getParams
    //
    // Builds param list for a particular `type` from expected properties in
    // `data`.
    export function getParams(type: string, data: Options) {
      var params: Array<string> = [];
      switch (type) {
        case 'pan':
          params.push(
            'token_type=supt',
            'object=token',
            '_method=post',
            'api_key=' + data.publicKey.trim(),
            'card%5Bnumber%5D=' + data.cardNumber.trim(),
            'card%5Bexp_month%5D=' + data.cardExpMonth.trim(),
            'card%5Bexp_year%5D=' + data.cardExpYear.trim(),
            'card%5Bcvc%5D=' + data.cardCvv.trim()
            );
          break;
        case 'swipe':
          params.push(
            'token_type=supt',
            'object=token',
            '_method=post',
            'api_key=' + data.publicKey.trim(),
            'card%5Btrack_method%5D=swipe',
            'card%5Btrack%5D=' + encodeURIComponent(data.track.trim())
            );
          break;
        case 'encrypted':
          params.push(
            'token_type=supt',
            'object=token',
            '_method=post',
            'api_key=' + data.publicKey.trim(),
            'encryptedcard%5Btrack_method%5D=swipe',
            'encryptedcard%5Btrack%5D=' + encodeURIComponent(data.track.trim()),
            'encryptedcard%5Btrack_number%5D=' + encodeURIComponent(data.trackNumber.trim()),
            'encryptedcard%5Bktb%5D=' + encodeURIComponent(data.ktb.trim()),
            'encryptedcard%5Bpin_block%5D=' + encodeURIComponent(data.pinBlock.trim())
            );
          break;
        default:
          Heartland.Util.throwError(data, 'unknown params type');
          break;
      }
      return '?' + params.join('&');
    }
    
    // Heartland.Util.getUrlByEnv
    //
    // Selects the appropriate tokenization service URL for the
    // active `publicKey`.
    export function getUrlByEnv(options: Options) {
      options.env = options.publicKey.split('_')[1];
    
      if (options.env === 'cert') {
        options.gatewayUrl = urls.CERT;
      } else {
        options.gatewayUrl = urls.PROD;
      }
    
      return options;
    }
    
    // Heartland.Util.addFormHandler
    //
    // Creates and adds an event handler function for the submission for a given
    // form (`options.form_id`).
    export function addFormHandler(options: Options) {
      var payment_form = document.getElementById(options.formId);
    
      var code = function (e: Event) {
        if (e.preventDefault) {
          e.preventDefault();
        } else if (window.event) /* for ie */ {
          window.event.returnValue = false;
        }
    
        var fields = Heartland.Util.getFields(options.formId);
        var cardType = Heartland.Util.getCardType(fields.number);
    
        options.cardNumber = fields.number;
        options.cardExpMonth = fields.expMonth;
        options.cardExpYear = fields.expYear;
        options.cardCvv = fields.cvv;
        options.cardType = cardType;
    
        Heartland.Ajax.call('pan', options);
      };
    
      Heartland.Events.addHandler(payment_form, 'submit', code);
      Heartland.DOM.addField(options.formId, 'hidden', 'publicKey', options.publicKey);
    }
    
    // Heartland.Util.getFields
    //
    // Extracts card information from the fields with names `card_number`,
    // `card_expiration_month`, `card_expiration_year`, and `card_cvc` and
    // expects them to be present as children of `formParent`.
    export function getFields(formParent: string): Card {
      var form = document.getElementById(formParent);
      var fields: Card = {};
      var i: number, element: HTMLInputElement;
      var length = form.childElementCount;
    
      for (i = 0; i < length; i++) {
        element = <HTMLInputElement>form.children[i];
        if (element.id === 'card_number') {
          fields.number = element.value;
        } else if (element.id === 'card_expiration_month') {
          fields.expMonth = element.value;
        } else if (element.id === 'card_expiration_year') {
          fields.expYear = element.value;
        } else if (element.id === 'card_cvc') {
          fields.cvv = element.value;
        }
      }
    
      return fields;
    }
  }
}
