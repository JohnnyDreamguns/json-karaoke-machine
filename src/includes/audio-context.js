import { showError } from './error-handler';

let instance;

export const createInstance = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return new AudioContext();
};

export const Context = {
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
