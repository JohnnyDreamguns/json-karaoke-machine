import 'babel-polyfill';
import samples from '../data/samples';
import * as audioContext from './audio-context';
import * as metronome from './metronome/index';
import * as samplesBuffer from './samples-buffer';
import { default as song } from '../songs/VanHalenJump';
import {
  setUpDependencies,
  configureMetronome,
  onMetronomeMessage,
  doTick,
  triggerSounds,
  calculateNextBeatTime,
  incrementBeat,
  rewire$getState,
  rewire$dispatch,
  rewire$doTick,
  rewire$triggerSounds,
  rewire$calculateNextBeatTime,
  rewire$incrementBeat
} from './music-machine';

const musicMachine = {
  doTick,
  triggerSounds,
  calculateNextBeatTime,
  incrementBeat
};

function resetRewiredFunctions() {
  rewire$doTick(musicMachine.doTick);
  rewire$triggerSounds(musicMachine.triggerSounds);
  rewire$calculateNextBeatTime(musicMachine.calculateNextBeatTime);
  rewire$incrementBeat(musicMachine.incrementBeat);
}

afterEach(() => {
  resetRewiredFunctions();
  mockDispatch.mockReset();
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

const mockDispatch = jest.fn();
rewire$dispatch(mockDispatch);

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
  it('on tick event should call doTick with correct params', () => {
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

describe('onMetronomeMessage', () => {
  it('on tick event should call doTick with correct params', () => {
    const spy = jest.fn();
    rewire$doTick((arg1, arg2, arg3, arg4) => spy(arg1, arg2, arg3, arg4));

    onMetronomeMessage({ songData: 'mock!' })({ data: 'tick' });

    expect(spy.mock.calls[0][0]).toEqual({ songData: 'mock!' });
    expect(spy.mock.calls[0][1]).toEqual(120);
    expect(spy.mock.calls[0][2]).toEqual(20);
    expect(spy.mock.calls[0][3]).toEqual(15);
  });
});

describe('doTick', () => {
  it('should call triggerSounds with correct params if next beat is due', async () => {
    const spy = jest.fn();
    rewire$triggerSounds((arg1, arg2, arg3, arg4) =>
      spy(arg1, arg2, arg3, arg4)
    );

    doTick({ songData: 'mock!' }, 120, 20, 15);

    expect(spy.mock.calls[0][0]).toEqual({ songData: 'mock!' });
    expect(spy.mock.calls[0][1]).toEqual(20);
    expect(spy.mock.calls[0][2]).toEqual(120);
    expect(spy.mock.calls[0][3]).toEqual(15);
  });

  it("shouldn't call triggerSounds if next next beat is not due", async () => {
    const spy = jest.fn();
    rewire$triggerSounds(param => {
      spy(param);
    });

    doTick(song, 120, 105, 15);

    expect(spy.mock.calls.length).toBe(0);
  });

  it('should call calculateNextBeatTime with correct params if next beat is due', async () => {
    const spy = jest.fn();
    rewire$calculateNextBeatTime((arg1, arg2) => spy(arg1, arg2));

    doTick(song, 120, 20, 15);

    expect(spy.mock.calls[0][0]).toEqual(120);
    expect(spy.mock.calls[0][1]).toEqual(20);
  });

  it('should call incrementBeat with correct params if next beat is due', async () => {
    const spy = jest.fn();
    rewire$incrementBeat(arg1 => spy(arg1));

    doTick(song, 120, 20, 15);

    expect(spy.mock.calls[0][0]).toEqual(15);
  });
});

describe('calculateNextBeatTime', () => {
  it('should dispatch a SET_NEXT_BEAT_TIME action', async () => {
    calculateNextBeatTime(120, 20);

    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: 'SET_NEXT_BEAT_TIME',
      value: 20.125
    });
  });
});

describe('incrementBeat', () => {
  it('should dispatch a SET_BEAT_NUMBER action', async () => {
    incrementBeat(20);

    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: 'SET_BEAT_NUMBER',
      value: 21
    });
  });
});
