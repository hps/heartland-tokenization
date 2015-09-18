var public_key = 'pkapi_cert_jDLChE5RlZJj9Y7aq9';

// global success handler
var check_for_token = function(response) {
	start();
	ok(response.token_value, 'token_value');
	ok(response.token_type, 'token_type');
	ok(response.token_expire, 'token_expire');
};

// global error handler
var default_error = function(response) {
	start();
	ok(false, response.error.message);
};

QUnit.module('tokenize_encrypted_card');

asyncTest('Valid Track Data should return token', function () {
  var hps = new HPS({
    publicKey: public_key,
    track: '4012007060016=2512101EcWdTERdUpf8PbKa',
    trackNumber: '02',
    ktb: '/wECAQEEAoFGAgEH3wICTDT6jRZwb3NAc2VjdXJlZXhjaGFuZ2UubmV0oyixA/yDoXL0iQbtz2RQFXIJgH2p+RIggm81xBBiHOVR6Pa2aDTIc7VtTNhpK6nMLR6kvJ6yubVFTSNsobpUKQRNvwjDf+YhO3LjeUrn44ew7CSwkicqgqAAwRKbb148OFtFVrqmZWOK39aQG6O9lXO1B7tyhhIjSJu9eL26gR0AF56UD+igdXDqEDMSc+HqVIVbTC0uicp4TJQEwW7IcyH+1hdk',
    success: check_for_token,
    error: default_error
  });
  hps.tokenize({type: 'encrypted'});
});

asyncTest('Valid Track error should be null', function () {
  var hps = new HPS({
    publicKey: public_key,
    track: '4012007060016=2512101EcWdTERdUpf8PbKa',
    trackNumber: '02',
    ktb: '/wECAQEEAoFGAgEH3wICTDT6jRZwb3NAc2VjdXJlZXhjaGFuZ2UubmV0oyixA/yDoXL0iQbtz2RQFXIJgH2p+RIggm81xBBiHOVR6Pa2aDTIc7VtTNhpK6nMLR6kvJ6yubVFTSNsobpUKQRNvwjDf+YhO3LjeUrn44ew7CSwkicqgqAAwRKbb148OFtFVrqmZWOK39aQG6O9lXO1B7tyhhIjSJu9eL26gR0AF56UD+igdXDqEDMSc+HqVIVbTC0uicp4TJQEwW7IcyH+1hdk',
    success: function (response) {
        start();
        ok(response.token_value);
        ok(!response.error);
    },
    error: default_error
  });
  hps.tokenize({type: 'encrypted'});
});

asyncTest('Invalid Track Data returns error', function (assert) {
  var hps = new HPS({
    publicKey: public_key,
    track: '9h1XMRQqTB3ymeRjNoggVdMWoL9',
    trackNumber: '02',
    ktb: '/wECAQECAoFGAgEH1AEaSkFvYxZwb3NAc2VjdXJlZXhjaGFuZ2UubmV0NqiCK7DRQcpBKYH94V7T11tGIeQ+r5fcDhljp5YbevjEpe1ZLPaeFvLHwR93DOsGVh/6Q5UQEotRf8bw9JbwvhHprluHxDJ8xmqqZaZ28dmmutXA8ZmAe+599j8+T81P7BGBaVefReaqr3bl8SZ0alTohnVUMzvFWAktUPkuZvQAn3a+E6wlsbz0pDfHiIzCGe3pqE98KX5OnJQ55braq7y5rL96',
    success: check_for_token,
    error: function (response) {
      start();
      assert.equal(response.error.code, '2', 'code');
      assert.equal(response.error.param, 'encryptedcard .track', 'param');
      assert.equal(response.error.message, 'encryptedcard parsing track failed.', 'message');
    }
  });
  hps.tokenize({type: 'encrypted'});
});
