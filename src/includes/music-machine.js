import { SamplesBuffer } from './samples-buffer';
import { Context } from './audio-context';
import { Metronome } from './metronome/index';
import { store } from '../store';
import {
  setIsPlaying,
  setBeatNumber,
  setIsInitialised,
  setNextBeatTime,
  setUnlocked
} from '../actions/index';
import types from '../data/sound-types';
import { showError } from './error-handler';

// Set up song data, audio context and metronome
export const init = async songData => {
  if (getState('IsInitialised')) return;
  store.dispatch(setIsInitialised(true));

  const context = Context.getInstance();
  const metronome = Metronome.getInstance();
  const buffer = await SamplesBuffer.getInstance();

  if (!context || !metronome || !buffer) {
    showError('Error reported, sorry for the inconvenience');
    return;
  }

  configureMetronome(songData);
};

// Fetch data from the redux store
const getState = name => {
  return store.getState().settings[name];
};

// The metronome trigges the clock ticks
const configureMetronome = songData => {
  const metronome = Metronome.getInstance();

  metronome.onmessage = e => {
    if (e.data == 'tick') {
      doTick(songData);
    }
  };

  const lookAhead = 25.0;
  metronome.postMessage({ interval: lookAhead });
};

// Using timing data from the metronome, sounds are triggered when the next beat is due
const doTick = songData => {
  const audioContext = Context.getInstance();
  const scheduleAheadTime = 0.1;
  const nextBeatTime = getState('nextBeatTime');

  if (audioContext.currentTime + scheduleAheadTime > nextBeatTime) {
    triggerSounds(songData, nextBeatTime);
    calculateNextBeatTime();
    incrementBeat();
  }
};

const calculateNextBeatTime = () => {
  store.dispatch(
    setNextBeatTime(
      getState('nextBeatTime') + 0.25 * (60.0 / getState('tempo'))
    )
  );
};

const incrementBeat = () => {
  store.dispatch(setBeatNumber(getState('beatNumber') + 1));
};

// Tells the metronome to start and stop
export const togglePlay = () => {
  playSilentBuffer(); // Fix for issue with Safari

  const audioContext = Context.getInstance();
  const metronome = Metronome.getInstance();

  const isPlaying = getState('isPlaying');
  store.dispatch(setIsPlaying(!isPlaying));

  if (getState('isPlaying')) {
    store.dispatch(setBeatNumber(0));
    store.dispatch(setNextBeatTime(audioContext.currentTime));
    metronome.postMessage('start');
  } else {
    metronome.postMessage('stop');
  }
};

// Called every beat, triggers sounds
const triggerSounds = (songData, time) => {
  const beatNumber = getState('beatNumber');

  // Drums
  if (songData.drums[beatNumber] && songData.drums[beatNumber].length > 0) {
    playDrums(songData.drums[beatNumber], time);
  }

  // Bass
  if (songData.bass[beatNumber] && songData.bass[beatNumber].length > 0) {
    playOscillatorNotes(songData.bass[beatNumber], time);
  }

  // PolySynth
  if (
    songData.polySynth[beatNumber] &&
    songData.polySynth[beatNumber].length > 0
  ) {
    playOscillatorNotes(songData.polySynth[beatNumber], time);
  }
};

// Trigger drum samples from buffered .wav audio files
const playDrums = async (listOfDrumsToPlay, time) => {
  const samplesBuffer = await SamplesBuffer.getInstance();
  if (!samplesBuffer) return;

  listOfDrumsToPlay.forEach(sound => {
    if (sound.type == types.KICK) playSound(samplesBuffer[0], time);
    if (sound.type == types.SNARE) playSound(samplesBuffer[1], time);
  });
};

// Plays a buffered sample at a specified time
const playSound = (buffer, time) => {
  const audioContext = Context.getInstance();

  var source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  source.start(time);
};

// Schedule an array of notes to be played by an oscillator
// at specified times and durations
const playOscillatorNotes = (listOfNotes, time) => {
  const audioContext = Context.getInstance();

  listOfNotes.forEach(noteToPlay => {
    let noteFreq = getNoteFreq(noteToPlay);
    let duration = getDuration(noteToPlay);

    let osc = audioContext.createOscillator();
    osc.type = 'sawtooth';
    var gainNode = audioContext.createGain();
    gainNode.gain.value = 0.08;
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.frequency.value = noteFreq;
    osc.start(time);
    osc.stop(time + duration);
  });
};

// Calculate the frequency of a note based on it's octave
const getNoteFreq = noteData => {
  if (!noteData.hasOwnProperty('octave')) {
    return noteData.note;
  } else {
    return noteData.note * Math.pow(2, noteData.octave);
  }
};

// Calculate the duration based on the current tempo
const getDuration = noteToPlay => {
  return (60.0 / getState('tempo')) * noteToPlay.duration * 0.25;
};

// Methods below are used on the About page
// ----------------------------------------

// Play a kick sound
export const playKick = async () => {
  const samplesBuffer = await SamplesBuffer.getInstance();

  const kick = samplesBuffer[0];
  playSound(kick, 0);
};

// Play a snare sound
export const playSnare = async () => {
  const samplesBuffer = await SamplesBuffer.getInstance();
  if (!samplesBuffer) return;

  const snare = samplesBuffer[1];
  playSound(snare, 0);
};

// Play a single oscillator note
export const playSingleNote = () => {
  const audioContext = Context.getInstance();

  let osc = audioContext.createOscillator();
  osc.type = 'triangle';
  var gainNode = audioContext.createGain();
  gainNode.gain.value = 0.08;
  osc.connect(gainNode);
  gainNode.connect(audioContext.destination);

  osc.frequency.value = 230.8;
  osc.start();

  setTimeout(() => {
    osc.stop();
  }, 1000);
};

// Play a chord of notes
export const playChord = () => {
  const audioContext = Context.getInstance();
  const chord = [392, 493.9, 293.7];

  chord.forEach(freq => {
    let osc = audioContext.createOscillator();
    osc.type = 'sawtooth';
    var gainNode = audioContext.createGain();
    gainNode.gain.value = 0.08;
    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.frequency.value = freq;
    osc.start();

    setTimeout(() => {
      osc.stop();
    }, 1000);
  });
};

// Fixes issue with Safari
const playSilentBuffer = () => {
  if (getState('unlocked')) return;

  const audioContext = Context.getInstance();

  var buffer = audioContext.createBuffer(1, 1, 22050);
  var node = audioContext.createBufferSource();
  node.buffer = buffer;
  node.start(0);

  store.dispatch(setUnlocked(true));
};
