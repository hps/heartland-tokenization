var assert;
if (!assert) { assert = require('chai').assert; }

suite('luhn check', function () {
  test('valid card', function () {
    assert.ok(window.Heartland.Card.luhnCheck('4012002000060016'), 'visa');
    assert.ok(window.Heartland.Card.luhnCheck('5473500000000014'), 'mastercard');
    assert.ok(window.Heartland.Card.luhnCheck('6011000990156527'), 'discover');
    assert.ok(window.Heartland.Card.luhnCheck('372700699251018'),  'amex');
    assert.ok(window.Heartland.Card.luhnCheck('3566007770007321'), 'jcb');
  });

  test('invalid card', function () {
    assert.notOk(window.Heartland.Card.luhnCheck(undefined), 'undefined');
    assert.notOk(window.Heartland.Card.luhnCheck(' '), 'space');
    assert.notOk(window.Heartland.Card.luhnCheck('4012002000060017'), 'visa');
    assert.notOk(window.Heartland.Card.luhnCheck('5473500000000015'), 'mastercard');
    assert.notOk(window.Heartland.Card.luhnCheck('6011000990156528'), 'discover');
    assert.notOk(window.Heartland.Card.luhnCheck('372700699251019'),  'amex');
    assert.notOk(window.Heartland.Card.luhnCheck('3566007770007322'), 'jcb');
  });
});
