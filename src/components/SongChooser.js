import React from 'react';

const SongChooser = ({
  play, tempo, handleChangeTempo, isPlaying
}) => (
  <header className="masthead">
    <div className="container h-100">
      <div className="row h-100">
        <div className="col-lg-7 my-auto">
          <div className="header-content mx-auto">
            <h1 className="mb-5">Press play to hear the sweet 
              sounds of the Web Audio API</h1>

            <div className="header-controls">
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
        </div>
        <div className="col-lg-5 my-auto">
          <h3>Now Playing: Jump by Van Halen</h3>
          <img src={require('/img/vanhalen.jpg')} className="img-fluid" alt="" />
        </div>
      </div>
    </div>
  </header>
);

export default SongChooser;