import {assert} from "chai";
import Heartland from "../../src";
import {TokenizationResponse} from "../../src/types/TokenizationResponse";
import {HeartlandTest} from "../util/helpers";

suite('tokenize', function () {
  test('Valid card should return token', function (done) {
    const hps = new Heartland.HPS({
      publicKey: HeartlandTest.public_key,
      cardNumber: '4242424242424242',
      cardCvv: '123',
      cardExpMonth: '12',
      cardExpYear: '2015',
      success: HeartlandTest.check_for_token(assert, done),
      error: HeartlandTest.default_error(assert, done)
    });
    hps.tokenize();
  });

  test('Valid error should be null', function (done) {
    const hps = new Heartland.HPS({
      publicKey: HeartlandTest.public_key,
      cardNumber: '4242424242424242',
      cardCvv: '123',
      cardExpMonth: '12',
      cardExpYear: '2015',
      success: function (response: TokenizationResponse) {
        assert.ok(response.token_value);
        assert.ok(!response.error);
        done();
      },
      error: HeartlandTest.default_error(assert, done)
    });
    hps.tokenize();
  });

  test('Invalid number returns error', function (done) {
    const hps = new Heartland.HPS({
      publicKey: HeartlandTest.public_key,
      cardNumber: '0',
      success: HeartlandTest.check_for_token(assert, done),
      error: function (response: TokenizationResponse) {
        assert.equal(response.error.code, '2', 'code');
        assert.equal(response.error.param, 'card.number', 'param');
        assert.equal(response.error.message, 'Card number is invalid.', 'message');
        done();
      }
    });
    hps.tokenize();
  });

  test('Valid number with whitespace should get trimmed', function (done) {
    const hps = new Heartland.HPS({
      publicKey: HeartlandTest.public_key,
      cardNumber: '   	  4242424242424242 ',
      cardCvv: '123',
      cardExpMonth: '12',
      cardExpYear: '2015',
      success: HeartlandTest.check_for_token(assert, done),
      error: HeartlandTest.default_error(assert, done)
    });
    hps.tokenize();
  });

  test('Invalid long number returns error', function (done) {
    const hps = new Heartland.HPS({
      publicKey: HeartlandTest.public_key,
      cardNumber: '11111111111111111111111111111111111',
      success: HeartlandTest.check_for_token(assert, done),
      error: function (response: TokenizationResponse) {
        assert.equal(response.error.code, '2', 'code');
        assert.equal(response.error.param, 'card.number', 'param');
        assert.equal(response.error.message, 'Card number is invalid.', 'message');
        done();
      }
    });
    hps.tokenize();
  });

  test('Invalid exp month (low) returns error', function (done) {
    const hps = new Heartland.HPS({
      publicKey: HeartlandTest.public_key,
      cardNumber: '4242424242424242',
      cardExpMonth: '0',
      success: HeartlandTest.check_for_token(assert, done),
      error: function (response: TokenizationResponse) {
        assert.equal(response.error.code, '2', 'code');
        assert.equal(response.error.param, 'card.exp_month', 'param');
        assert.equal(response.error.message, 'Card expiration month is invalid.', 'message');
        done();
      }
    });
    hps.tokenize();
  });

  test('Invalid exp month (high) returns error', function (done) {
    const hps = new Heartland.HPS({
      publicKey: HeartlandTest.public_key,
      cardNumber: '4242424242424242',
      cardExpMonth: '13',
      success: HeartlandTest.check_for_token(assert, done),
      error: function (response: TokenizationResponse) {
        assert.equal(response.error.code, '2', 'code');
        assert.equal(response.error.param, 'card.exp_month', 'param');
        assert.equal(response.error.message, 'Card expiration month is invalid.', 'message');
        done();
      }
    });
    hps.tokenize();
  });

  test('Invalid exp year returns error', function (done) {
    const hps = new Heartland.HPS({
      publicKey: HeartlandTest.public_key,
      cardNumber: '4242424242424242',
      cardExpMonth: '12',
      cardExpYear: '9999',
      success: HeartlandTest.check_for_token(assert, done),
      error: function (response: TokenizationResponse) {
        assert.equal(response.error.code, '2', 'code');
        assert.equal(response.error.param, 'card.exp_year', 'param');
        assert.equal(response.error.message, 'Card expiration year is invalid.', 'message');
        done();
      }
    });
    hps.tokenize();
  });

  test('Previous year expiration returns error', function (done) {
    const hps = new Heartland.HPS({
      publicKey: HeartlandTest.public_key,
      cardNumber: '4242424242424242',
      cardExpMonth: '12',
      cardExpYear: '2013',
      success: HeartlandTest.check_for_token(assert, done),
      error: function (response: TokenizationResponse) {
        assert.equal(response.error.message, 'The expiration year is in the past.', 'message');
        done();
      }
    });
    hps.tokenize();
  });
});
