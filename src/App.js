import React, { Component, useEffect } from 'react';
import {connect} from 'react-redux';
import './App.css';
import { init, play, changeTempo } from './includes/music-machine';
import { default as song } from './songs/van-halen-jump';
import { setTempo, setBeatNumber } from './actions/index';
import Header from './components/Header';
import SongChooser from './components/SongChooser';
import Drums from './components/Drums';
import Bass from './components/Bass';
import PolySynth from './components/PolySynth';
import Footer from './components/Footer';

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

export const App = ({
  tempo, beatNumber, handleChangeTempo, setBeatNumber
}) => {

  useEffect(() => {
    init(song, { setBeatNumber });
  }, []);

  return(
    <div className="App">
      <Header></Header>
      <SongChooser play={play} tempo={tempo} handleChangeTempo={handleChangeTempo}></SongChooser>
      <Drums data={song.drums} beatNumber={beatNumber}></Drums>
      <Bass data={song.bass} beatNumber={beatNumber}></Bass>
      <PolySynth data={song.polySynth} beatNumber={beatNumber}></PolySynth>
      <Footer></Footer>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);