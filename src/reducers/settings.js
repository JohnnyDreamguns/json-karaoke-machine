const settings = (state = { tempo: 134, beatNumber: 0, isPlaying: false, currentLine: '' }, action) => {
  switch (action.type) {
    case 'SET_TEMPO':
      return Object.assign({}, state, { tempo: action.tempo });

    case 'SET_BEAT_NUMBER':
      return Object.assign({}, state, { beatNumber: action.value });
      
    case 'SET_IS_PLAYING':
      return Object.assign({}, state, { isPlaying: action.value });

    case 'SET_CURRENT_LINE':
      return Object.assign({}, state, { currentLine: action.value });

    default:
      return state
  }
}

export default settings