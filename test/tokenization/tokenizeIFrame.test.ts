import {assert} from "chai";
import Heartland from "../../src";
import {TokenizationResponse} from "../../src/types/TokenizationResponse";
import {HeartlandTest} from "../util/helpers";

suite('tokenize iframe', function () {
  test('valid iframe target', function (done) {
    const id = 'valid-iframe-target';
    HeartlandTest.makeDiv(id);

    const hps = new Heartland.HPS({
      publicKey: HeartlandTest.public_key,
      type: 'iframe',
      iframeTarget: id,
      onTokenSuccess: HeartlandTest.check_for_token(assert, done, function () {
          document.getElementById(id).remove();
      }),
      onTokenError: HeartlandTest.default_error(assert, done, function () {
          document.getElementById(id).remove();
      })
    });
    HeartlandTest.addHandler(document, 'securesubmitIframeReady', function () {
      HeartlandTest.setCardData(hps, true);
      hps.tokenize();
    });
  });

//   test('invalid iframe target - undefined target', function (done) {
//     const id: any = undefined;
//     const fun = function (response: TokenizationResponse) {
//       assert.ok(false, 'token success/error function ran');
//       done();
//     };
//     const timeout = setTimeout(function () {
//       assert.ok(false, 'iframe failed to construct properly');
//       done();
//     }, 5000);

//     const hps = new Heartland.HPS({
//       publicKey: HeartlandTest.public_key,
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
    const id = 'invalid-iframe-target-myframe';

    try {
      const hps = new Heartland.HPS({
        publicKey: HeartlandTest.public_key,
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
