QUnit.module('tokenize iframe');

asyncTest('valid iframe target', function () {
  var id = 'valid-iframe-target';
  Heartland.Test.makeDiv(id);

  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    type: 'iframe',
    iframeTarget: id,
    onTokenSuccess: Heartland.Test.check_for_token,
    onTokenError: Heartland.Test.default_error
  });
  Heartland.Test.addHandler(document, 'securesubmitIframeReady', function () {
    Heartland.Test.setCardData(hps, true);
    hps.tokenize();
  });
});

asyncTest('invalid iframe target - undefined target', function () {
  var id = undefined;
  var fun = function (response) {
    ok(false, 'token success/error function ran');
  };
  var timeout = setTimeout(function () {ok(false, 'iframe failed to construct properly');}, 5000);
  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
    type: 'iframe',
    iframeTarget: id,
    onTokenSuccess: fun,
    onTokenError: fun
  });
  setTimeout(function () {
    start();
    hps.tokenize();
    ok(true);
    clearTimeout(timeout);
  });
});

asyncTest('invalid iframe target - myframe does not exist', function () {
  var id = 'invalid-iframe-target-myframe';
  start();
  try {
    var hps = new HPS({
      publicKey: Heartland.Test.public_key,
      type: 'iframe',
      iframeTarget: id,
      targetType: 'myframe'
    });
    ok(false, "you completed something the DOM shouldn't be able to do");
  } catch(e) {
    ok(true);
  }
});
