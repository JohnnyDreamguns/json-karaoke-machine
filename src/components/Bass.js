import React from 'react';
import JSONFormatter from './JSONFormatter';

const Bass = ({
  data, beatNumber
}) => (
  <section className="features instrument">
    <h2>Bass</h2>
    <div className="json-display">
      <JSONFormatter json={data[beatNumber]} noOfBreaks={3}></JSONFormatter>
      <div>
        <img src={require('/img/promars.jpg')} className="img-fluid" alt="" />
      </div>
    </div>
  </section>
);

export default Bass;