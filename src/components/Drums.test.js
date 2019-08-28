import 'babel-polyfill';
import React from 'react';
import Drums from './Drums';
import renderer from 'react-test-renderer';
import { default as song } from '../songs/VanHalenJump';

describe('Drums', () => {
  it('renders correctly', () => {
    const tree = renderer
      .create(<Drums data={song.drums} beatNumber="20" />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
