import React from 'react';
import JSONFormatter from './JSONFormatter';

const Drums = ({
  data, beatNumber
}) => (
  <section className="bg-primary text-center instrument">
    <h2>Drums</h2>
    <div className="json-display">
      <JSONFormatter json={data[beatNumber]} noOfBreaks={2}></JSONFormatter>
      <div>
        <img src={require('/img/m4K8gog.png')} className="img-fluid" alt="" />
      </div>
    </div>
  </section>
);

export default Drums;