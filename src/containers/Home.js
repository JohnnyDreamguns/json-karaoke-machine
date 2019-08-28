import { connect } from 'react-redux';
import '../styles.css';
import { setTempo } from '../actions/index';
import Home from '../components/Home';
import { init } from '../includes/music-machine';
import { default as song } from '../songs/VanHalenJump';

const initHomePage = () => {
  init(song);
};

export const mapStateToProps = state => ({
  initHomePage: initHomePage,
  tempo: state.settings.tempo,
  beatNumber: state.settings.beatNumber,
  isPlaying: state.settings.isPlaying,
  currentLine: state.settings.currentLine
});

export const mapDispatchToProps = dispatch => ({
  handleChangeTempo: ({ target: { value } }) => {
    dispatch(setTempo(value));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
