import 'babel-polyfill';
import React from 'react';
import PolySynth from './PolySynth';
import renderer from 'react-test-renderer';
import { default as song } from '../songs/VanHalenJump';

describe('SongChooser', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<PolySynth data={song.polySynth} beatNumber="4" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
