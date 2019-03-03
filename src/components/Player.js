import React, { useEffect } from 'react';
import {connect} from 'react-redux';
import { init, play, changeTempo } from '../includes/music-machine';
import { default as song } from '../songs/van-halen-jump';
import { setTempo, setBeatNumber } from '../actions/index';
import Controls from './Controls';
import InstrumentDisplay from './InstrumentDisplay';

export const mapStateToProps = (state) => ({
  tempo: state.settings.tempo,
  beatNumber: state.settings.beatNumber
});

export const mapDispatchToProps = (dispatch) => ({
  handleChangeTempo: ({ target : { value } }) => {
    dispatch(setTempo(value));
    changeTempo(value);
  },
  setBeatNumber: value => {
    dispatch(setBeatNumber(value));
  }
});

export const Player = ({
  tempo, beatNumber, handleChangeTempo, setBeatNumber
}) => {

  useEffect(() => {
    init(song, { setBeatNumber });
  }, []);

  return(
    <React.Fragment>
      <Controls play={play} tempo={tempo} handleChangeTempo={handleChangeTempo}></Controls>
      <InstrumentDisplay beatNumber={beatNumber} song={song}></InstrumentDisplay>
    </React.Fragment>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Player);