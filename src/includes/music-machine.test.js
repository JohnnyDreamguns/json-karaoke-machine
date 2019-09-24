/* eslint-disable no-undef */
import 'babel-polyfill';
import * as errorHandler from './error-handler';
import * as audioContext from './audio-context';
import * as metronome from './metronome/index';
import * as samplesBuffer from './samples-buffer';
import { default as song } from '../songs/VanHalenJump';
import {
  init,
  setUpDependencies,
  configureMetronome,
  onMetronomeMessage,
  doTick,
  triggerSounds,
  calculateNextBeatTime,
  incrementBeat,
  togglePlay,
  playSilentBuffer,
  playSample,
  playNote,
  getNoteFreq,
  getDuration,
  playKick,
  playSnare,
  playC,
  playChord,
  rewire$setUpDependencies,
  rewire$configureMetronome,
  rewire$getState,
  rewire$dispatch,
  rewire$doTick,
  rewire$triggerSounds,
  rewire$calculateNextBeatTime,
  rewire$incrementBeat,
  rewire$playSilentBuffer,
  rewire$playSample,
  rewire$playNote,
  rewire$getNoteFreq,
  rewire$getDuration
} from './music-machine';

// Rewire set up and tear down
const musicMachine = {
  setUpDependencies,
  configureMetronome,
  doTick,
  triggerSounds,
  calculateNextBeatTime,
  incrementBeat,
  playSilentBuffer,
  playSample,
  playNote,
  getNoteFreq,
  getDuration
};

function resetRewiredFunctions() {
  rewire$setUpDependencies(musicMachine.setUpDependencies);
  rewire$configureMetronome(musicMachine.configureMetronome);
  rewire$doTick(musicMachine.doTick);
  rewire$triggerSounds(musicMachine.triggerSounds);
  rewire$calculateNextBeatTime(musicMachine.calculateNextBeatTime);
  rewire$incrementBeat(musicMachine.incrementBeat);
  rewire$playSilentBuffer(musicMachine.playSilentBuffer);
  rewire$playSample(musicMachine.playSample);
  rewire$playNote(musicMachine.playNote);
  rewire$getNoteFreq(musicMachine.getNoteFreq);
  rewire$getDuration(musicMachine.getDuration);
  rewire$getState(() => mockState);
}

afterEach(async () => {
  resetRewiredFunctions();
  mockDispatch.mockReset();
  errorHandler.showError.mockReset();
});

// Mock audio context
const bufferSourceStart = jest.fn();
const bufferSourceConnect = jest.fn();
const oscillatorConnect = jest.fn();
const oscillatorStart = jest.fn();
const oscillatorStop = jest.fn();
const gainNodeConnect = jest.fn();

let oscillator = {
  connect: oscillatorConnect,
  start: oscillatorStart,
  stop: oscillatorStop,
  frequency: {}
};
let gainNode = {
  connect: gainNodeConnect,
  gain: {}
};

const mockContext = {
  getInstance: () => ({
    currentTime: 100,
    destination: 'mockDestination',
    createBuffer: jest.fn(),
    createBufferSource: jest.fn().mockReturnValue({
      start: bufferSourceStart,
      connect: bufferSourceConnect
    }),
    createOscillator: jest.fn().mockReturnValue(oscillator),
    createGain: jest.fn().mockReturnValue(gainNode)
  })
};
audioContext.Context = mockContext;

// Mock metronome
const mockMetronome = {
  getInstance: () => ({
    postMessage: jest.fn()
  })
};
metronome.Metronome = mockMetronome;

// Mock samples buffer
const mockSamplesBuffer = {
  getInstance: () => ({
    kick: 'mock kick'
  })
};
samplesBuffer.SamplesBuffer = mockSamplesBuffer;

errorHandler.showError = jest.fn();

// Mock state
const mockState = {
  settings: {
    unlocked: true,
    tempo: 120,
    nextBeatTime: 20,
    beatNumber: 15,
    IsInitialised: false
  }
};
rewire$getState(() => mockState);

