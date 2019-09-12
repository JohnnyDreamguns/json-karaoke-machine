import { Metronome } from './index';

window.Worker = function mockWorker() {
  this.mockProp = 'mock!';
};

describe('Metronome', () => {
  it('should return a Metronome instance', () => {
    expect(Metronome.getInstance().mockProp).toBe('mock!');
  });

  it('should return the same instance if called twice', () => {
    const instance1 = Metronome.getInstance();
    const instance2 = Metronome.getInstance();
    expect(instance1).toEqual(instance2);
  });
});
