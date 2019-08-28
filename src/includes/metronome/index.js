export const Metronome = (() => {
  let instance;

  const createInstance = () => {
    return new Worker('metronome-worker.js');
  };

  return {
    getInstance: () => {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();
