import React from 'react';

const formatJSON = (data, beatNumber, noOfBreaks) => {

  let content = JSON.stringify(data[beatNumber]);

  // Check previous notes duration to know whether a note is still being held
  if(content == '[]' && beatNumber > 6) {
    for(let i = 1; i < 7; i++){
      if(data[beatNumber-i].length > 0 && data[beatNumber-i][0].duration > 1)
      content = JSON.stringify(data[beatNumber-i]);
    }
  }

  let breaks = '';
  for(let i=0; i<noOfBreaks; i++){
    breaks+= '<br>';
  }

  if(content == undefined || content == '[]') return { __html: `[${breaks}]` };
  else{
    content = content.replace(/\[/g, '[<br>')
      .replace(/{/g, '<span class="curly-brace">{</span> ')
      .replace(/}/g, ' <span class="curly-brace">}</span>')
      .replace(/}<\/span>,/g, '}<\/span>,<br>')
      .replace(/"\w+":/g, ' <span class="key">$&</span> ')
      .replace(/<\/span> ([.\-\w\d"]+)/g, '</span> <span class="value">$1</span>')
      .replace(/\]/g, '<br>]');
    return { __html: content };
  }
};

const JSONFormatter = ({
  data, beatNumber, noOfBreaks
}) => (
  <div className="json">
    <div dangerouslySetInnerHTML={formatJSON(data, beatNumber, noOfBreaks)}></div>
  </div>
);

export default JSONFormatter;
