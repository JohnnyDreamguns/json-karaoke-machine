import settings from './settings';

const defaultState = {
  tempo: 134,
  beatNumber: 0,
  isPlaying: false,
  currentLine: ''
};

describe('Settings reducer', () => {
  it('should process data from SET_TEMPO action', () => {
    expect(
      settings(defaultState, { type: 'SET_TEMPO', tempo: 120 }).tempo
    ).toBe(120);
  });

  it('should process data from SET_BEAT_NUMBER action', () => {
    expect(
      settings(defaultState, { type: 'SET_BEAT_NUMBER', value: 20 }).beatNumber
    ).toBe(20);
  });

  it('should process data from SET_IS_PLAYING action', () => {
    expect(
      settings(defaultState, { type: 'SET_IS_PLAYING', value: true }).isPlaying
    ).toBe(true);
  });

  it('should process data from SET_CURRENT_LINE action', () => {
    expect(
      settings(defaultState, {
        type: 'SET_CURRENT_LINE',
        value: 'This is a mock line'
      }).currentLine
    ).toBe('This is a mock line');
  });

  it('should process data from SET_IS_INITIALISED action', () => {
    expect(
      settings(defaultState, {
        type: 'SET_IS_INITIALISED',
        value: true
      }).isInitialised
    ).toBe(true);
  });

  it('should process data from SET_NEXT_BEAT_TIME action', () => {
    expect(
      settings(defaultState, {
        type: 'SET_NEXT_BEAT_TIME',
        value: 100
      }).nextBeatTime
    ).toBe(100);
  });

  it('should process data from SET_UNLOCKED action', () => {
    expect(
      settings(defaultState, {
        type: 'SET_UNLOCKED',
        value: true
      }).unlocked
    ).toBe(true);
  });
});
