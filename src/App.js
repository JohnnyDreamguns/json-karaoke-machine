import React, { Component, useEffect } from 'react';
import {connect} from 'react-redux';
import './App.css';
import { init, play, changeTempo } from './includes/music-machine';
import { default as song } from './songs/VanHalenJump';
import { 
  setTempo, 
  setBeatNumber,
  setIsPlaying
} from './actions/index';
import Header from './components/Header';
import SongChooser from './components/SongChooser';
import Drums from './components/Drums';
import Bass from './components/Bass';
import PolySynth from './components/PolySynth';
import Footer from './components/Footer';
import Lyrics from './components/Lyrics';

export const mapStateToProps = (state) => ({
  tempo: state.settings.tempo,
  beatNumber: state.settings.beatNumber,
  isPlaying: state.settings.isPlaying,
  currentLine: state.settings.currentLine
});

export const mapDispatchToProps = (dispatch) => ({
  handleChangeTempo: ({ target : { value } }) => {
    dispatch(setTempo(value));
    changeTempo(value);
  },
  setBeatNumber: value => {
    dispatch(setBeatNumber(value));
  },
  setIsPlaying: value => {
    dispatch(setIsPlaying(value));
  }
});

export const App = ({
  tempo, beatNumber, handleChangeTempo, setBeatNumber, setIsPlaying, isPlaying
}) => {

  useEffect(() => {
    init(song, { setBeatNumber, setIsPlaying });
  }, []);

  return(
    <div className="App">
      <Header 
        play={play} 
        isPlaying={isPlaying}
        tempo={tempo}
        handleChangeTempo={handleChangeTempo}>
      </Header>
      <SongChooser 
        play={play}
        isPlaying={isPlaying}
        tempo={tempo}
        handleChangeTempo={handleChangeTempo}>
      </SongChooser>
      <Drums data={song.drums} beatNumber={beatNumber}></Drums>
      <Bass data={song.bass} beatNumber={beatNumber}></Bass>
      <PolySynth data={song.polySynth} beatNumber={beatNumber}></PolySynth>
      <Footer></Footer>
      {
        isPlaying && 
        <Lyrics 
          data={song.lyrics}
          beatNumber={beatNumber}>
        </Lyrics>
      }
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(App);