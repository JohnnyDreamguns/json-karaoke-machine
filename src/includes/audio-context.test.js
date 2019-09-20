import {
  Context,
  createInstance,
  rewire$createInstance
} from './audio-context';
import * as errorHandler from './error-handler';

afterEach(() => {
  errorHandler.showError.mockReset();
  rewire$createInstance(createInstance);
});

errorHandler.showError = jest.fn();

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

  it('should return an error if there is no audio context', () => {
    Context.resetInstance();
    rewire$createInstance(() => undefined);
    Context.getInstance();
    expect(errorHandler.showError.mock.calls[0][0]).toBe(
      'Error reported, sorry for the inconvenience'
    );
  });
});
