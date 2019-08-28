import 'babel-polyfill';
import React from 'react';
import Lyrics from './Lyrics';
import renderer from 'react-test-renderer';
import { default as song } from '../songs/VanHalenJump';

describe('Lyrics', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Lyrics data={song.lyrics} beatNumber={60} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('render the next line', () => {
    const tree = renderer
      .create(<Lyrics data={song.lyrics} beatNumber={74} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('look ahead for next line', () => {
    const tree = renderer
      .create(<Lyrics data={song.lyrics} beatNumber={73} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('first beat', () => {
    const tree = renderer
      .create(<Lyrics data={song.lyrics} beatNumber={1} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
