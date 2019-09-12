import { connect } from 'react-redux';
import '../styles.css';
import About from '../components/About';
import {
  init,
  playKick,
  playSnare,
  playC,
  playChord
} from '../includes/music-machine';
import { default as song } from '../songs/VanHalenJump';
import { store } from '../store';

export const initAboutPage = () => {
  init(song, store.dispatch, store.getState);
};

export const mapStateToProps = () => ({
  initAboutPage,
  playKick,
  playSnare,
  playC,
  playChord
});

export default connect(mapStateToProps)(About);
