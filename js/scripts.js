require('../samples/kick.wav');
require('../samples/snare.wav');
require('../samples/hihat.wav');

var myBuffer = null;
// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

const playButton = document.querySelector("button");

function BufferLoader(context, urlList, callback) {
  this.context = context;
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



function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      '/kick.a2ba9073.wav',
      '/snare.7c5d27d5.wav',
      '/hihat.774addd9.wav'
    ],
    finishedLoading
    );

  bufferLoader.load();
}

function finishedLoading(bufferList){
  playButton.removeAttribute('disabled');

  playButton.addEventListener(
    "click",
    function() {
      playButton.setAttribute('disabled', 'disabled');
      playButton.innerHTML = "Playing";
      playDrumLoop(bufferList);
    },
    false
  );
}

function playDrumLoop(bufferList){
  const kick = bufferList[0];
  const snare = bufferList[1];
  const hihat = bufferList[2];

  var startTime = context.currentTime + 0.100;
  var tempo = 120; // BPM (beats per minute)
  var eighthNoteTime = (60 / tempo) / 2;

  for (var bar = 0; bar < 32; bar++) {
    var time = startTime + bar * 8 * eighthNoteTime;
    // Play the bass (kick) drum on beats 1, 5
    playSound(kick, time);
    playSound(kick, time + 4 * eighthNoteTime);
  
    // Play the snare drum on beats 3, 7
    playSound(snare, time + 2 * eighthNoteTime);
    playSound(snare, time + 6 * eighthNoteTime);
  
    // Play the hi-hat every eighth note.
    for (var i = 0; i < 8; ++i) {
      playSound(hihat, time + i * eighthNoteTime);
    }
  }
}

function playSound(buffer, time) {
  var source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  if (!source.start)
    source.start = source.noteOn;
  source.start(time);
}

init();