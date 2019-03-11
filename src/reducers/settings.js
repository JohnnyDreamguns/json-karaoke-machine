const settings = (state = { tempo: 120, beatNumber: 0, isPlaying: false }, action) => {
  switch (action.type) {
    case 'SET_TEMPO':
      return Object.assign({}, state, { tempo: action.tempo });

    case 'SET_BEAT_NUMBER':
      return Object.assign({}, state, { beatNumber: action.value });
      
    case 'SET_IS_PLAYING':
    return Object.assign({}, state, { isPlaying: action.value });

    default:
      return state
  }
}

export default settings