import { showError } from './error-handler';
import JSAlert from 'js-alert';

jest.mock('js-alert', () => ({
  alert: jest.fn()
}));

describe('showError', () => {
  it('should call JSAlert.alert with the correct value', () => {
    showError('Test');
    expect(JSAlert.alert.mock.calls.length).toBe(1);
    expect(JSAlert.alert.mock.calls[0][0]).toBe('Test');
  });
});
