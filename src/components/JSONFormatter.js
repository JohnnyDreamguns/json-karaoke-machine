import React from 'react';

const formatJSON = (json, noOfBreaks) => {

  let content = JSON.stringify(json);

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
  json, noOfBreaks
}) => (
  <div className="json">
    <div dangerouslySetInnerHTML={formatJSON(json, noOfBreaks)}></div>
  </div>
);

export default JSONFormatter;
