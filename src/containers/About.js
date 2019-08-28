import { connect } from 'react-redux';
import '../styles.css';
import About from '../components/About';
import {
  init,
  playKick,
  playSnare,
  playSingleNote,
  playChord
} from '../includes/music-machine';
import { default as song } from '../songs/VanHalenJump';

const initAboutPage = () => {
  init(song);
};

export const mapStateToProps = () => ({
  initAboutPage,
  playKick,
  playSnare,
  playSingleNote,
  playChord
});

export default connect(mapStateToProps)(About);
