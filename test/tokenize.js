var public_key = 'pkapi_cert_jDLChE5RlZJj9Y7aq9';

// global success handler
var check_for_token = function (response) {
	start();
	ok(response.token_value, 'token_value');
	ok(response.token_type, 'token_type');
	ok(response.token_expire, 'token_expire');
};

// global error handler
var default_error = function (response) {
	start();
	ok(false, response.error.message);
};

QUnit.module('tokenize');

asyncTest('Valid card should return token', function () {
	var hps = new HPS({
		api_key: public_key,
		card_number: '4242424242424242',
		card_cvc: '123',
		card_exp_month: '12',
		card_exp_year: '2015',
		success: check_for_token,
		error: default_error
	});
  hps.tokenize();
});

asyncTest('Valid error should be null', function () {
	var hps = new HPS({
		api_key: public_key,
		card_number: '4242424242424242',
		card_cvc: '123',
		card_exp_month: '12',
		card_exp_year: '2015',
		success: function (response) {
			start();
			ok(response.token_value);
			ok(!response.error);
    },
		error: default_error
	});
  hps.tokenize();
});

asyncTest('Invalid number returns error', function (assert) {
	var hps = new HPS({
		api_key: public_key,
		card_number: '0',
		success: check_for_token,
		error: function (response) {
			start();
			assert.equal(response.error.code, '2', 'code');
			assert.equal(response.error.param, 'card.number', 'param');
			assert.equal(response.error.message, 'Card number is invalid.', 'message');
		}
	});
  hps.tokenize();
});

asyncTest('Valid number with whitespace should get trimmed', function () {
	var hps = new HPS({
		api_key: public_key,
		card_number: '   	  4242424242424242 ',
		card_cvc: '123',
		card_exp_month: '12',
		card_exp_year: '2015',
		success: check_for_token,
		error: default_error
	});
  hps.tokenize();
});

asyncTest('Invalid long number returns error', function (assert) {
	var hps = new HPS({
		api_key: public_key,
		card_number: '11111111111111111111111111111111111',
		success: check_for_token,
		error: function (response) {
			start();
			assert.equal(response.error.code, '2', 'code');
			assert.equal(response.error.param, 'card.number', 'param');
			assert.equal(response.error.message, 'Card number is invalid.', 'message');
		}
	});
  hps.tokenize();
});

asyncTest('Invalid exp month (low) returns error', function (assert) {
	var hps = new HPS({
		api_key: public_key,
		card_number: '4242424242424242',
		card_exp_month: '0',
		success: check_for_token,
		error: function (response) {
			start();
			assert.equal(response.error.code, '2', 'code');
			assert.equal(response.error.param, 'card.exp_month', 'param');
			assert.equal(response.error.message, 'Card expiration month is invalid.', 'message');
		}
	});
  hps.tokenize();
});

asyncTest('Invalid exp month (high) returns error', function (assert) {
	var hps = new HPS({
		api_key: public_key,
		card_number: '4242424242424242',
		card_exp_month: '13',
		success: check_for_token,
		error: function (response) {
			start();
			assert.equal(response.error.code, '2', 'code');
			assert.equal(response.error.param, 'card.exp_month', 'param');
			assert.equal(response.error.message, 'Card expiration month is invalid.', 'message');
		}
	});
  hps.tokenize();
});

asyncTest('Invalid exp year returns error', function (assert) {
	var hps = new HPS({
		api_key: public_key,
		card_number: '4242424242424242',
		card_exp_month: '12',
		card_exp_year: '9999',
		success: check_for_token,
		error: function (response) {
			start();
			assert.equal(response.error.code, '2', 'code');
			assert.equal(response.error.param, 'card.exp_year', 'param');
			assert.equal(response.error.message, 'Card expiration year is invalid.', 'message');
		}
	});
  hps.tokenize();
});

asyncTest('Previous year expiration returns error', function (assert) {
	var hps = new HPS({
		api_key: public_key,
		card_number: '4242424242424242',
		card_exp_month: '12',
		card_exp_year: '2013',
		success: check_for_token,
		error: function (response) {
			start();
			assert.equal(response.error.message, 'The expiration year is in the past.', 'message');
		}
	});
  hps.tokenize();
});
