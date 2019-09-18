import React, { useEffect } from 'react';
import '../styles.css';
import { togglePlay } from '../includes/music-machine';
import { default as song } from '../songs/VanHalenJump';
import Header from './Header';
import SongChooser from './SongChooser';
import Drums from './Drums';
import Bass from './Bass';
import PolySynth from './PolySynth';
import Footer from './Footer';
import Lyrics from './Lyrics';

const Home = ({
  initHomePage,
  tempo,
  beatNumber,
  handleChangeTempo,
  isPlaying
}) => {
  useEffect(() => {
    initHomePage();
  }, []);

  return (
    <div className="App">
      <Header
        play={togglePlay(isPlaying)}
        isPlaying={isPlaying}
        tempo={tempo}
        handleChangeTempo={handleChangeTempo}
      />
      <SongChooser
        play={togglePlay(isPlaying)}
        isPlaying={isPlaying}
        tempo={tempo}
        handleChangeTempo={handleChangeTempo}
      />
      <Drums data={song.drums} beatNumber={beatNumber} />
      <Bass data={song.bass} beatNumber={beatNumber} />
      <PolySynth data={song.polySynth} beatNumber={beatNumber} />
      <Footer />
      {isPlaying && <Lyrics data={song.lyrics} beatNumber={beatNumber} />}
    </div>
  );
};

export default Home;
