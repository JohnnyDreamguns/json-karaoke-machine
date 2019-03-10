import React from 'react';
import { 
  App, 
  mapStateToProps, 
  mapDispatchToProps,
} from './App';
import renderer from 'react-test-renderer';

const mockState = {
  settings: {
    tempo: 120,
    beatNumber: 0
  }
};

const mockDispatchMethods = {
  handleChangeTempo: () => {},
  setBeatNumber: () => {}
};

const mockEvent = {
  target:{
    value: 100
  }
};

describe('App', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<App></App>).toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('mapStateToProps', () => {
    it('to return the correct state', () => {
      expect(mapStateToProps(mockState)).toEqual(mockState.settings);
    });
  });

  describe('mapDispatchToProps', () => {
    it('to return the correct result', () => {
      expect(JSON.stringify(mapDispatchToProps()))
        .toEqual(JSON.stringify(mockDispatchMethods));
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

  describe('setBeatNumber', () => {
    const mockDispatch = jest.fn(() => {});
    const { setBeatNumber } = mapDispatchToProps(mockDispatch);
    
    it('calls dispatch method once', () => {
      setBeatNumber(mockEvent);
      expect(mockDispatch.mock.calls.length).toBe(1);
    });

    it('dispatches action with correct value', () => {
      mockDispatch.mockReset();
      setBeatNumber(5);
      expect(mockDispatch.mock.calls[0][0].value).toBe(5);
    });
  });
});