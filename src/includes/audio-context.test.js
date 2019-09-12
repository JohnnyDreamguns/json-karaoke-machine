import { Context } from './audio-context';

function mockAudioContext() {
  this.mockProp = 'mock!';
}

function useMockAudioContext() {
  Context.resetInstance();
  window.webkitAudioContext = undefined;
  window.AudioContext = mockAudioContext;
}

function useMockWebkitAudioContext() {
  Context.resetInstance();
  window.AudioContext = undefined;
  window.webkitAudioContext = mockAudioContext;
}

describe('Context', () => {
  it('should return an AudioContext instance', () => {
    useMockAudioContext();
    expect(Context.getInstance().mockProp).toBe('mock!');
  });

  it('should return a webkitAudioContext instance', () => {
    useMockWebkitAudioContext();
    expect(Context.getInstance().mockProp).toBe('mock!');
  });

  it('should return the same instance if called twice', () => {
    useMockAudioContext();
    const instance1 = Context.getInstance();
    const instance2 = Context.getInstance();
    expect(instance1).toEqual(instance2);
  });
});
