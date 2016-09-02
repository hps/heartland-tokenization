import {assert} from "chai";
import Heartland from "../../src";

const cvvValidator = new Heartland.Validator.Cvv;

suite('validator cvv', function () {
  test('valid cvv', function () {
    assert.ok(cvvValidator.validate('000'), '000');
    assert.ok(cvvValidator.validate('012'), '012');
    assert.ok(cvvValidator.validate('123'), '123');

    assert.ok(cvvValidator.validate('0000'), '0000');
    assert.ok(cvvValidator.validate('0001'), '0001');
    assert.ok(cvvValidator.validate('0012'), '0012');
    assert.ok(cvvValidator.validate('0123'), '0123');
    assert.ok(cvvValidator.validate('1234'), '1234');
  });

  test('invalid cvv', function () {
    assert.notOk(cvvValidator.validate(undefined), 'undefined')
    assert.notOk(cvvValidator.validate(''), 'space');
    assert.notOk(cvvValidator.validate('12'), '12');
    assert.notOk(cvvValidator.validate('12345'), '12345');
  });
});
