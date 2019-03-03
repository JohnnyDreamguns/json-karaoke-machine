import React from 'react';

export const InstrumentDisplay = ({
  beatNumber, song
}) => (
  <React.Fragment>
    <p>Drums<br/>{JSON.stringify(song.drums[beatNumber])}</p>
    
    <p>Bass<br/>{JSON.stringify(song.bass[beatNumber])}</p>

    <p>PolySynth<br/>{JSON.stringify(song.polySynth[beatNumber])}</p>
  </React.Fragment>
);

export default InstrumentDisplay;