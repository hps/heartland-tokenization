var expValidator = new Heartland.Validator.Expiration;

QUnit.module('validator expiration');

asyncTest('valid expiration', function () {
  start();

  ok(expValidator.validate('1/2016'), '1/2016');
  ok(expValidator.validate('1 /2016'), '1 /2016');
  ok(expValidator.validate('1/ 2016'), '1/ 2016');
  ok(expValidator.validate('1 / 2016'), '1 / 2016');

  ok(expValidator.validate('01/2016'), '01/2016');
  ok(expValidator.validate('01 /2016'), '01 /2016');
  ok(expValidator.validate('01/ 2016'), '01/ 2016');
  ok(expValidator.validate('01 / 2016'), '01 / 2016');
});

asyncTest('invalid expiration', function () {
  start();

  notOk(expValidator.validate(undefined), 'undefined');
  notOk(expValidator.validate(''), 'space');

  notOk(expValidator.validate('1'), '1');
  notOk(expValidator.validate('1 /'), '1 /');
  notOk(expValidator.validate('1/'), '1/');
  notOk(expValidator.validate('01'), '01');
  notOk(expValidator.validate('01/'), '01/');
  notOk(expValidator.validate('01 /'), '01 /');

  notOk(expValidator.validate('1/1'), '1/1');
  notOk(expValidator.validate('1 /1'), '1 /1');
  notOk(expValidator.validate('1/ 1'), '1/ 1');

  notOk(expValidator.validate('1/16'), '1/16');
  notOk(expValidator.validate('1 /16'), '1 /16');
  notOk(expValidator.validate('1/ 16'), '1/ 16');
  notOk(expValidator.validate('1 / 16'), '1 / 16');

  notOk(expValidator.validate('01/1'), '01/1');
  notOk(expValidator.validate('01 /1'), '01 /1');
  notOk(expValidator.validate('01/ 1'), '01/ 1');

  notOk(expValidator.validate('01/16'), '01/16');
  notOk(expValidator.validate('01 /16'), '01 /16');
  notOk(expValidator.validate('01/ 16'), '01/ 16');
  notOk(expValidator.validate('01 / 16'), '01 / 16');

  notOk(expValidator.validate('1/201'), '1/201');
  notOk(expValidator.validate('01 /201'), '01 /201');
  notOk(expValidator.validate('1/ 201'), '1/ 201');

  notOk(expValidator.validate('01/201'), '01/201');
  notOk(expValidator.validate('01 /201'), '01 /201');
  notOk(expValidator.validate('01/ 201'), '01/ 201');
});
