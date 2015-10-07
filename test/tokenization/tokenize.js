QUnit.module('tokenize');

QUnit.test('Valid card should return token', function (assert) {
  var done = assert.async();
  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    cardNumber: '4242424242424242',
    cardCvv: '123',
    cardExpMonth: '12',
    cardExpYear: '2015',
    success: Heartland.Test.check_for_token(assert, done),
    error: Heartland.Test.default_error(assert, done)
  });
  hps.tokenize();
});

QUnit.test('Valid error should be null', function (assert) {
  var done = assert.async();
  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    cardNumber: '4242424242424242',
    cardCvv: '123',
    cardExpMonth: '12',
    cardExpYear: '2015',
    success: function (response) {
      assert.ok(response.token_value);
      assert.ok(!response.error);
      done();
    },
    error: Heartland.Test.default_error(assert, done)
  });
  hps.tokenize();
});

QUnit.test('Invalid number returns error', function (assert) {
  var done = assert.async();
  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    cardNumber: '0',
    success: Heartland.Test.check_for_token(assert, done),
    error: function (response) {
      assert.equal(response.error.code, '2', 'code');
      assert.equal(response.error.param, 'card.number', 'param');
      assert.equal(response.error.message, 'Card number is invalid.', 'message');
      done();
    }
  });
  hps.tokenize();
});

QUnit.test('Valid number with whitespace should get trimmed', function (assert) {
  var done = assert.async();
  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    cardNumber: '   	  4242424242424242 ',
    cardCvv: '123',
    cardExpMonth: '12',
    cardExpYear: '2015',
    success: Heartland.Test.check_for_token(assert, done),
    error: Heartland.Test.default_error(assert, done)
  });
  hps.tokenize();
});

QUnit.test('Invalid long number returns error', function (assert) {
  var done = assert.async();
  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    cardNumber: '11111111111111111111111111111111111',
    success: Heartland.Test.check_for_token(assert, done),
    error: function (response) {
      assert.equal(response.error.code, '2', 'code');
      assert.equal(response.error.param, 'card.number', 'param');
      assert.equal(response.error.message, 'Card number is invalid.', 'message');
      done();
    }
  });
  hps.tokenize();
});

QUnit.test('Invalid exp month (low) returns error', function (assert) {
  var done = assert.async();
  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    cardNumber: '4242424242424242',
    cardExpMonth: '0',
    success: Heartland.Test.check_for_token(assert, done),
    error: function (response) {
      assert.equal(response.error.code, '2', 'code');
      assert.equal(response.error.param, 'card.exp_month', 'param');
      assert.equal(response.error.message, 'Card expiration month is invalid.', 'message');
      done();
    }
  });
  hps.tokenize();
});

QUnit.test('Invalid exp month (high) returns error', function (assert) {
  var done = assert.async();
  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    cardNumber: '4242424242424242',
    cardExpMonth: '13',
    success: Heartland.Test.check_for_token(assert, done),
    error: function (response) {
      assert.equal(response.error.code, '2', 'code');
      assert.equal(response.error.param, 'card.exp_month', 'param');
      assert.equal(response.error.message, 'Card expiration month is invalid.', 'message');
      done();
    }
  });
  hps.tokenize();
});

QUnit.test('Invalid exp year returns error', function (assert) {
  var done = assert.async();
  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    cardNumber: '4242424242424242',
    cardExpMonth: '12',
    cardExpYear: '9999',
    success: Heartland.Test.check_for_token(assert, done),
    error: function (response) {
      assert.equal(response.error.code, '2', 'code');
      assert.equal(response.error.param, 'card.exp_year', 'param');
      assert.equal(response.error.message, 'Card expiration year is invalid.', 'message');
      done();
    }
  });
  hps.tokenize();
});

QUnit.test('Previous year expiration returns error', function (assert) {
  var done = assert.async();
  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    cardNumber: '4242424242424242',
    cardExpMonth: '12',
    cardExpYear: '2013',
    success: Heartland.Test.check_for_token(assert, done),
    error: function (response) {
      assert.equal(response.error.message, 'The expiration year is in the past.', 'message');
      done();
    }
  });
  hps.tokenize();
});
