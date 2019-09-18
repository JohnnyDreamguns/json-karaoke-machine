import 'babel-polyfill';
import samples from '../data/samples';
import * as audioContext from './audio-context';
import * as metronome from './metronome/index';
import * as samplesBuffer from './samples-buffer';
import {
  setUpDependencies,
  configureMetronome,
  onMetronomeMessage,
  doTick,
  rewire$doTick,
  rewire$getState
} from './music-machine';

const musicMachine = {
  doTick
};

function resetRewiredFunctions() {
  rewire$doTick(musicMachine.doTick);
}

afterEach(() => {
  resetRewiredFunctions();
});

audioContext.Context = {
  mockFuncs: {
    createBufferSource: jest.fn(),
    createOscillator: jest.fn(),
    createGain: jest.fn()
  },
  getInstance: () => ({
    currentTime: 100,
    destination: 'mockDestination',
    createBuffer: jest.fn,
    ...audioContext.Context.mockFuncs
  })
};

metronome.Metronome = {
  mockFuncs: {
    postMessage: jest.fn()
  },
  getInstance: () => ({
    ...metronome.Metronome.mockFuncs
  })
};

samplesBuffer.SamplesBuffer = { getInstance: () => {} };

const mockState = {
  settings: {
    tempo: 120,
    nextBeatTime: 20,
    beatNumber: 15
  }
};

rewire$getState(() => mockState);

describe('setUpDependencies', () => {
  it('should return audio context, metronome and samplesBuffer', async () => {
    const dependencies = await setUpDependencies();
    expect(JSON.stringify(dependencies.audioContext)).toEqual(
      JSON.stringify(audioContext.Context.getInstance())
    );

    expect(JSON.stringify(dependencies.metronome)).toEqual(
      JSON.stringify(metronome.Metronome.getInstance())
    );

    expect(JSON.stringify(dependencies.samplesBuffer)).toEqual(
      JSON.stringify(samplesBuffer.SamplesBuffer.getInstance())
    );
  });
});

describe('configureMetronome', () => {
  it('should set metronome.onmessage to onMetronomeMessage function', async () => {
    const dependencies = await setUpDependencies();

    configureMetronome();
    expect(typeof dependencies.metronome.onmessage).toBe('function');
  });

  it('should call metronome.postMessage with object containing interval', async () => {
    const dependencies = await setUpDependencies();
    dependencies.metronome.postMessage.mockReset();

    configureMetronome();
    expect(dependencies.metronome.postMessage.mock.calls[0][0]).toEqual({
      interval: 25
    });
  });
});

describe('onMetronomeMessage', () => {
  it('on tick event should call doTick with correct params', async () => {
    const spy = jest.fn();
    rewire$doTick((songData, tempo, nextBeatTime, beatNumber) =>
      spy(songData, tempo, nextBeatTime, beatNumber)
    );

    onMetronomeMessage({ songData: 'mock!' })({ data: 'tick' });

    expect(spy.mock.calls[0][0]).toEqual({ songData: 'mock!' });
    expect(spy.mock.calls[0][1]).toEqual(120);
    expect(spy.mock.calls[0][2]).toEqual(20);
    expect(spy.mock.calls[0][3]).toEqual(15);
  });
});
