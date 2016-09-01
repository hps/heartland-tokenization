import {assert} from "chai";

suite('tokenize iframe', function () {
  test('valid iframe target', function (done) {
    var id = 'valid-iframe-target';
    window.Heartland.Test.makeDiv(id);

    var hps = new window.Heartland.HPS({
      publicKey: window.Heartland.Test.public_key,
      type: 'iframe',
      iframeTarget: id,
      onTokenSuccess: window.Heartland.Test.check_for_token(assert, done, function () {
          document.getElementById(id).remove();
      }),
      onTokenError: window.Heartland.Test.default_error(assert, done, function () {
          document.getElementById(id).remove();
      })
    });
    window.Heartland.Test.addHandler(document, 'securesubmitIframeReady', function () {
      window.Heartland.Test.setCardData(hps, true);
      hps.tokenize();
    });
  });

//   test('invalid iframe target - undefined target', function (done) {
//     var id = undefined;
//     var fun = function (response) {
//       assert.ok(false, 'token success/error function ran');
//       done();
//     };
//     var timeout = setTimeout(function () {
//       assert.ok(false, 'iframe failed to construct properly');
//       done();
//     }, 5000);

//     var hps = new window.Heartland.HPS({
//       publicKey: window.Heartland.Test.public_key,
//       type: 'iframe',
//       iframeTarget: id,
//       onTokenSuccess: fun,
//       onTokenError: fun
//     });

//     hps.tokenize();
//     assert.ok(true);
//     clearTimeout(timeout);
//     done();
//   });

  test('invalid iframe target - myframe does not exist', function (done) {
    var id = 'invalid-iframe-target-myframe';

    try {
      var hps = new window.Heartland.HPS({
        publicKey: window.Heartland.Test.public_key,
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
});
