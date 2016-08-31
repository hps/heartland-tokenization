var assert;
if (!assert) { assert = require('chai').assert; }

suite('tokenize swipe', function () {
  test('Valid card swipe should return token', function (done) {
    var hps = new window.Heartland.HPS({
      publicKey: window.Heartland.Test.public_key,
      track: '<E1050711%B4012001000000016^VI TEST CREDIT^251200000000000000000000?|JyoniYvJNQo4niHb8sKi2QebEY5QyEkEiVPONVa+kXwQwlYWWtP8MWVvk|+++++++MYYR6dB27|11;4012001000000016=25120000000000000000?|9h1XMRQqTB3ymeRjNoggVdMWoL9|+++++++MYYR6dB27|00|||/wECAQECAoFGAgEH1AEaSkFvYxZwb3NAc2VjdXJlZXhjaGFuZ2UubmV0NqiCK7DRQcpBKYH94V7T11tGIeQ+r5fcDhljp5YbevjEpe1ZLPaeFvLHwR93DOsGVh/6Q5UQEotRf8bw9JbwvhHprluHxDJ8xmqqZaZ28dmmutXA8ZmAe+599j8+T81P7BGBaVefReaqr3bl8SZ0alTohnVUMzvFWAktUPkuZvQAn3a+E6wlsbz0pDfHiIzCGe3pqE98KX5OnJQ55braq7y5rL96|>',
      success: window.Heartland.Test.check_for_token(assert, done),
      error: window.Heartland.Test.default_error(assert, done)
    });
    hps.tokenize({type: 'swipe'});
  });

  test('Valid parsed swipe should return token', function (done) {
    var hps = new window.Heartland.HPS({
      publicKey: window.Heartland.Test.public_key,
      track: '%B4012001000000016^VI TEST CREDIT^251200000000000000000000?;4012001000000016=25120000000000000000?',
      success: window.Heartland.Test.check_for_token(assert, done),
      error: window.Heartland.Test.default_error(assert, done)
    });
    hps.tokenize({type: 'swipe'});
  });

  test('Valid swipe error should be null', function (done) {
    var hps = new window.Heartland.HPS({
      publicKey: window.Heartland.Test.public_key,
      track: '<E1050711%B4012001000000016^VI TEST CREDIT^251200000000000000000000?|JyoniYvJNQo4niHb8sKi2QebEY5QyEkEiVPONVa+kXwQwlYWWtP8MWVvk|+++++++MYYR6dB27|11;4012001000000016=25120000000000000000?|9h1XMRQqTB3ymeRjNoggVdMWoL9|+++++++MYYR6dB27|00|||/wECAQECAoFGAgEH1AEaSkFvYxZwb3NAc2VjdXJlZXhjaGFuZ2UubmV0NqiCK7DRQcpBKYH94V7T11tGIeQ+r5fcDhljp5YbevjEpe1ZLPaeFvLHwR93DOsGVh/6Q5UQEotRf8bw9JbwvhHprluHxDJ8xmqqZaZ28dmmutXA8ZmAe+599j8+T81P7BGBaVefReaqr3bl8SZ0alTohnVUMzvFWAktUPkuZvQAn3a+E6wlsbz0pDfHiIzCGe3pqE98KX5OnJQ55braq7y5rL96|>',
      success: function (response) {
        assert.ok(response.token_value);
        assert.ok(!response.error);
        done();
      },
      error: window.Heartland.Test.default_error(assert, done)
    });
    hps.tokenize({type: 'swipe'});
  });

  test('Invalid swipe returns error', function (done) {
    var hps = new window.Heartland.HPS({
      publicKey: window.Heartland.Test.public_key,
      track: 'bad',
      success: window.Heartland.Test.check_for_token(assert, done),
      error: function (response) {
        assert.equal(response.error.code, '2', 'code');
        assert.equal(response.error.param, 'card .track', 'param');
        assert.equal(response.error.message, 'card parsing track failed.', 'message');
        done();
      }
    });
    hps.tokenize({type: 'swipe'});
  });
});
