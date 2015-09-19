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

function addHandler(target, event, callback) {
      var node;
      if (typeof target === 'string') {
        node = document.getElementById(target);
      } else {
        node = target;
      }

      if (node.addEventListener) {
        node.addEventListener(event, callback, false);
      } else if (node.attachEvent) {
        node.attachEvent(event, callback);
      }
    }

function setCardData(hps, child) {
  hps.Messages.post(
    {
      action: 'setFieldData',
      id: child ? 'heartland-card-number' : 'heartland-field',
      value: '4111111111111111'
    },
    child ? 'child' : 'cardNumber'
  );
  hps.Messages.post(
    {
      action: 'setFieldData',
      id: child ? 'heartland-cvv' : 'heartland-field',
      value: '123'
    },
    child ? 'child' : 'cardCvv'
  );
  hps.Messages.post(
    {
      action: 'setFieldData',
      id: child ? 'heartland-expiration' : 'heartland-field',
      value: '12 / 2016'
    },
    child ? 'child' : 'cardExpiration'
  );
}

function makeDiv(id) {
  var div = document.createElement('div');
  div.id = id;
  div.style.display = 'none';
  document.body.appendChild(div);
}

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
