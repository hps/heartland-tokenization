QUnit.module('tokenize iframe');

QUnit.test('valid iframe target', function (assert) {
  var done = assert.async();
  var id = 'valid-iframe-target';
  Heartland.Test.makeDiv(id);

  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    type: 'iframe',
    iframeTarget: id,
    onTokenSuccess: Heartland.Test.check_for_token(assert, done),
    onTokenError: Heartland.Test.default_error(assert, done)
  });
  Heartland.Test.addHandler(document, 'securesubmitIframeReady', function () {
    Heartland.Test.setCardData(hps, true);
    hps.tokenize();
  });
});

QUnit.test('invalid iframe target - undefined target', function (assert) {
  var done = assert.async();
  var id = undefined;
  var fun = function (response) {
    assert.ok(false, 'token success/error function ran');
    done();
  };
  var timeout = setTimeout(function () {
    assert.ok(false, 'iframe failed to construct properly');
    done();
  }, 5000);

  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    type: 'iframe',
    iframeTarget: id,
    onTokenSuccess: fun,
    onTokenError: fun
  });

  hps.tokenize();
  assert.ok(true);
  done();
  clearTimeout(timeout);
});

QUnit.test('invalid iframe target - myframe does not exist', function (assert) {
  var done = assert.async();
  var id = 'invalid-iframe-target-myframe';

  try {
    var hps = new HPS({
      publicKey: Heartland.Test.public_key,
      type: 'iframe',
      iframeTarget: id,
      targetType: 'myframe'
    });
    assert.ok(false, "you completed something the DOM shouldn't be able to do");
    done();
  } catch(e) {
    assert.ok(true);
    done();
  }
});