// Mock dispatch
const mockDispatch = jest.fn();
rewire$dispatch(mockDispatch);

describe('init', () => {
  const errorText = 'Error reported, sorry for the inconvenience';
  it('should call setUpDependencies', async () => {
    const spy = jest.fn();
    rewire$setUpDependencies(spy);

    await init(song, mockDispatch, () => mockState);

    expect(spy).toHaveBeenCalled();
  });

  it('should show error if dispatch function is missing', async () => {
    await init(song, undefined, () => mockState);

    expect(errorHandler.showError.mock.calls[0][0]).toBe(errorText);

    await init(song, mockDispatch, () => mockState);
  });

  it('should show error if getState function is missing', async () => {
    await init(song, mockDispatch, undefined);

    expect(errorHandler.showError.mock.calls[0][0]).toBe(errorText);

    await init(song, mockDispatch, () => mockState);
  });

  it('should dispatch SET_IS_INITIALISED action', async () => {
    await init(song, mockDispatch, () => mockState);

    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: 'SET_IS_INITIALISED',
      value: true
    });
  });

  it('should call configureMetronome', async () => {
    const spy = jest.fn();
    rewire$configureMetronome(spy);

    await init(song, mockDispatch, () => mockState);

    expect(spy).toHaveBeenCalled();
  });

  it("shouldn't call setUpDependencies if already initialised", async () => {
    const newState = {
      ...mockState,
      settings: { IsInitialised: true }
    };
    rewire$getState(() => newState);

    const spy = jest.fn();
    rewire$setUpDependencies(spy);

    await init(song, mockDispatch, () => newState);

    expect(spy).toHaveBeenCalledTimes(0);

    rewire$getState(() => mockState);
  });
});

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
    rewire$doTick(spy);

    onMetronomeMessage({ songData: 'mock!' })({ data: 'tick' });

    expect(spy.mock.calls[0][0]).toEqual({ songData: 'mock!' });
    expect(spy.mock.calls[0][1]).toEqual(120);
    expect(spy.mock.calls[0][2]).toEqual(20);
    expect(spy.mock.calls[0][3]).toEqual(15);
  });

  it('should not call doTick if not a tick event', () => {
    const spy = jest.fn();
    rewire$doTick(spy);

    onMetronomeMessage({ songData: 'mock!' })({ data: 'not tick' });

    expect(spy).toHaveBeenCalledTimes(0);
  });
});

