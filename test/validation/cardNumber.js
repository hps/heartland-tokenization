var cardValidator = new Heartland.Validator.CardNumber;

QUnit.module('validator card number');

QUnit.test('valid card number', function (assert) {
  assert.ok(cardValidator.validate('4012002000060016'), 'visa');
  assert.ok(cardValidator.validate('5473500000000014'), 'mastercard');
  assert.ok(cardValidator.validate('6011000990156527'), 'discover');
  assert.ok(cardValidator.validate('372700699251018'),  'amex');
  assert.ok(cardValidator.validate('3566007770007321'), 'jcb');
});
