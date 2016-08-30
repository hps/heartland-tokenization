var assert;
if (!assert) { assert = require('chai').assert; }

var cardFormatter = new window.Heartland.Formatter.CardNumber;

suite('formatter cardNumber', function () {
  test('complete card number', function () {
    var result;
    result = cardFormatter.format('4012002000060016');
    assert.equal(result, '4012 0020 0006 0016', 'complete visa');

    result = cardFormatter.format('5473500000000014');
    assert.equal(result, '5473 5000 0000 0014', 'mastercard');

    result = cardFormatter.format('6011000990156527');
    assert.equal(result, '6011 0009 9015 6527', 'discover');

    result = cardFormatter.format('372700699251018');
    assert.equal(result, '3727 006992 51018', 'amex');

    result = cardFormatter.format('3566007770007321');
    assert.equal(result, '3566 0077 7000 7321', 'jcb');
  });

  test('partial card number', function () {
    var result;
    result = cardFormatter.format('40120020000600');
    assert.equal(result, '4012 0020 0006 00', 'complete visa');

    result = cardFormatter.format('547350000000');
    assert.equal(result, '5473 5000 0000', 'mastercard');

    result = cardFormatter.format('6011000');
    assert.equal(result, '6011 000', 'discover');

    result = cardFormatter.format('3727006992510');
    assert.equal(result, '3727 006992 510', 'amex');

    result = cardFormatter.format('356');
    assert.equal(result, '356', 'jcb');
  });
});
