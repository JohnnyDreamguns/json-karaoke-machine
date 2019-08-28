import 'babel-polyfill';
import React from 'react';
import Bass from './Bass';
import renderer from 'react-test-renderer';
import { default as song } from '../songs/VanHalenJump';

describe('Bass', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Bass data={song.bass} beatNumber="20" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
