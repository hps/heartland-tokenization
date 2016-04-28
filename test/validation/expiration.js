var expValidator = new Heartland.Validator.Expiration;

QUnit.module('validator expiration');

QUnit.test('valid expiration', function (assert) {
  assert.ok(expValidator.validate('1/2025'), '1/2025');
  assert.ok(expValidator.validate('1 /2025'), '1 /2025');
  assert.ok(expValidator.validate('1/ 2025'), '1/ 2025');
  assert.ok(expValidator.validate('1 / 2025'), '1 / 2025');

  assert.ok(expValidator.validate('01/2025'), '01/2025');
  assert.ok(expValidator.validate('01 /2025'), '01 /2025');
  assert.ok(expValidator.validate('01/ 2025'), '01/ 2025');
  assert.ok(expValidator.validate('01 / 2025'), '01 / 2025');
});

QUnit.test('invalid expiration', function (assert) {
  assert.notOk(expValidator.validate(undefined), 'undefined');
  assert.notOk(expValidator.validate(''), 'space');

  assert.notOk(expValidator.validate('1'), '1');
  assert.notOk(expValidator.validate('1 /'), '1 /');
  assert.notOk(expValidator.validate('1/'), '1/');
  assert.notOk(expValidator.validate('01'), '01');
  assert.notOk(expValidator.validate('01/'), '01/');
  assert.notOk(expValidator.validate('01 /'), '01 /');

  assert.notOk(expValidator.validate('1/1'), '1/1');
  assert.notOk(expValidator.validate('1 /1'), '1 /1');
  assert.notOk(expValidator.validate('1/ 1'), '1/ 1');

  assert.notOk(expValidator.validate('1/16'), '1/16');
  assert.notOk(expValidator.validate('1 /16'), '1 /16');
  assert.notOk(expValidator.validate('1/ 16'), '1/ 16');
  assert.notOk(expValidator.validate('1 / 16'), '1 / 16');

  assert.notOk(expValidator.validate('01/1'), '01/1');
  assert.notOk(expValidator.validate('01 /1'), '01 /1');
  assert.notOk(expValidator.validate('01/ 1'), '01/ 1');

  assert.notOk(expValidator.validate('01/16'), '01/16');
  assert.notOk(expValidator.validate('01 /16'), '01 /16');
  assert.notOk(expValidator.validate('01/ 16'), '01/ 16');
  assert.notOk(expValidator.validate('01 / 16'), '01 / 16');

  assert.notOk(expValidator.validate('1/201'), '1/201');
  assert.notOk(expValidator.validate('01 /201'), '01 /201');
  assert.notOk(expValidator.validate('1/ 201'), '1/ 201');

  assert.notOk(expValidator.validate('01/201'), '01/201');
  assert.notOk(expValidator.validate('01 /201'), '01 /201');
  assert.notOk(expValidator.validate('01/ 201'), '01/ 201');
});
