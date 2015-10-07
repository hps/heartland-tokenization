var expFormatter = new Heartland.Formatter.Expiration;

QUnit.module('formatter expiration');

QUnit.test('complete expiration', function (assert) {
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

QUnit.test('partial expiration', function (assert) {
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
