import 'babel-polyfill';
import React from 'react';
import SongChooser from './SongChooser';
import renderer from 'react-test-renderer';

const defaultProps = {
  play: jest.fn(),
  isPlaying: false,
  tempo: 120,
  handleChangeTempo: jest.fn()
};

describe('SongChooser', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<SongChooser {...defaultProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
