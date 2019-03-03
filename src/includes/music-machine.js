import bufferLoader from "../includes/buffer-loader";
import samples from "../data/samples";
import types from "../data/sound-types";

let songData = [];
let tempo = 120;
let numberOfBars = 0;
let audioContext = null;
let unlocked = false;
let isPlaying = false;
let currentNote = null;
const lookahead = 25.0; 
const scheduleAheadTime = 0.1;
let nextNoteTime = 0.0;
const noteResolution = 0;
const notesInQueue = [];
let timerWorker = null;
let samplesBuffer = null;
let secondsPerBeat = null;
let setBeatNumber = null; 

export const init = (data, callbacks) => {
  if(songData.length == 0){
    songData = data;
    setBeatNumber = callbacks.setBeatNumber;
    numberOfBars = songData.drums.length;
    audioContext = new AudioContext();
    secondsPerBeat = 60.0 / tempo;
    const buffLoader = createBuffLoader();
    buffLoader.load();
    initTimerWorker();
  }
}

const createBuffLoader = () => {
  return new bufferLoader(
    audioContext,
    [samples.kick, samples.snare, samples.hihat, samples.hihat2, samples.cymbal],
    finishedLoading
  );
}

const initTimerWorker = () => {
  timerWorker = new Worker("metronomeworker.js");

  timerWorker.onmessage = function(e) {
    if (e.data == "tick") {
      scheduler();
    } else console.log("message: " + e.data);
  };
  timerWorker.postMessage({ interval: lookahead });
}

const finishedLoading = (bufferList) => {
  samplesBuffer = bufferList;
}

const playSound = (buffer, time) => {
  var source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  if (!source.start) source.start = source.noteOn;
  source.start(time);
}

export const play = () => {
  if (!unlocked) playSilentBuffer();

  isPlaying = !isPlaying;

  if (isPlaying) {
    currentNote = 0;
    nextNoteTime = audioContext.currentTime;
    timerWorker.postMessage("start");
    return "stop";
  } else {
    timerWorker.postMessage("stop");
    return "play";
  }
}

const playSilentBuffer = () => {
  var buffer = audioContext.createBuffer(1, 1, 22050);
  var node = audioContext.createBufferSource();
  node.buffer = buffer;
  node.start(0);
  unlocked = true;
}

const nextNote = () => {
  secondsPerBeat = 60.0 / tempo; 
  nextNoteTime += 0.25 * secondsPerBeat; 

  currentNote++; // Advance the beat number, wrap to zero
  setBeatNumber(currentNote);
  if (currentNote == numberOfBars) {
    currentNote = 0;
  }
}

const scheduleNote = (beatNumber, time) => {
  notesInQueue.push({ note: beatNumber, time: time });

  if (noteResolution == 1 && beatNumber % 2) return;
  if (noteResolution == 2 && beatNumber % 4) return; 

  if(songData.drums[beatNumber].length > 0) playDrums(songData.drums[beatNumber], time);
  
  if(songData.bass[beatNumber].length > 0) playOscillatorNote(songData.bass[beatNumber], time);

  if(songData.polySynth[beatNumber].length > 0) playOscillatorNote(songData.polySynth[beatNumber], time);
}

const playDrums = (listOfDrumsToPlay, time) => {
  const kick = samplesBuffer[0];
  const snare = samplesBuffer[1];
  const hihat = samplesBuffer[2];
  const hihat2 = samplesBuffer[3];
  const cymbal = samplesBuffer[4];

  listOfDrumsToPlay.forEach(sound => {
    if(sound.type == types.KICK) playSound(kick, time);
    if(sound.type == types.SNARE) playSound(snare, time);
    if(sound.type == types.HIHAT) playSound(hihat, time);
    if(sound.type == types.HIHAT2) playSound(hihat2, time);
    if(sound.type == types.CYMBAL) playSound(cymbal, time);
  });
}

const playOscillatorNote = (listOfNotes, time) => {

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
    osc.start( time );
    osc.stop( time + duration);

  });
}

const getNoteFreq = (noteData) => {
  if(!noteData.hasOwnProperty('octave')) return noteData.note;
  else return noteData.note * Math.pow(2, noteData.octave)
};

const getDuration = (noteToPlay) => {
  return secondsPerBeat * noteToPlay.duration * 0.25;
};

const scheduler = () => {
  // while there are notes that will need to play before the next interval,
  // schedule them and advance the pointer.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote(currentNote, nextNoteTime);
    nextNote();
  }
}

export const changeTempo = (newTempo) => {
  tempo = newTempo
};
