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

QUnit.module('tokenize_swipe');

asyncTest('Valid card swipe should return token', function () {
	var hps = new HPS({
		api_key: public_key,
		track: '<E1050711%B4012001000000016^VI TEST CREDIT^251200000000000000000000?|JyoniYvJNQo4niHb8sKi2QebEY5QyEkEiVPONVa+kXwQwlYWWtP8MWVvk|+++++++MYYR6dB27|11;4012001000000016=25120000000000000000?|9h1XMRQqTB3ymeRjNoggVdMWoL9|+++++++MYYR6dB27|00|||/wECAQECAoFGAgEH1AEaSkFvYxZwb3NAc2VjdXJlZXhjaGFuZ2UubmV0NqiCK7DRQcpBKYH94V7T11tGIeQ+r5fcDhljp5YbevjEpe1ZLPaeFvLHwR93DOsGVh/6Q5UQEotRf8bw9JbwvhHprluHxDJ8xmqqZaZ28dmmutXA8ZmAe+599j8+T81P7BGBaVefReaqr3bl8SZ0alTohnVUMzvFWAktUPkuZvQAn3a+E6wlsbz0pDfHiIzCGe3pqE98KX5OnJQ55braq7y5rL96|>',
		success: check_for_token,
		error: default_error
	});
  hps.tokenize({type: 'swipe'});
});

asyncTest('Valid parsed swipe should return token', function () {
  var hps = new HPS({
    api_key: public_key,
    track: '%B4012001000000016^VI TEST CREDIT^251200000000000000000000?;4012001000000016=25120000000000000000?',
    success: check_for_token,
    error: default_error
  });
  hps.tokenize({type: 'swipe'});
});

asyncTest('Valid swipe error should be null', function () {
	var hps = new HPS({
		api_key: public_key,
		track: '<E1050711%B4012001000000016^VI TEST CREDIT^251200000000000000000000?|JyoniYvJNQo4niHb8sKi2QebEY5QyEkEiVPONVa+kXwQwlYWWtP8MWVvk|+++++++MYYR6dB27|11;4012001000000016=25120000000000000000?|9h1XMRQqTB3ymeRjNoggVdMWoL9|+++++++MYYR6dB27|00|||/wECAQECAoFGAgEH1AEaSkFvYxZwb3NAc2VjdXJlZXhjaGFuZ2UubmV0NqiCK7DRQcpBKYH94V7T11tGIeQ+r5fcDhljp5YbevjEpe1ZLPaeFvLHwR93DOsGVh/6Q5UQEotRf8bw9JbwvhHprluHxDJ8xmqqZaZ28dmmutXA8ZmAe+599j8+T81P7BGBaVefReaqr3bl8SZ0alTohnVUMzvFWAktUPkuZvQAn3a+E6wlsbz0pDfHiIzCGe3pqE98KX5OnJQ55braq7y5rL96|>',
		success: function (response) {
			start();
			ok(response.token_value);
			ok(!response.error);
		},
		error: default_error
	});
  hps.tokenize({type: 'swipe'});
});

asyncTest('Invalid swipe returns error', function (assert) {
	var hps = new HPS({
		api_key: public_key,
		track: 'bad',
		success: check_for_token,
		error: function (response) {
			start();
			assert.equal(response.error.code, '2', 'code');
			assert.equal(response.error.param, 'card .track', 'param');
			assert.equal(response.error.message, 'card parsing track failed.', 'message');
		}
	});
  hps.tokenize({type: 'swipe'});
});
