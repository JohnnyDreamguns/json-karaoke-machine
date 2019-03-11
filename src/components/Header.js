import React from 'react';

const Header = ({
  play, isPlaying, tempo, handleChangeTempo
}) => (
  <nav className="navbar navbar-expand-lg navbar-light fixed-top" id="mainNav">
    <div className="container">
      <a className="navbar-brand js-scroll-trigger" href="/">JSON Karaoke Machine</a>

      <div className="play-controls">
        <button className="btn btn-outline btn-xl" data-playing="false" 
          role="switch" aria-checked="false" onClick={play}>
          { isPlaying ? 'Stop' : 'Play!' }
        </button>

        <div className="tempo-control">
          <label forhtml="tempo">{tempo}bpm</label>
          <input type="range" id="tempo" min="70" max="250" value={tempo} step="1" 
            onChange={handleChangeTempo} />
        </div>
      </div>
    </div>
  </nav>
);

export default Header;