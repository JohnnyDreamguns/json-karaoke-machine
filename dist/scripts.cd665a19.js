// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"js/scripts.js":[function(require,module,exports) {
var audioContext = null;
var unlocked = false;
var isPlaying = false; // Are we currently playing?

var startTime; // The start time of the entire sequence.

var current16thNote; // What note is currently last scheduled?

var tempo = 120; // tempo (in beats per minute)

var lookahead = 25.0; // How frequently to call scheduling function 
//(in milliseconds)

var scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)
// This is calculated from lookahead, and overlaps 
// with next interval (in case the timer is late)

var nextNoteTime = 0.0; // when the next note is due.

var noteResolution = 0; // 0 == 16th, 1 == 8th, 2 == quarter note

var noteLength = 0.05; // length of "beep" (in seconds)

var canvas, // the canvas element
canvasContext; // canvasContext is the canvas' context 2D

var last16thNoteDrawn = -1; // the last "box" we drew on the screen

var notesInQueue = []; // the notes that have been put into the web audio,
// and may or may not have played yet. {note, time}

var timerWorker = null; // The Web Worker used to fire timer messages

var samplesBuffer = null;

function BufferLoader(context, urlList, callback) {
  this.context = audioContext;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function (url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";
  var loader = this;

  request.onload = function () {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(request.response, function (buffer) {
      if (!buffer) {
        alert('error decoding file data: ' + url);
        return;
      }

      loader.bufferList[index] = buffer;
      if (++loader.loadCount == loader.urlList.length) loader.onload(loader.bufferList);
    }, function (error) {
      console.error('decodeAudioData error', error);
    });
  };

  request.onerror = function () {
    alert('BufferLoader: XHR error');
  };

  request.send();
};

BufferLoader.prototype.load = function () {
  for (var i = 0; i < this.urlList.length; ++i) {
    this.loadBuffer(this.urlList[i], i);
  }
};

function nextNote() {
  // Advance current note and time by a 16th note...
  var secondsPerBeat = 60.0 / tempo; // Notice this picks up the CURRENT 
  // tempo value to calculate beat length.

  nextNoteTime += 0.25 * secondsPerBeat; // Add beat length to last beat time

  current16thNote++; // Advance the beat number, wrap to zero

  if (current16thNote == 32) {
    current16thNote = 0;
  }
}

function scheduleNote(beatNumber, time) {
  console.log(beatNumber); // push the note on the queue, even if we're not playing.

  notesInQueue.push({
    note: beatNumber,
    time: time
  });
  if (noteResolution == 1 && beatNumber % 2) return; // we're not playing non-8th 16th notes

  if (noteResolution == 2 && beatNumber % 4) return; // we're not playing non-quarter 8th notes
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

  var kick = samplesBuffer[0];
  var snare = samplesBuffer[1];
  var hihat = samplesBuffer[2];
  var hihat2 = samplesBuffer[3];
  var cymbal = samplesBuffer[4];
  if ([0, 8, 16, 24].includes(beatNumber)) playSound(kick, time);
  if ([4, 12, 20, 28].includes(beatNumber)) playSound(snare, time);
  if ([0, 6, 12, 20, 24, 26, 28].includes(beatNumber)) playSound(hihat, time);
  if ([2, 10, 16, 26].includes(beatNumber)) playSound(hihat2, time);
  if ([0, 26].includes(beatNumber)) playSound(cymbal, time);
}

function scheduler() {
  // while there are notes that will need to play before the next interval, 
  // schedule them and advance the pointer.
  while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
    scheduleNote(current16thNote, nextNoteTime);
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

  if (isPlaying) {
    // start playing
    current16thNote = 0;
    nextNoteTime = audioContext.currentTime;
    timerWorker.postMessage("start");
    return "stop";
  } else {
    timerWorker.postMessage("stop");
    return "play";
  }
}

function init() {
  // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
  // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
  // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
  // spec-compliant, and work on Chrome, Safari and Firefox.
  audioContext = new AudioContext(); // if we wanted to load audio files, etc., this is where we should do it.

  bufferLoader = new BufferLoader(audioContext, ['/kick.wav', '/snare.wav', '/hihat.wav', '/hihat2.wav', '/cy.wav'], finishedLoading);
  bufferLoader.load();
  timerWorker = new Worker("/metronomeworker.d8bdb0f1.js");

  timerWorker.onmessage = function (e) {
    if (e.data == "tick") {
      //console.log("tick!");
      scheduler();
    } else console.log("message: " + e.data);
  };

  timerWorker.postMessage({
    "interval": lookahead
  });
}

function finishedLoading(bufferList) {
  samplesBuffer = bufferList;
}

function playSound(buffer, time) {
  var source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(audioContext.destination);
  if (!source.start) source.start = source.noteOn;
  source.start(time);
}

window.addEventListener("load", init);
var playAnchor = document.querySelector('.play');
playAnchor.addEventListener('click', play);
},{"./metronomeworker.js":[["metronomeworker.d8bdb0f1.js","js/metronomeworker.js"],"metronomeworker.d8bdb0f1.map","js/metronomeworker.js"]}],"../../.nvm/versions/node/v11.9.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49892" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../.nvm/versions/node/v11.9.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/scripts.js"], null)
//# sourceMappingURL=/scripts.cd665a19.map