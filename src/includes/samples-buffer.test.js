import 'babel-polyfill';
import samples from '../data/samples';
import {
  SamplesBuffer,
  load,
  loadBuffer,
  decode,
  success,
  error,
  createInstance,
  rewire$load,
  rewire$loadBuffer,
  rewire$decode,
  rewire$success,
  rewire$error,
  rewire$createInstance
} from './samples-buffer';
import * as audioContext from './audio-context';
import * as errorHandler from './error-handler';

const samplesBuffer = {
  load,
  loadBuffer,
  decode,
  success,
  error,
  createInstance
};

const mockOpen = jest.fn();
const mockSend = jest.fn();

window.XMLHttpRequest = function() {
  this.open = mockOpen;
  this.send = mockSend;
};

function resetRewiredFunctions() {
  rewire$load(samplesBuffer.load);
  rewire$loadBuffer(samplesBuffer.loadBuffer);
  rewire$decode(samplesBuffer.decode);
  rewire$success(samplesBuffer.success);
  rewire$error(samplesBuffer.error);
  rewire$createInstance(samplesBuffer.createInstance);
}

afterEach(() => {
  mockOpen.mockReset();
  mockSend.mockReset();
  resetRewiredFunctions();
});

errorHandler.showError = jest.fn();

describe('SamplesBuffer', () => {
  it('new instance should make call to load function with an object containing two samples', async () => {
    const spy = jest.fn();
    rewire$load(async param => spy(param));

    await SamplesBuffer.getInstance();

    expect(typeof spy.mock.calls[0][0].kick.process).toBe('function');
    expect(typeof spy.mock.calls[0][0].snare.process).toBe('function');
  });

  it('should return the same instance if getInstance is called twice', async () => {
    rewire$load(async () => {});

    const instance1 = await SamplesBuffer.getInstance();
    const instance2 = await SamplesBuffer.getInstance();

    expect(instance1).toBe(instance2);
  });

  it('should return an error if there is no samples buffer', () => {
    SamplesBuffer.resetInstance();
    rewire$createInstance(() => undefined);
    SamplesBuffer.getInstance();
    expect(errorHandler.showError.mock.calls[0][0]).toBe(
      'Error reported, sorry for the inconvenience'
    );
  });

  describe('load', () => {
    it('should return an object with keys the same name as those passed in', async () => {
      rewire$loadBuffer(() => {});
      const result = await load({ kick: 'mock1', snare: 'mock2' });
      expect(result).toHaveProperty('kick');
      expect(result).toHaveProperty('snare');
    });

    it('should call loadBuffer with each sample', async () => {
      const spy = jest.fn();
      rewire$loadBuffer(param => spy(param));

      await load([samples.kick, samples.snare]);

      expect(typeof spy.mock.calls[0][0].process).toBe('function');
      expect(typeof spy.mock.calls[1][0].process).toBe('function');
    });
  });

  describe('loadBuffer', () => {
    it('should return a promise', () => {
      expect(loadBuffer(samples.kick)).toEqual(new Promise(() => {}));
    });

    it('should call XMLHttpRequest open method with arguments', () => {
      const spy = jest.fn();
      rewire$decode((request, resolve, reject) =>
        spy(request, resolve, reject)
      );

      loadBuffer(samples.kick);

      expect(mockOpen.mock.calls[0][0]).toBe('GET');
      expect(typeof mockOpen.mock.calls[0][1].process).toBe('function');
      expect(mockOpen.mock.calls[0][2]).toBe(true);
    });

    it('should call XMLHttpRequest send method', () => {
      const spy = jest.fn();
      rewire$decode((request, resolve, reject) =>
        spy(request, resolve, reject)
      );

      loadBuffer(samples.kick);

      expect(mockSend.mock.calls.length).toBe(1);
    });

    it('should call decode with XMLHttpRequest object, resolve and reject functions', () => {
      const spy = jest.fn();
      rewire$decode((request, resolve, reject) =>
        spy(request, resolve, reject)
      );

      loadBuffer(samples.kick);

      expect(typeof spy.mock.calls[0][0]).toBe('object');
      expect(typeof spy.mock.calls[0][1]).toBe('function');
      expect(typeof spy.mock.calls[0][2]).toBe('function');
    });
  });

  describe('decode', () => {
    const mockDecodeAudioData = jest.fn();
    audioContext.Context = {
      getInstance: () => {
        return {
          decodeAudioData: mockDecodeAudioData
        };
      }
    };

    it('should call audioContext.decodeAudioData with correct arguments', () => {
      decode({ response: 'mock1' }, 'mock2', 'mock3')();
      expect(mockDecodeAudioData.mock.calls[0][0]).toBe('mock1');
      expect(typeof mockDecodeAudioData.mock.calls[0][1]).toBe('function');
      expect(typeof mockDecodeAudioData.mock.calls[0][2]).toBe('function');
    });

    it('should call success function with correct argument', () => {
      const successSpy = jest.fn();
      rewire$success(param => successSpy(param));

      decode({ response: 'mock1' }, 'mock2', 'mock3')();

      expect(successSpy.mock.calls[0][0]).toBe('mock2');
    });

    it('should call error function with correct argument', () => {
      const errorSpy = jest.fn();
      rewire$error(param => errorSpy(param));

      decode({ response: 'mock1' }, 'mock2', 'mock3')();

      expect(errorSpy.mock.calls[0][0]).toBe('mock3');
    });
  });

  describe('success', () => {
    it('should call resolve with buffer if it exists', () => {
      const mockResolve = jest.fn();
      success(mockResolve)('mock');
      expect(mockResolve.mock.calls[0][0]).toBe('mock');
    });

    it("shouldn't call resolve if no buffer is passed in", () => {
      const mockResolve = jest.fn();
      success(mockResolve)();
      expect(mockResolve.mock.calls.length).toBe(0);
    });
  });

  describe('error', () => {
    it('should call reject with error message', () => {
      const mockReject = jest.fn();
      error(mockReject)();
      expect(mockReject.mock.calls[0][0]).toBe('Error loading drum samples');
    });
  });
});
