var Heartland = Heartland || {};
Heartland.Test = {
  public_key: 'pkapi_cert_jDLChE5RlZJj9Y7aq9',

  // global success handler
  check_for_token: function (assert, done) {
    var called = false;
    return function (response) {
      if (called) { return; }
      assert.ok(response.token_value, 'token_value');
      assert.ok(response.token_type, 'token_type');
      assert.ok(response.token_expire, 'token_expire');
      assert.ok(response.card_type, 'card_type');
      assert.ok(response.last_four, 'last_four');
      done();
      called = true;
    };
  },

  // global error handler
  default_error: function (assert, done) {
    var called = false;
    return function (response) {
      if (called) { return; }
      assert.ok(false, response.error.message);
      done();
      called = true;
    };
  },

  addHandler: Heartland.Events.addHandler,

  setCardData: function (hps, child) {
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
  },

  makeDiv: function (id) {
    var div = document.createElement('div');
    div.id = id;
    div.style.display = 'none';
    document.body.appendChild(div);
  }
};
