import samples from '../data/samples';
import { Context } from './audio-context';

let loadCount = 0;
const bufferList = [];

export const SamplesBuffer = (() => {
  let instance;

  const createInstance = () => load([samples.kick, samples.snare]);

  return {
    getInstance: async () => {
      if (!instance) {
        instance = await createInstance().catch(err => {
          console.log(err);
        });
      }
      return instance;
    }
  };
})();

const load = urlList => {
  return new Promise((resolve, reject) => {
    urlList.forEach(loadBuffer(resolve, reject));
  });
};

const loadBuffer = (resolve, reject) => (url, i, urlList) => {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = decode(request, urlList, i, resolve, reject);

  request.send();
};

const decode = (request, urlList, i, resolve, reject) => () => {
  const audioContext = Context.getInstance();

  audioContext.decodeAudioData(
    request.response,
    success(urlList, i, resolve),
    error(reject)
  );
};

const success = (urlList, i, resolve) => buffer => {
  if (!buffer) {
    return;
  }
  bufferList[i] = buffer;

  if (++loadCount === urlList.length) {
    resolve(bufferList);
  }
};

const error = reject => () => {
  reject('Error loading drum samples');
};
