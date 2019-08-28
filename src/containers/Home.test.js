import 'babel-polyfill';
import { mapStateToProps, mapDispatchToProps } from './Home';

const mockState = {
  settings: {
    tempo: 120,
    beatNumber: 0,
    currentLine: undefined,
    initHomePage: () => {},
    isPlaying: undefined
  }
};

const mockDispatchMethods = {
  handleChangeTempo: () => {},
  setBeatNumber: () => {}
};

const mockEvent = {
  target: {
    value: 100
  }
};

describe('Home', () => {
  describe('mapStateToProps', () => {
    it('to return the correct state', () => {
      expect(JSON.stringify(mapStateToProps(mockState))).toEqual(
        JSON.stringify(mockState.settings)
      );
    });
  });

  describe('mapDispatchToProps', () => {
    it('to return the correct result', () => {
      expect(JSON.stringify(mapDispatchToProps())).toEqual(
        JSON.stringify(mockDispatchMethods)
      );
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
