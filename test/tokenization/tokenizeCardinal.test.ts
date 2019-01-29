import {assert} from "chai";
import Heartland from "../../src";
import {CardinalTokenService} from "../../src/TokenService/CardinalTokenService";
import {HeartlandTest} from "../util/helpers";

suite('tokenize Cardinal', function () {
  test('Valid card should return error with bad jwt', function (done) {
    const service = new CardinalTokenService("jwtjwt");
    let called = false;
    service.tokenize({
      cardCvv: '123',
      cardExpMonth: '12',
      cardExpYear: '2015',
      cardNumber: '4242424242424242',
      cca: {
        orderNumber: (<any>window).Math.random(0, 1000000) + "-shzs"
      }
    }, (response) => {
      if (called) { return; }
      assert.ok(response.error);
      assert.ok(response.error.message);
      assert.notOk(response.token_value);
      called = true;
      done();
    });
  });

  test.skip('Valid card should return 2 response objects to success callback', function (done) {
    let called = false;
    const hps = new Heartland.HPS({
      cardCvv: '123',
      cardExpMonth: '12',
      cardExpYear: '2015',
      cardNumber: '4242424242424242',
      cca: {
        jwt: "jwtjwt",
        orderNumber: (<any>window).Math.random(0, 1000000) + "-shzs"
      },
      publicKey: HeartlandTest.public_key,
      success: (response: any) => {
        if (called) { return; }
        assert.notDeepEqual({}, response.heartland);
        assert.notDeepEqual({}, response.cardinal);
        called = true;
        done();
      },
      error: () => {
        if (called) { return; }
        assert.ok(false);
        called = true;
        done();
      }
    });
    hps.tokenize();
  });

  test.skip('Valid card should return 2 tokens with cca enabled and good jwt', function (done) {
    let called = false;
    const hps = new Heartland.HPS({
      cardCvv: '123',
      cardExpMonth: '01',
      cardExpYear: '2099',
      cardNumber: '4000000000000002',
      cca: {
        jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlY2ltcG93c2p1cm5rZHhiemhsZ3Z5dHFhZiIsImlhdCI6MTQ3NDI5NDk3NywiaXNzIjoiNTc5YmM5ODVkYTUyOTM3OGYwZWM3ZDBlIiwiT3JnVW5pdElkIjoiNTc5OWMzYzQzM2ZhZGQ0Y2Y0MjdkMDFhIiwiUGF5bG9hZCI6eyJPcmRlckRldGFpbHMiOnsiT3JkZXJOdW1iZXIiOiJicmR2ZmhjcXd4am56dGxlZ3B5c3VrYWlvbSIsIkFtb3VudCI6IjE1MDAiLCJDdXJyZW5jeUNvZGUiOiI4NDAifX19.X0KGseWiSY-5L19dMLL_ni98YHR_T1_OsmuVBy_E8bo",
        orderNumber: (<any>window).Math.random(0, 1000000) + "-shzs"
      },
      publicKey: HeartlandTest.public_key,
      success: (response: any) => {
        if (called) { return; }
        assert.notDeepEqual({}, response.heartland);
        assert.notDeepEqual({}, response.cardinal);
        assert.ok(response.heartland.token_value);
        assert.ok(response.cardinal.token_value);
        called = true;
        done();
      },
      error: () => {
        if (called) { return; }
        assert.ok(false);
        called = true;
        done();
      }
    });
    hps.tokenize();
  });
});
