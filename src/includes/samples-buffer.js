import samples from '../data/samples';
import { Context } from './audio-context';
import { showError } from './error-handler';

let instance;

export const createInstance = () => load(samples).catch(console.log);

export const SamplesBuffer = {
  getInstance: () => {
    if (!instance) {
      instance = createInstance();
    }
    if (!instance) {
      showError('Error reported, sorry for the inconvenience');
      return;
    }
    return instance;
  },
  resetInstance: () => {
    instance = undefined;
  }
};

export const load = urlList =>
  Object.keys(urlList).reduce(
    async (acc, curr) => ({
      ...(await acc),
      [curr]: await loadBuffer(urlList[curr])
    }),
    Promise.resolve({})
  );

export const loadBuffer = url => {
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    request.onload = decode(request, resolve, reject);
    request.send();
  });
};

export const decode = (request, resolve, reject) => () => {
  const audioContext = Context.getInstance();
  audioContext.decodeAudioData(
    request.response,
    success(resolve),
    error(reject)
  );
};

export const success = resolve => buffer => {
  if (!buffer) return;
  resolve(buffer);
};

export const error = reject => () => {
  reject('Error loading drum samples');
};
