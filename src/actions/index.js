export const setTempo = tempo => ({
  type: 'SET_TEMPO',
  tempo
});

export const setBeatNumber = value => ({
  type: 'SET_BEAT_NUMBER',
  value
});

export const setIsPlaying = value => ({
  type: 'SET_IS_PLAYING',
  value
});

export const setCurrentLine = value => ({
  type: 'SET_CURRENT_LINE',
  value
});

export const setIsInitialised = value => ({
  type: 'SET_IS_INITIALISED',
  value
});

export const setNextBeatTime = value => ({
  type: 'SET_NEXT_BEAT_TIME',
  value
});

export const setUnlocked = value => ({
  type: 'SET_UNLOCKED',
  value
});
