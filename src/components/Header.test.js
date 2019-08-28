import 'babel-polyfill';
import React from 'react';
import Header from './Header';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';

const defaultProps = {
  play: jest.fn(),
  isPlaying: false,
  tempo: 120,
  handleChangeTempo: jest.fn()
};

describe('Header', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(
        <Router>
          <Header {...defaultProps} />
        </Router>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
