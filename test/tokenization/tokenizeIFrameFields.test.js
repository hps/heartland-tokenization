var assert;
if (!assert) { assert = require('chai').assert; }

suite('tokenize iframe fields', function () {
  test('valid iframe fields setup', function (done) {
    var numberId = 'valid-cardNumber-target';
    var dateId = 'valid-cardExpiration-target';
    var cvvId = 'valid-cardCvv-target';
    window.Heartland.Test.makeDiv(numberId);
    window.Heartland.Test.makeDiv(dateId);
    window.Heartland.Test.makeDiv(cvvId);

    var timeout = setTimeout(function () {
      assert.ok(false, 'iframe failed to construct properly');
      done();
    }, 4000);
    var cleanup = function () {
      document.getElementById(numberId).remove();
      document.getElementById(dateId).remove();
      document.getElementById(cvvId).remove();
      clearTimeout(timeout);
    };

    var hps = new HPS({
      publicKey: window.Heartland.Test.public_key,
      type: 'iframe',
      fields: {
        cardNumber: {
          target: numberId,
          placeholder: 'Card Number'
        },
        cardCvv: {
          target: cvvId,
          placeholder: 'Security Code'
        },
        cardExpiration: {
          target: dateId,
          placeholder: 'MM / YYYY'
        }
      },
      onTokenSuccess: window.Heartland.Test.check_for_token(assert, done, cleanup),
      onTokenError: window.Heartland.Test.default_error(assert, done, cleanup)
    });

    var readyCount = 0;
    window.Heartland.Test.addHandler(document, 'securesubmitIframeReady', function () {
      if (++readyCount === 3) {
        window.Heartland.Test.setCardData(hps);
        setTimeout(function () {
          hps.Messages.post(
            {
                accumulateData: true,
                action: 'tokenize',
                message: window.Heartland.Test.public_key
            },
            'cardNumber'
          );
        }, 3000);
      }
    });
  });
});
