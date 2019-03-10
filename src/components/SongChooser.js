import React from 'react';

const SongChooser = ({
  play, tempo, handleChangeTempo
}) => (
  <header className="masthead">
    <div className="container h-100">
      <div className="row h-100">
        <div className="col-lg-7 my-auto">
          <div className="header-content mx-auto">
            <h1 className="mb-5">Choose a song and press play to hear the sweet 
              sounds of the Web Audio API</h1>

            <div className="header-controls">
              <button className="btn btn-outline btn-xl" data-playing="false" 
                role="switch" aria-checked="false" onClick={play}>Play!</button>

              <div className="tempo-control">
                <label forhtml="tempo">{tempo}bpm</label>
                <input type="range" id="tempo" min="70" max="250" value={tempo} step="1" 
                  onChange={handleChangeTempo} />
              </div>
            </div>
          </div>
        </div>
        {/* <div className="col-lg-5 my-auto">
          <div className="device-container">
            <div className="device-mockup iphone6_plus portrait white">
              <div className="device">
                <div className="screen">
                </div>
                <div className="button">
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  </header>
);

export default SongChooser;