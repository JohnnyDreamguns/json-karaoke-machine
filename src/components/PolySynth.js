import React from 'react';
import JSONFormatter from './JSONFormatter';

const PolySynth = ({ data, beatNumber }) => (
  <section className="bg-primary text-center instrument">
    <h2>PolySynth</h2>
    <div className="json-display">
      <JSONFormatter data={data} beatNumber={beatNumber} noOfBreaks={4} />
      <div>
        <img src={require('/img/juno.jpg')} className="img-fluid" alt="" />
      </div>
    </div>
  </section>
);

export default PolySynth;
