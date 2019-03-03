import React from 'react';
import { Controls } from './Controls';
import renderer from 'react-test-renderer';

describe('Controls', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Controls></Controls>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
