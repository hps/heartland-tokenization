QUnit.module('tokenize iframe fields');

QUnit.test('valid iframe fields setup', function (assert) {
  var done = assert.async();
  var numberId = 'valid-cardNumber-target';
  var dateId = 'valid-cardExpiration-target';
  var cvvId = 'valid-cardCvv-target';
  Heartland.Test.makeDiv(numberId);
  Heartland.Test.makeDiv(dateId);
  Heartland.Test.makeDiv(cvvId);

  var hps = new HPS({
    publicKey: Heartland.Test.public_key,
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
    onTokenSuccess: Heartland.Test.check_for_token(assert, done),
    onTokenError: Heartland.Test.default_error(assert, done)
  });

  var readyCount = 0;
  Heartland.Test.addHandler(document, 'securesubmitIframeReady', function () {
    if (++readyCount === 3) {
      Heartland.Test.setCardData(hps);
      hps.Messages.post(
        {
          accumulateData: true,
          action: 'tokenize',
          message: Heartland.Test.public_key
        },
        'cardNumber'
      );
    }
  });
});
