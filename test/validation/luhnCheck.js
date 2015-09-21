QUnit.module('luhn check');

asyncTest('valid card', function () {
  start();
  ok(Heartland.Card.luhnCheck('4012002000060016'), 'visa');
  ok(Heartland.Card.luhnCheck('5473500000000014'), 'mastercard');
  ok(Heartland.Card.luhnCheck('6011000990156527'), 'discover');
  ok(Heartland.Card.luhnCheck('372700699251018'),  'amex');
  ok(Heartland.Card.luhnCheck('3566007770007321'), 'jcb');
});

asyncTest('invalid card', function () {
  start();
  notOk(Heartland.Card.luhnCheck(undefined), 'undefined');
  notOk(Heartland.Card.luhnCheck(' '), 'space');
  notOk(Heartland.Card.luhnCheck('4012002000060017'), 'visa');
  notOk(Heartland.Card.luhnCheck('5473500000000015'), 'mastercard');
  notOk(Heartland.Card.luhnCheck('6011000990156528'), 'discover');
  notOk(Heartland.Card.luhnCheck('372700699251019'),  'amex');
  notOk(Heartland.Card.luhnCheck('3566007770007322'), 'jcb');
});
