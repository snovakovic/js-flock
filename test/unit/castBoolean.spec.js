const { assert } = require('chai');
const castBoolean = require('../../src/castBoolean');

describe('cast', () => {
  it('Should cast to true value', () => {
    assert.isTrue(castBoolean(true));
    assert.isTrue(castBoolean('true'));
  });

  it('Should cast to false value', () => {
    assert.isFalse(castBoolean(null));
    assert.isFalse(castBoolean(undefined));
    assert.isFalse(castBoolean(false));
    assert.isFalse(castBoolean(1));
    assert.isFalse(castBoolean('false'));
    assert.isFalse(castBoolean('foo'));
  });
});
