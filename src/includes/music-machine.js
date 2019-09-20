import { SamplesBuffer } from './samples-buffer';
import { Context } from './audio-context';
import { Metronome } from './metronome/index';
import {
  setIsPlaying,
  setBeatNumber,
  setIsInitialised,
  setNextBeatTime,
  setUnlocked
} from '../actions/index';
import { showError } from './error-handler';
import types from '../data/sound-types';
import notes from '../data/note-frequencies';

export let dispatch;
export let getState;
let audioContext, metronome, samplesBuffer;

// Fetch data from the redux store
const state = name => getState().settings[name];

// Set up song data, audio context and metronome
export const init = async (songData, d, gs) => {
  dispatch = d;
  getState = gs;

  if (!dispatch || !getState) {
    showError('Error reported, sorry for the inconvenience');
    return;
  }

  if (state('IsInitialised')) return;

  await setUpDependencies();

  if (!audioContext || !metronome || !samplesBuffer) {
    showError('Error reported, sorry for the inconvenience');
    return;
  }

  dispatch(setIsInitialised(true));
  configureMetronome(songData);
};

export const setUpDependencies = async () => ({
  audioContext: (audioContext = Context.getInstance()),
  metronome: (metronome = Metronome.getInstance()),
  samplesBuffer: (samplesBuffer = await SamplesBuffer.getInstance())
});

// The metronome trigges the clock ticks
export const configureMetronome = songData => {
  metronome.onmessage = onMetronomeMessage(songData);

  const lookAhead = 25.0;
  metronome.postMessage({ interval: lookAhead });
};

export const onMetronomeMessage = songData => e => {
  if (e.data == 'tick') {
    doTick(
      songData,
      state('tempo'),
      state('nextBeatTime'),
      state('beatNumber')
    );
  }
};

// Using timing data from the metronome, sounds are triggered when the next beat is due
export const doTick = (songData, tempo, nextBeatTime, beatNumber) => {
  const scheduleAheadTime = 0.1;

  if (audioContext.currentTime + scheduleAheadTime > nextBeatTime) {
    triggerSounds(songData, nextBeatTime, tempo, beatNumber);
    calculateNextBeatTime(tempo, nextBeatTime);
    incrementBeat(beatNumber);
  }
};

export const calculateNextBeatTime = (tempo, nextBeatTime) => {
  dispatch(setNextBeatTime(nextBeatTime + 0.25 * (60.0 / tempo)));
};

export const incrementBeat = beatNumber => {
  dispatch(setBeatNumber(beatNumber + 1));
};

// Tells the metronome to start and stop
export const togglePlay = isPlaying => () => {
  playSilentBuffer(); // Fix for issue with Safari
  dispatch(setIsPlaying(!isPlaying));

  if (!isPlaying) {
    dispatch(setBeatNumber(0));
    dispatch(setNextBeatTime(audioContext.currentTime));
    metronome.postMessage('start');
  } else {
    metronome.postMessage('stop');
  }
};

// Called every beat, triggers sounds
export const triggerSounds = (songData, time, tempo, beatNumber) => {
  songData.drums[beatNumber].forEach(playSample(time));
  songData.bass[beatNumber].forEach(playNote(time, tempo));
  songData.polySynth[beatNumber].forEach(playNote(time, tempo));
};

// Plays a buffered sample at a specified time
export const playSample = time => sound => {
  var source = audioContext.createBufferSource();
  source.buffer = samplesBuffer[sound.type];
  source.connect(audioContext.destination);
  source.start(time);
};

// Schedule a note to be played by an oscillator
// at a specified time and duration
export const playNote = (time, tempo) => noteToPlay => {
  const osc = audioContext.createOscillator();
  osc.type = 'sawtooth';

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.08;
  osc.connect(gainNode);
  gainNode.connect(audioContext.destination);

  osc.frequency.value = getNoteFreq(noteToPlay);
  osc.start(time);
  osc.stop(time + getDuration(noteToPlay, tempo));
};

// Calculate the frequency of a note based on it's octave
export const getNoteFreq = noteData =>
  !noteData.hasOwnProperty('octave')
    ? noteData.note
    : noteData.note * Math.pow(2, noteData.octave);

// Calculate the duration based on the current tempo
export const getDuration = (noteToPlay, tempo) =>
  (60.0 / tempo) * noteToPlay.duration * 0.25;

// Methods below are used on the About page
// ----------------------------------------

export const playKick = () => {
  playSample(0)({ type: types.KICK });
};

export const playSnare = () => {
  playSample(0)({ type: types.SNARE });
};

export const playC = () => {
  playNote(audioContext.currentTime, 120)({
    note: notes.C,
    octave: -1,
    duration: 6
  });
};

export const playChord = () => {
  const chord = [
    {
      note: 392,
      octave: 0,
      duration: 6
    },
    {
      note: 493.9,
      octave: 0,
      duration: 6
    },
    {
      note: 293.7,
      octave: 0,
      duration: 6
    }
  ];

  chord.forEach(playNote(audioContext.currentTime, 120));
};

// Fixes issue with Safari
export const playSilentBuffer = () => {
  if (state('unlocked')) return;

  var buffer = audioContext.createBuffer(1, 1, 22050);
  var node = audioContext.createBufferSource();
  node.buffer = buffer;
  node.start(0);

  dispatch(setUnlocked(true));
};
