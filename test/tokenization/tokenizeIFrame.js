QUnit.module('tokenize iframe');

asyncTest('valid iframe target', function () {
  var id = 'valid-iframe-target';
  makeDiv(id);

  var hps = window.hps = new HPS({
    publicKey: public_key,
    type: 'iframe',
    iframeTarget: id,
    onTokenSuccess: check_for_token,
    onTokenError: default_error
  });
  addHandler(document, 'securesubmitIframeReady', function () {
    setCardData(hps, true);
    hps.tokenize();
  });
});

asyncTest('invalid iframe target - undefined target', function () {
  var id = undefined;
  var fun = function (response) {
    ok(false, 'token success/error function ran');
  };
  var hps = window.hps = new HPS({
    publicKey: public_key,
    type: 'iframe',
    iframeTarget: id,
    onTokenSuccess: fun,
    onTokenError: fun
  });
  start();
  hps.tokenize();
  ok(true);
});

asyncTest('invalid iframe target - myframe does not exist', function () {
  var id = 'invalid-iframe-target-myframe';
  start();
  try {
    var hps = window.hps = new HPS({
      publicKey: public_key,
      type: 'iframe',
      iframeTarget: id,
      targetType: 'myframe'
    });
    ok(false, "you completed something the DOM shouldn't be able to do");
  } catch(e) {
    ok(true);
  }
});
