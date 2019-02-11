const kick = require('/samples/kick.wav');
const snare = require('/samples/snare.wav');
const hihat = require('/samples/hihat.wav');
const hihat2 = require('/samples/hihat2.wav');
const cymbal = require('/samples/cy.wav');

var audioContext = null;
var unlocked = false;
var isPlaying = false;      // Are we currently playing?
var startTime;              // The start time of the entire sequence.
var current16thNote;        // What note is currently last scheduled?
var tempo = 120;          // tempo (in beats per minute)
var lookahead = 25.0;       // How frequently to call scheduling function 
                            //(in milliseconds)
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps 
                            // with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.
var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var noteLength = 0.05;      // length of "beep" (in seconds)
var canvas,                 // the canvas element
    canvasContext;          // canvasContext is the canvas' context 2D
var last16thNoteDrawn = -1; // the last "box" we drew on the screen
var notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages
var samplesBuffer = null;



function BufferLoader(context, urlList, callback) {
    this.context = audioContext;
    this.urlList = urlList;
    this.onload = callback;
    this.bufferList = new Array();
    this.loadCount = 0;
  }
  
  BufferLoader.prototype.loadBuffer = function(url, index) {
    // Load buffer asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";
  
    var loader = this;
  
    request.onload = function() {
      // Asynchronously decode the audio file data in request.response
      loader.context.decodeAudioData(
        request.response,
        function(buffer) {
          if (!buffer) {
            alert('error decoding file data: ' + url);
            return;
          }
          loader.bufferList[index] = buffer;
          if (++loader.loadCount == loader.urlList.length)
            loader.onload(loader.bufferList);
        },
        function(error) {
          console.error('decodeAudioData error', error);
        }
      );
    }
  
    request.onerror = function() {
      alert('BufferLoader: XHR error');
    }
  
    request.send();
  }
  
  BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
  }










function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT 
                                          // tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    current16thNote++;    // Advance the beat number, wrap to zero
    if (current16thNote == 32) {
        current16thNote = 0;
    }
}

function scheduleNote( beatNumber, time ) {

    console.log(beatNumber);

    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );

    if ( (noteResolution==1) && (beatNumber%2))
        return; // we're not playing non-8th 16th notes
    if ( (noteResolution==2) && (beatNumber%4))
        return; // we're not playing non-quarter 8th notes

    // create an oscillator
    // var osc = audioContext.createOscillator();
    // osc.connect( audioContext.destination );
    // if (beatNumber % 16 === 0)    // beat 0 == high pitch
    //     osc.frequency.value = 880.0;
    // else if (beatNumber % 4 === 0 )    // quarter notes = medium pitch
    //     osc.frequency.value = 440.0;
    // else                        // other 16th notes = low pitch
    //     osc.frequency.value = 220.0;

    // console.log(time);

    // osc.start( time );
    // osc.stop( time + noteLength );

    const kick = samplesBuffer[0];
    const snare = samplesBuffer[1];
    const hihat = samplesBuffer[2];
    const hihat2 = samplesBuffer[3];
    const cymbal = samplesBuffer[4];

    if ([0,8,16,24].includes(beatNumber)) playSound(kick, time);
    if ([4,12,20,28].includes(beatNumber)) playSound(snare, time);
    if ([0,6,12,20,24,26,28].includes(beatNumber)) playSound(hihat, time);
    if ([2,10,16,26].includes(beatNumber)) playSound(hihat2, time);
    if ([0,26].includes(beatNumber)) playSound(cymbal, time);
}

function scheduler() {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleNote( current16thNote, nextNoteTime );
        nextNote();
    }
}



function play() {
    if (!unlocked) {
      // play silent buffer to unlock the audio
      var buffer = audioContext.createBuffer(1, 1, 22050);
      var node = audioContext.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      unlocked = true;
    }

    isPlaying = !isPlaying;

    if (isPlaying) { // start playing
        current16thNote = 0;
        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }
}

function init(){

    // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
    // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
    // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
    // spec-compliant, and work on Chrome, Safari and Firefox.

    audioContext = new AudioContext();

    // if we wanted to load audio files, etc., this is where we should do it.
    bufferLoader = new BufferLoader(
        audioContext,
        [
          kick,
          snare,
          hihat,
          hihat2,
          cymbal
        ],
        finishedLoading
        );
    
      bufferLoader.load();


    timerWorker = new Worker("metronomeworker.js");

    timerWorker.onmessage = function(e) {
        if (e.data == "tick") {
            //console.log("tick!");
            scheduler();
        }
        else
            console.log("message: " + e.data);
    };
    timerWorker.postMessage({"interval":lookahead});
}

function finishedLoading(bufferList){
    samplesBuffer = bufferList;
}

function playSound(buffer, time) {
    var source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    if (!source.start)
      source.start = source.noteOn;
    source.start(time);
  }

window.addEventListener("load", init );

const playAnchor = document.querySelector('.play');
playAnchor.addEventListener('click', play);