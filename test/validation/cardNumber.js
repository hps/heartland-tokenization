var cardValidator = new Heartland.Validator.CardNumber;

QUnit.module('validator card number');

asyncTest('valid card number', function () {
  start();
  ok(cardValidator.validate('4012002000060016'), 'visa');
  ok(cardValidator.validate('5473500000000014'), 'mastercard');
  ok(cardValidator.validate('6011000990156527'), 'discover');
  ok(cardValidator.validate('372700699251018'),  'amex');
  ok(cardValidator.validate('3566007770007321'), 'jcb');
});
