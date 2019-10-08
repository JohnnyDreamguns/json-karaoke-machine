import 'babel-polyfill';
import React from 'react';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import NoSoundModal from './NoSoundModal';
import renderer from 'react-test-renderer';

Enzyme.configure({ adapter: new Adapter() });

describe('NoSoundModal', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<NoSoundModal />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should set visible to true when no-sound button is pressed', () => {
    let wrapper = Enzyme.shallow(<NoSoundModal />);
    wrapper.find('#btn-no-sound').prop('onClick')();
    expect(wrapper.find('#isVisible').props().value).toBe('visible');
  });

  it('should set visible to false when btn-close button is pressed', () => {
    let wrapper = Enzyme.shallow(<NoSoundModal />);
    wrapper.find('#btn-no-sound').prop('onClick')();
    wrapper.find('#btn-close').prop('onClick')();
    expect(wrapper.find('#isVisible').props().value).toBe('hidden');
  });
});
