import React from 'react';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';

export const About = () => {

  return(
    <div className="App">
      <Header />
      <div className="about-page container">
        <h2>About</h2>
        <p>The JSON Karaoke Machine is an attempt to arrange a song using JSON 
          data and play it back using the Web Audio API</p>
        <p>Song lyrics are displayed during playback for a karaoke twist</p>
        
        <div class="song-section">
          <h3>Song</h3>
          <p>A song is made up of Drums, Bass, PolySynth and Lyrics data structures, these are 
            described in more detail below</p>
          <img src={require('/img/song.jpg')} className="img-fluid" alt="" />
        </div>

        <div class="drums-section">
          <h3>Drums</h3>
          <p>This data structure represents the drums for the song</p>
          <p>It is an array containing many arrays. Each child array contains zero or
            more objects that define what drum sounds should play at that beat of the song
          </p>
          <div class="image-collection">
            <img src={require('/img/drums.jpg')} className="img-fluid" alt="" />
          </div>

          <p>Each drum type is a .wav audio sample that gets played by the Web Audio API</p>
          <div class="image-collection">
            <img src={require('/img/drums2.jpg')} className="img-fluid" alt="" />
            <img src={require('/img/drums3.jpg')} className="img-fluid" alt="" />
          </div>

          <p>Method that plays the sample using the Web Audio API</p>
          <div class="image-collection">
            <img src={require('/img/drums4.jpg')} className="img-fluid" alt="" />
          </div>
        </div>

        <div class="bass-section">
          <h3>Bass</h3>
          <p>The Bass data structure represents the low frequency melody of the song</p>
          <p>Similar to the bass structure it is also an array of arrays. Each child array
            contains zero or more objects that define what frequency note should play 
            and for what duration
          </p>
          <div class="image-collection">
            <img src={require('/img/bass1.jpg')} className="img-fluid" alt="" />
          </div>

          <p>This file defines the frequency of each note, higher pitch frequencies of these
            notes are calculated within the program
          </p>
          <div class="image-collection">
            <img src={require('/img/bass2.jpg')} className="img-fluid" alt="" />
          </div>

          <p>Below is the method that plays the frequency using the Web Audio API.</p>
          <p>It creates an oscillator and defines the waveform, gain, frequency and duration of the note</p>
          <div class="image-collection">
            <img src={require('/img/bass3.jpg')} className="img-fluid" alt="" />
          </div>
        </div>

        <div class="poly-section">
          <h3>PolySynth</h3>
          <p>The PolySynth data structure represents the higher frequency melody of the song,
            it plays chords
          </p>
          <p>Each child array multiple objects that define what collection of notes should play
            and for what duration
          </p>
          <div class="image-collection">
            <img src={require('/img/poly1.jpg')} className="img-fluid" alt="" />
          </div>
        </div>

        <div class="lyrics-section">
          <h3>Lyrics</h3>
          <p>This data structure represents the lyrics of the song</p>
          <div class="image-collection">
            <img src={require('/img/lyrics1.jpg')} className="img-fluid" alt="" />
          </div>
        </div>
        <p></p>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default About;