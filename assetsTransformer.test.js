import assetsTransformer from './assetsTransformer';

describe('assetsTransformer', () => {
  it('should return correct value', () => {
    expect(assetsTransformer.process(undefined, 'test.jpg')).toBe(
      'module.exports = "test.jpg";'
    );
  });
});