describe('onMetronomeMessage', () => {
  it('on tick event should call doTick with correct params', () => {
    const spy = jest.fn();
    rewire$doTick(spy);

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
    rewire$triggerSounds(spy);

    doTick({ songData: 'mock!' }, 120, 20, 15);

    expect(spy.mock.calls[0][0]).toEqual({ songData: 'mock!' });
    expect(spy.mock.calls[0][1]).toEqual(20);
    expect(spy.mock.calls[0][2]).toEqual(120);
    expect(spy.mock.calls[0][3]).toEqual(15);
  });

  it("shouldn't call triggerSounds if next next beat is not due", async () => {
    const spy = jest.fn();
    rewire$triggerSounds(spy);

    doTick(song, 120, 105, 15);

    expect(spy.mock.calls.length).toBe(0);
  });

  it('should call calculateNextBeatTime with correct params if next beat is due', async () => {
    const spy = jest.fn();
    rewire$calculateNextBeatTime(spy);

    doTick(song, 120, 20, 15);

    expect(spy.mock.calls[0][0]).toEqual(120);
    expect(spy.mock.calls[0][1]).toEqual(20);
  });

  it('should call incrementBeat with correct params if next beat is due', async () => {
    const spy = jest.fn();
    rewire$incrementBeat(spy);

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

describe('togglePlay', () => {
  it('should call playSilentBuffer function', () => {
    const spy = jest.fn();
    rewire$playSilentBuffer(spy);

    togglePlay(true)();

    expect(spy.mock.calls.length).toBe(1);
  });

  it('should dispatch SET_IS_PLAYING action', () => {
    rewire$playSilentBuffer(() => {});

    togglePlay(true)();

    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: 'SET_IS_PLAYING',
      value: false
    });
  });

  it('should send metronome stop message if currently playing', async () => {
    const dependencies = await setUpDependencies();
    dependencies.metronome.postMessage.mockReset();
    rewire$playSilentBuffer(() => {});

    togglePlay(true)();

    expect(dependencies.metronome.postMessage.mock.calls[0][0]).toBe('stop');
  });

  it('should send metronome start message if currently stopped', async () => {
    const dependencies = await setUpDependencies();
    dependencies.metronome.postMessage.mockReset();
    rewire$playSilentBuffer(() => {});

    togglePlay(false)();

    expect(dependencies.metronome.postMessage.mock.calls[0][0]).toBe('start');
  });

  it('should dispatch SET_BEAT_NUMBER action if currently stopped', async () => {
    const dependencies = await setUpDependencies();
    dependencies.metronome.postMessage.mockReset();
    rewire$playSilentBuffer(() => {});

    togglePlay(false)();

    expect(mockDispatch.mock.calls[1][0]).toEqual({
      type: 'SET_BEAT_NUMBER',
      value: 0
    });
  });

  it('should dispatch SET_NEXT_BEAT_TIME action if currently stopped', async () => {
    const dependencies = await setUpDependencies();
    dependencies.metronome.postMessage.mockReset();
    rewire$playSilentBuffer(() => {});

    togglePlay(false)();

    expect(mockDispatch.mock.calls[2][0]).toEqual({
      type: 'SET_NEXT_BEAT_TIME',
      value: 100
    });
  });
});

describe('triggerSounds', () => {
  const mockSongData = {
    drums: [[{ data: 'mock drum 1' }, { data: 'mock drum 2' }]],
    bass: [[{ data: 'mock bass' }]],
    polySynth: [[{ data: 'mock polysynth' }]]
  };

  it('should call playSample with the current time', async () => {
    rewire$playNote(() => () => {});

    const spy = jest.fn();
    rewire$playSample(param => {
      spy(param);
      return () => {};
    });

    triggerSounds(mockSongData, 50, 120, 0);

    expect(spy.mock.calls[0][0]).toBe(50);
  });

  it('should call function returned from playSample with the drum data', async () => {
    rewire$playNote(() => () => {});

    const spy = jest.fn();
    rewire$playSample(() => spy);

    triggerSounds(mockSongData, 50, 120, 0);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy.mock.calls[0][0].data).toBe('mock drum 1');
    expect(spy.mock.calls[1][0].data).toBe('mock drum 2');
  });

  it('should call playNote twice with the current time and tempo', async () => {
    rewire$playSample(() => () => {});

    const spy = jest.fn();
    rewire$playNote((param1, param2) => {
      spy(param1, param2);
      return () => {};
    });

    triggerSounds(mockSongData, 50, 120, 0);

    expect(spy.mock.calls[0][0]).toBe(50);
    expect(spy.mock.calls[0][1]).toBe(120);
    expect(spy.mock.calls[1][0]).toBe(50);
    expect(spy.mock.calls[0][1]).toBe(120);
  });

  it('should call function return from playNote with the bass and polysynth data', async () => {
    rewire$playSample(() => () => {});

    const spy = jest.fn();
    rewire$playNote(() => spy);

    triggerSounds(mockSongData, 50, 120, 0);

    expect(spy.mock.calls[0][0].data).toBe('mock bass');
    expect(spy.mock.calls[1][0].data).toBe('mock polysynth');
  });
});

describe('playSample', () => {
  it('should call source.connect with audio context destination', async () => {
    const dependencies = await setUpDependencies();
    dependencies.audioContext.createBufferSource.mockClear();
    bufferSourceStart.mockReset();

    playSample(50)({ type: 'kick' });

    expect(bufferSourceConnect.mock.calls[0][0]).toBe('mockDestination');
  });

  it('should call source.start with current time', async () => {
    const dependencies = await setUpDependencies();
    dependencies.audioContext.createBufferSource.mockClear();
    bufferSourceStart.mockReset();

    playSample(50)({ type: 'kick' });

    expect(bufferSourceStart.mock.calls[0][0]).toBe(50);
  });
});

describe('playNote', () => {
  it('should call audioContext.createOscillator with sawtooth sound', async () => {
    const dependencies = await setUpDependencies();
    dependencies.audioContext.createOscillator.mockClear();

    playNote(100, 120)({ note: 200, octave: -1 });

    expect(dependencies.audioContext.createOscillator).toHaveBeenCalled();
    expect(oscillator.type).toBe('sawtooth');
  });

  it('should create gain node', async () => {
    const dependencies = await setUpDependencies();
    dependencies.audioContext.createGain.mockClear();

    playNote(100, 120)({ note: 200, octave: -1 });

    expect(dependencies.audioContext.createGain).toHaveBeenCalled();
    expect(gainNode.gain.value).toBe(0.08);
  });

  it('should connect gain node to oscillator', () => {
    oscillator.connect.mockReset();

    playNote(100, 120)({ note: 200, octave: -1 });

    expect(oscillator.connect.mock.calls[0][0]).toEqual(gainNode);
  });

  it('should connect gain node to destination', () => {
    gainNode.connect.mockReset();

    playNote(100, 120)({ note: 200, octave: -1 });

    expect(gainNode.connect.mock.calls[0][0]).toBe('mockDestination');
  });

  it('should set note frequency', () => {
    rewire$getNoteFreq(() => 200);

    playNote(100, 120)({ note: 200, octave: -1 });

    expect(oscillator.frequency.value).toBe(200);
  });

  it('should trigger oscillator start', () => {
    oscillator.start.mockReset();

    playNote(100, 120)({ note: 200, octave: -1 });

    expect(oscillator.start.mock.calls[0][0]).toBe(100);
  });

  it('should trigger oscillator stop', () => {
    oscillator.stop.mockReset();
    rewire$getDuration(() => 2);

    playNote(100, 120)({ note: 200, octave: -1 });

    expect(oscillator.stop.mock.calls[0][0]).toBe(102);
  });

  it('should call getDuration with correct params', () => {
    const spy = jest.fn();
    rewire$getDuration(spy);

    playNote(100, 120)({ note: 200, octave: -1 });

    expect(spy.mock.calls[0][0]).toEqual({ note: 200, octave: -1 });
    expect(spy.mock.calls[0][1]).toBe(120);
  });
});

describe('getNoteFreq', () => {
  it('should return frequency using octave', () => {
    const freq = getNoteFreq({ note: 200, octave: -1 });
    expect(freq).toBe(100);
  });

  it('should return frequency if octave is not present', () => {
    const freq = getNoteFreq({ note: 200 });
    expect(freq).toBe(200);
  });
});

describe('getDuration', () => {
  it('should return duration based on tempo and note length', () => {
    const duration = getDuration({ duration: 2 }, 120);
    expect(duration).toBe(0.25);
  });
});

describe('playKick', () => {
  it('should call playSample with the correct params', () => {
    const spy = jest.fn();
    rewire$playSample(param1 => {
      spy(param1);
      return () => {};
    });

    playKick();

    expect(spy.mock.calls[0][0]).toBe(0);
  });

  it('should call function returned by playSample with the correct params', () => {
    const spy = jest.fn();
    rewire$playSample(() => spy);

    playKick();

    expect(spy.mock.calls[0][0]).toEqual({ type: 'kick' });
  });
});

describe('playSnare', () => {
  it('should call playSample with the correct params', () => {
    const spy = jest.fn();
    rewire$playSample(param1 => {
      spy(param1);
      return () => {};
    });

    playSnare();

    expect(spy.mock.calls[0][0]).toBe(0);
  });

  it('should call function returned by playSample with the correct params', () => {
    const spy = jest.fn();
    rewire$playSample(() => spy);

    playSnare();

    expect(spy.mock.calls[0][0]).toEqual({ type: 'snare' });
  });
});

describe('playC', () => {
  it('should call playNote with the correct params', () => {
    const spy = jest.fn();
    rewire$playNote((param1, param2) => {
      spy(param1, param2);
      return () => {};
    });

    playC();

    expect(spy.mock.calls[0][0]).toBe(100);
    expect(spy.mock.calls[0][1]).toBe(120);
  });

  it('should call function returned by playNote with correct params', () => {
    const spy = jest.fn();
    rewire$playNote(() => spy);

    playC();

    expect(spy.mock.calls[0][0].note).toBe(261.6);
    expect(spy.mock.calls[0][0].octave).toBe(-1);
    expect(spy.mock.calls[0][0].duration).toBe(6);
  });
});

describe('playChord', () => {
  it('should call playNote with the correct params', () => {
    const spy = jest.fn();
    rewire$playNote((param1, param2) => {
      spy(param1, param2);
      return () => {};
    });

    playChord();

    expect(spy.mock.calls[0][0]).toBe(100);
    expect(spy.mock.calls[0][1]).toBe(120);
  });

  it('should call function returned by playNote three times', () => {
    const spy = jest.fn();
    rewire$playNote(() => spy);

    playChord();

    expect(spy).toHaveBeenCalledTimes(3);
  });
});

describe('playSilentBuffer', () => {
  it('if locked should call audioContext.createBuffer with correct params', async () => {
    const dependencies = await setUpDependencies();
    dependencies.audioContext.createBuffer.mockReset();
    dependencies.audioContext.createBufferSource.mockClear();

    const newState = {
      ...mockState,
      settings: { unlocked: false }
    };
    rewire$getState(() => newState);

    playSilentBuffer();

    expect(dependencies.audioContext.createBuffer.mock.calls[0][0]).toBe(1);
    expect(dependencies.audioContext.createBuffer.mock.calls[0][1]).toBe(1);
    expect(dependencies.audioContext.createBuffer.mock.calls[0][2]).toBe(22050);

    rewire$getState(() => mockState);
  });

  it('if locked should call audioContext.createBufferSource', async () => {
    const dependencies = await setUpDependencies();
    dependencies.audioContext.createBuffer = jest.fn();
    dependencies.audioContext.createBufferSource.mockClear();

    const newState = {
      ...mockState,
      settings: { unlocked: false }
    };
    rewire$getState(() => newState);

    playSilentBuffer();

    expect(dependencies.audioContext.createBufferSource).toHaveBeenCalled();

    rewire$getState(() => mockState);
  });

  it('if locked node.start should be called with correct params', async () => {
    const dependencies = await setUpDependencies();
    dependencies.audioContext.createBuffer = jest.fn();
    dependencies.audioContext.createBufferSource.mockClear();
    bufferSourceStart.mockReset();

    const newState = {
      ...mockState,
      settings: { unlocked: false }
    };
    rewire$getState(() => newState);

    playSilentBuffer();

    expect(bufferSourceStart.mock.calls[0][0]).toBe(0);

    rewire$getState(() => mockState);
  });

  it('if locked should dispatch SET_UNLOCKED action', async () => {
    const dependencies = await setUpDependencies();
    dependencies.audioContext.createBuffer = jest.fn();
    dependencies.audioContext.createBufferSource.mockClear();
    mockDispatch.mockReset();

    const newState = {
      ...mockState,
      settings: { unlocked: false }
    };
    rewire$getState(() => newState);

    playSilentBuffer();

    expect(mockDispatch.mock.calls[0][0]).toEqual({
      type: 'SET_UNLOCKED',
      value: true
    });

    rewire$getState(() => mockState);
  });

  it('if unlocked then createBuffer should not be called', async () => {
    const newState = {
      ...mockState,
      settings: { unlocked: true }
    };
    rewire$getState(() => newState);

    const dependencies = await setUpDependencies();
    dependencies.audioContext.createBuffer = jest.fn();

    playSilentBuffer();

    expect(dependencies.audioContext.createBuffer).toHaveBeenCalledTimes(0);

    rewire$getState(() => mockState);
  });
});
