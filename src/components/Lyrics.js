import React from 'react';

let currentLine = '';
let startIndex = 0;

const updateCurrentLine = (data, beatNumber) => {

  let nextLineStarts = data.findIndex((x, i) => i > beatNumber && x.length > 0 && x[0].nextLine==true );
  if(beatNumber == 1) startIndex = 0;
  if((beatNumber + 1) == nextLineStarts) startIndex = beatNumber + 1;

  let thisLineArr = data.filter((x, i) => i > startIndex && i < nextLineStarts && x.length > 0 && x[0].text );
  let thisLine = thisLineArr.map(x => x[0].text).join('');

  if(thisLine != currentLine.replace(/<span class="highlight">/g, '').replace(/<\/span>/g, '')) 
    currentLine = thisLine;

  if(data[beatNumber] && data[beatNumber].length > 0) {
    if(data[beatNumber][0].nextLine) {
      currentLine = '';
    }

    if(data[beatNumber][0].text) {
      //currentLine += data[beatNumber][0].text;
      const index = currentLine.indexOf(data[beatNumber][0].text) + data[beatNumber][0].text.length;
      currentLine = `<span class="highlight">${currentLine.substring(0, index)}</span>${currentLine.substring(index, currentLine.length)}`;
    }
  }

  console.log(currentLine);

  return { __html: currentLine };
};

const Lyrics = ({
  data, beatNumber
}) => (
  <div className="lyrics">
    <div dangerouslySetInnerHTML={updateCurrentLine(data, beatNumber)}></div>
    {/* { beatNumber } */}
  </div>
);

export default Lyrics;