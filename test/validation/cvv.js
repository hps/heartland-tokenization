var cvvValidator = new Heartland.Validator.Cvv;

QUnit.module('validator cvv');

asyncTest('valid cvv', function () {
  start();

  ok(cvvValidator.validate('000'), '000');
  ok(cvvValidator.validate('012'), '012');
  ok(cvvValidator.validate('123'), '123');

  ok(cvvValidator.validate('0000'), '0000');
  ok(cvvValidator.validate('0001'), '0001');
  ok(cvvValidator.validate('0012'), '0012');
  ok(cvvValidator.validate('0123'), '0123');
  ok(cvvValidator.validate('1234'), '1234');
});

asyncTest('invalid cvv', function () {
  start();

  notOk(cvvValidator.validate(undefined), 'undefined')
  notOk(cvvValidator.validate(''), 'space');
  notOk(cvvValidator.validate('12'), '12');
  notOk(cvvValidator.validate('12345'), '12345');
});
