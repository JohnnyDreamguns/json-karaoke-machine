import {
  setTempo,
  setBeatNumber,
  setIsPlaying,
  setCurrentLine,
  setIsInitialised,
  setNextBeatTime,
  setUnlocked
} from './index';

describe('Actions', () => {
  describe('setTempo', () => {
    it('should return the correct data', () => {
      expect(setTempo(100)).toEqual({
        type: 'SET_TEMPO',
        tempo: 100
      });
    });
  });

  describe('setBeatNumber', () => {
    it('should return the correct data', () => {
      expect(setBeatNumber(30)).toEqual({
        type: 'SET_BEAT_NUMBER',
        value: 30
      });
    });
  });

  describe('setIsPlaying', () => {
    it('should return the correct data', () => {
      expect(setIsPlaying(true)).toEqual({
        type: 'SET_IS_PLAYING',
        value: true
      });
    });
  });

  describe('setCurrentLine', () => {
    it('should return the correct data', () => {
      expect(setCurrentLine('This is a test')).toEqual({
        type: 'SET_CURRENT_LINE',
        value: 'This is a test'
      });
    });
  });

  describe('setIsInitialised', () => {
    it('should return the correct data', () => {
      expect(setIsInitialised(false)).toEqual({
        type: 'SET_IS_INITIALISED',
        value: false
      });
    });
  });

  describe('setNextBeatTime', () => {
    it('should return the correct data', () => {
      expect(setNextBeatTime(50)).toEqual({
        type: 'SET_NEXT_BEAT_TIME',
        value: 50
      });
    });
  });

  describe('setUnlocked', () => {
    it('should return the correct data', () => {
      expect(setUnlocked(true)).toEqual({
        type: 'SET_UNLOCKED',
        value: true
      });
    });
  });
});
