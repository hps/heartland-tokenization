import Heartland from "../../src";
import {HPS} from "../../src/HPS";
import {TokenizationResponse} from "../../src/types/TokenizationResponse";

export const HeartlandTest = {
  public_key: 'pkapi_cert_jDLChE5RlZJj9Y7aq9',

  // global success handler
  check_for_token: function (assert: any, done: MochaDone, callback?: () => void) {
    let called = false;
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
  default_error: function (assert: any, done: MochaDone, callback?: () => void) {
    let called = false;
    return function (response: TokenizationResponse) {
      if (called) { return; }
      assert.ok(false, (<any>response.error).message);
      done();
      called = true;
    };
  },

  addHandler: Heartland.Events.addHandler,

  setCardData: function (hps: HPS, child = false) {
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
    const div = document.createElement('div');
    div.id = id;
    div.style.display = 'none';
    document.body.appendChild(div);
  }
};
