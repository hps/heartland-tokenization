import {assert} from "chai";

var expValidator = new window.Heartland.Validator.Expiration;

suite('validator expiration', function () {
  test('valid expiration', function () {
    assert.ok(expValidator.validate('1/2025'), '1/2025');
    assert.ok(expValidator.validate('1 /2025'), '1 /2025');
    assert.ok(expValidator.validate('1/ 2025'), '1/ 2025');
    assert.ok(expValidator.validate('1 / 2025'), '1 / 2025');

    assert.ok(expValidator.validate('01/2025'), '01/2025');
    assert.ok(expValidator.validate('01 /2025'), '01 /2025');
    assert.ok(expValidator.validate('01/ 2025'), '01/ 2025');
    assert.ok(expValidator.validate('01 / 2025'), '01 / 2025');
  });

  test('invalid expiration', function () {
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
});
