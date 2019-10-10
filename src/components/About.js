import React, { useEffect } from 'react';
import '../styles.css';
import Header from './Header';
import Footer from './Footer';

const About = ({ initAboutPage, playKick, playSnare, playC, playChord }) => {
  useEffect(() => {
    initAboutPage();
  }, []);

  return (
    <div className="App">
      <Header />
      <div className="about-page container">
        <h2>About</h2>
        <p>
          The JSON Karaoke Machine is an attempt to arrange a song using JSON
          data and play it back using the Web Audio API
        </p>
        <p>Song lyrics are displayed during playback for a karaoke twist</p>

        <div className="song-section">
          <h3>Song</h3>
          <p>
            A song is made up of Drums, Bass, PolySynth and Lyrics data
            structures, these are described in more detail below
          </p>
          <img
            src={require('../../img/song.jpg')}
            className="img-fluid"
            alt=""
          />
        </div>

        <div className="drums-section">
          <h3>Drums</h3>
          <p>This data structure represents the drums for the song</p>
          <p>
            It is an array containing many arrays. Each child array contains
            zero or more objects that define what drum sounds should play at
            that beat of the song
          </p>
          <div className="image-collection">
            <img
              src={require('../../img/drums.jpg')}
              className="img-fluid"
              alt=""
            />
          </div>

          <p>
            Each drum type is a .wav audio sample that gets played by the Web
            Audio API
          </p>
          <div className="image-collection">
            <img
              src={require('../../img/samples.png')}
              className="img-fluid"
              alt=""
            />
          </div>

          <p>Method that plays the sample using the Web Audio API</p>
          <div className="image-collection">
            <img
              src={require('../../img/audiocontext.png')}
              className="img-fluid"
              alt=""
            />
          </div>
          <div className="image-collection">
            <img
              src={require('../../img/playSample.png')}
              className="img-fluid"
              alt=""
            />
          </div>

          <button onClick={playKick} style={{ marginRight: 20 + 'px' }}>
            Play Kick
          </button>
          <button onClick={playSnare}>Play Snare</button>
        </div>

        <div className="bass-section">
          <h3>Bass</h3>
          <p>
            The Bass data structure represents the low frequency melody of the
            song
          </p>
          <p>
            Similar to the drums structure it is also an array of arrays. Each
            child array contains zero or more objects that define what frequency
            note should play and for what duration
          </p>
          <div className="image-collection">
            <img
              src={require('../../img/bass1.jpg')}
              className="img-fluid"
              alt=""
            />
          </div>

          <p>
            This file defines the frequency of each note, higher pitch
            frequencies of these notes are calculated within the program
          </p>
          <div className="image-collection">
            <img
              src={require('../../img/bass2.jpg')}
              className="img-fluid"
              alt=""
            />
          </div>

          <p>
            Below is the method that plays the frequency using the Web Audio
            API.
          </p>
          <p>
            It creates an oscillator and defines the waveform, gain, frequency
            and duration of the note
          </p>
          <div className="image-collection">
            <img
              src={require('../../img/playNote.png')}
              className="img-fluid"
              alt=""
            />
          </div>

          <button onClick={playC}>Play Bass Note</button>
        </div>

        <div className="poly-section">
          <h3>PolySynth</h3>
          <p>
            The PolySynth data structure represents the higher frequency melody
            of the song, it plays chords
          </p>
          <p>
            Each child array multiple objects that define what collection of
            notes should play and for what duration
          </p>
          <div className="image-collection">
            <img
              src={require('../../img/poly1.jpg')}
              className="img-fluid"
              alt=""
            />
          </div>

          <button onClick={playChord}>Play Chord</button>
        </div>

        <div className="lyrics-section">
          <h3>Lyrics</h3>
          <p>This data structure represents the lyrics of the song</p>
          <div className="image-collection">
            <img
              src={require('../../img/lyrics.png')}
              className="img-fluid"
              alt=""
            />
          </div>

          <h3>Acknowledgements</h3>
          <p>
            Thanks to Chris Wilson for his article{' '}
            <a href="https://www.html5rocks.com/en/tutorials/audio/scheduling/">
              A tale of two clocks
            </a>
            , this article was a massive help during the development of this
            application
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;
