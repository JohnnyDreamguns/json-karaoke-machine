export const Context = (() => {
  let instance;

  const createInstance = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    return new AudioContext();
  };

  return {
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
})();
