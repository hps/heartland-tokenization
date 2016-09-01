import {assert} from "chai";

var expFormatter = new window.Heartland.Formatter.Expiration;

suite('formatter expiration', function () {
  test('complete expiration', function () {
    // short
    assert.equal(expFormatter.format('1/16'), '01 / 16');
    assert.equal(expFormatter.format('1 /16'), '01 / 16');
    assert.equal(expFormatter.format('1/ 16'), '01 / 16');
    assert.equal(expFormatter.format('1 / 16'), '01 / 16');

    // long
    // assert.equal(expFormatter.format('01/2016'), '01 / 2016');
    // assert.equal(expFormatter.format('01 /2016'), '01 / 2016');
    // assert.equal(expFormatter.format('01/ 2016'), '01 / 2016');
    // assert.equal(expFormatter.format('01 / 2016'), '01 / 2016');
  });

  test('partial expiration', function () {
    assert.equal(expFormatter.format('1'), '1');
    assert.equal(expFormatter.format('01'), '01 / ');

    assert.equal(expFormatter.format('1/'), '01 / ');
    assert.equal(expFormatter.format('1 /'), '01 / ');
    assert.equal(expFormatter.format('01/'), '01 / ');
    assert.equal(expFormatter.format('01 /'), '01 / ');

    assert.equal(expFormatter.format('1/1'), '01 / 1');
    assert.equal(expFormatter.format('1 /1'), '01 / 1');
    assert.equal(expFormatter.format('1/ 1'), '01 / 1');
    assert.equal(expFormatter.format('01/1'), '01 / 1');
    assert.equal(expFormatter.format('01 /1'), '01 / 1');
    assert.equal(expFormatter.format('01/ 1'), '01 / 1');
    assert.equal(expFormatter.format('01/201'), '01 / 201');
    assert.equal(expFormatter.format('01 /201'), '01 / 201');
    assert.equal(expFormatter.format('01/ 201'), '01 / 201');
  });
});
