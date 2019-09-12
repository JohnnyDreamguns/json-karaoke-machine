import 'babel-polyfill';
import { mapStateToProps, initAboutPage } from './About';
import * as musicMachine from '../includes/music-machine';

describe('About', () => {
  describe('initAboutPage', () => {
    it('should call init method when called', () => {
      musicMachine.init = jest.fn();
      initAboutPage();
      expect(musicMachine.init.mock.calls.length).toBe(1);
    });
  });

  describe('mapStateToProps', () => {
    it('to return the correct state', () => {
      const props = mapStateToProps();
      expect(typeof props.initAboutPage).toBe('function');
      expect(typeof props.playKick).toBe('function');
      expect(typeof props.playSnare).toBe('function');
      expect(typeof props.playC).toBe('function');
      expect(typeof props.playChord).toBe('function');
    });
  });
});
