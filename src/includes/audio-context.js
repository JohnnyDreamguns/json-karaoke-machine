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
    return instance;
  },
  resetInstance: () => {
    instance = undefined;
  }
};
