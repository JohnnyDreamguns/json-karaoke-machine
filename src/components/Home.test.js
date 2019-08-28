import 'babel-polyfill';
import React from 'react';
import Home from './Home';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import { mount } from 'enzyme';

const defaultProps = {
  togglePlay: jest.fn(),
  isPlaying: true,
  tempo: 120,
  handleChangeTempo: jest.fn(),
  beatNumber: 20
};

describe('Home', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Router>
          <Home {...defaultProps} />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('calls initHomePage on render', () => {
    const mockInitHomePage = jest.fn();
    mount(
      <Router>
        <Home {...defaultProps} initHomePage={mockInitHomePage} />
      </Router>
    );
    expect(mockInitHomePage.mock.calls.length).toBe(1);
  });
});
