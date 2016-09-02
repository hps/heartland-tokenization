import {assert} from "chai";
import Heartland from "../../src";

suite('luhn check', function () {
  test('valid card', function () {
    assert.ok(Heartland.Card.luhnCheck('4012002000060016'), 'visa');
    assert.ok(Heartland.Card.luhnCheck('5473500000000014'), 'mastercard');
    assert.ok(Heartland.Card.luhnCheck('6011000990156527'), 'discover');
    assert.ok(Heartland.Card.luhnCheck('372700699251018'),  'amex');
    assert.ok(Heartland.Card.luhnCheck('3566007770007321'), 'jcb');
  });

  test('invalid card', function () {
    assert.notOk(Heartland.Card.luhnCheck(undefined), 'undefined');
    assert.notOk(Heartland.Card.luhnCheck(' '), 'space');
    assert.notOk(Heartland.Card.luhnCheck('4012002000060017'), 'visa');
    assert.notOk(Heartland.Card.luhnCheck('5473500000000015'), 'mastercard');
    assert.notOk(Heartland.Card.luhnCheck('6011000990156528'), 'discover');
    assert.notOk(Heartland.Card.luhnCheck('372700699251019'),  'amex');
    assert.notOk(Heartland.Card.luhnCheck('3566007770007322'), 'jcb');
  });
});
