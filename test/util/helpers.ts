import {HPS} from "../../src/HPS";
import {TokenizationResponse} from "../../src/types/TokenizationResponse";

(<any>window).Heartland = (<any>window).Heartland || {};
(<any>window).Heartland.Test = {
  public_key: 'pkapi_cert_jDLChE5RlZJj9Y7aq9',

  // global success handler
  check_for_token: function (assert: any, done: Function, callback: Function) {
    var called = false;
    return function (response: TokenizationResponse) {
      if (called) { return; }
      assert.ok(response.token_value, 'token_value');
      assert.ok((<any>response).token_type, 'token_type');
      assert.ok((<any>response).token_expire, 'token_expire');
      assert.ok(response.card_type, 'card_type');
      assert.ok(response.last_four, 'last_four');
      if (callback) { callback(); }
      done();
      called = true;
    };
  },

  // global error handler
  default_error: function (assert: any, done: Function) {
    var called = false;
    return function (response: TokenizationResponse) {
      if (called) { return; }
      assert.ok(false, (<any>response.error).message);
      done();
      called = true;
    };
  },

  addHandler: (<any>window).Heartland.Events.addHandler,

  setCardData: function (hps: HPS, child: boolean) {
    hps.Messages.post(
      {
        action: 'setFieldData',
        id: child ? 'heartland-card-number' : 'heartland-field',
        value: '4111111111111111'
      },
      child ? 'child' : 'cardNumber'
    );
    hps.Messages.post(
      {
        action: 'setFieldData',
        id: child ? 'heartland-cvv' : 'heartland-field',
        value: '123'
      },
      child ? 'child' : 'cardCvv'
    );
    hps.Messages.post(
      {
        action: 'setFieldData',
        id: child ? 'heartland-expiration' : 'heartland-field',
        value: '12 / 2016'
      },
      child ? 'child' : 'cardExpiration'
    );
  },

  makeDiv: function (id: string) {
    var div = document.createElement('div');
    div.id = id;
    div.style.display = 'none';
    document.body.appendChild(div);
  }
};
