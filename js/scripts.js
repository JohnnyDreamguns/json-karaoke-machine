// Create consts
const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioContext;
try{
  audioContext = new AudioContext();
}
catch{}


const audioElement = document.querySelector("audio");
const track = audioContext.createMediaElementSource(audioElement);
const playButton = document.querySelector("button");
const gainNode = audioContext.createGain();

const volumeControl = document.querySelector("#volume");

const pannerControl = document.querySelector('#panner');

const pannerOptions = { pan: 0 };
const panner = new StereoPannerNode(audioContext, pannerOptions);

// Event listeners
playButton.addEventListener(
  "click",
  function() {
    // check if context is in suspended state (autoplay policy)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }

    // play or pause track depending on state
    if (this.dataset.playing === "false") {
      audioElement.play();
      this.dataset.playing = "true";
    } else if (this.dataset.playing === "true") {
      audioElement.pause();
      this.dataset.playing = "false";
    }
  },
  false
);

volumeControl.addEventListener(
  "input",
  function() {
    gainNode.gain.value = this.value;
  },
  false
);

pannerControl.addEventListener('input', function() {
  panner.pan.value = this.value;
}, false);


// Connect
track.connect(gainNode).connect(panner).connect(audioContext.destination);
