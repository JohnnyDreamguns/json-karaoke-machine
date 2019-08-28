import 'babel-polyfill';
import React from 'react';
import JSONFormatter from './JSONFormatter';
import renderer from 'react-test-renderer';
import { default as song } from '../songs/VanHalenJump';

describe('JSONFormatter', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<JSONFormatter data={song.polySynth} beatNumber="33" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
