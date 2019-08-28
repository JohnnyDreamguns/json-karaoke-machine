import 'babel-polyfill';
import React from 'react';
import About from './About';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';

const defaultProps = {
  initAboutPage: jest.fn(),
  playKick: jest.fn(),
  playSnare: jest.fn(),
  playSingleNote: jest.fn(),
  playChord: jest.fn()
};

describe('About', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Router>
          <About {...defaultProps} />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls initAboutPage on render', () => {
    const mockInitAboutPage = jest.fn();
    mount(
      <Router>
        <About {...defaultProps} initAboutPage={mockInitAboutPage} />
      </Router>
    );
    expect(mockInitAboutPage.mock.calls.length).toBe(1);
  });
});
