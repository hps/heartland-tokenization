var Heartland = Heartland || {};
Heartland.Test = {
  public_key: 'pkapi_cert_jDLChE5RlZJj9Y7aq9',

  // global success handler
  check_for_token: function (response) {
    start();
    ok(response.token_value, 'token_value');
    ok(response.token_type, 'token_type');
    ok(response.token_expire, 'token_expire');
  },

  // global error handler
  default_error: function (response) {
    start();
    ok(false, response.error.message);
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
    // div.style.display = 'none';
    document.body.appendChild(div);
  }
};
