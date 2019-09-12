import 'babel-polyfill';
import samples from '../data/samples';
import * as audioContext from './audio-context';
import * as metronome from './metronome/index';
import * as samplesBuffer from './samples-buffer';
import { setUpDependencies, configureMetronome } from './music-machine';

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

afterEach(() => {});

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
  it('should ', async () => {
    const dependencies = await setUpDependencies();
    configureMetronome();
    expect(typeof dependencies.metronome.onmessage).toBe('function');
  });
});
