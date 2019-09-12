import 'babel-polyfill';
import { mapStateToProps, mapDispatchToProps, initHomePage } from './Home';
import * as musicMachine from '../includes/music-machine';

const mockState = {
  settings: {
    tempo: 120,
    beatNumber: 0,
    currentLine: undefined,
    initHomePage: () => {},
    isPlaying: undefined
  }
};

const mockEvent = {
  target: {
    value: 100
  }
};

describe('Home', () => {
  describe('initHomePage', () => {
    it('should call init method when called', () => {
      musicMachine.init = jest.fn();
      initHomePage();
      expect(musicMachine.init.mock.calls.length).toBe(1);
    });
  });

  describe('mapStateToProps', () => {
    it('to return the correct state', () => {
      const props = mapStateToProps(mockState);
      expect(JSON.stringify(props)).toEqual(JSON.stringify(mockState.settings));
      expect(typeof props.initHomePage).toBe('function');
    });
  });

  describe('mapDispatchToProps', () => {
    it('to return the correct result', () => {
      const props = mapDispatchToProps();
      expect(typeof props.handleChangeTempo).toBe('function');
    });
  });

  describe('handleChangeTempo', () => {
    const mockDispatch = jest.fn(() => {});
    const { handleChangeTempo } = mapDispatchToProps(mockDispatch);

    it('calls dispatch method once', () => {
      handleChangeTempo(mockEvent);
      expect(mockDispatch.mock.calls.length).toBe(1);
    });

    it('dispatches action with correct value', () => {
      mockDispatch.mockReset();
      handleChangeTempo(mockEvent);
      expect(mockDispatch.mock.calls[0][0].tempo).toBe(mockEvent.target.value);
    });
  });
});
