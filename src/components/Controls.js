import React from 'react';

export const Controls = ({
  play, tempo, handleChangeTempo
}) => (
  <React.Fragment>
    <button className="play" data-playing="false" role="switch" aria-checked="false" 
      onClick={play}>Play</button>

    <p>
      <label forhtml="tempo">Tempo</label>
      <input type="range" id="tempo" min="70" max="250" value={tempo} step="1" 
        onChange={handleChangeTempo} />
    </p>
  </React.Fragment>
);

export default Controls;