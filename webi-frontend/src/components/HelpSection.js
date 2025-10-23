import React, { useState } from 'react';
import './HelpSection.css';

const HelpSection = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [text, setText] = useState('Click on the squares for information');

  const texts = [
    ' new content for square 1',
    'another content for square 2',
    'different content for square 3',
    ' unique content for square 4',
  ];

  function changeText(index) {
    setSelectedIndex(index);
    setText(texts[index]);
  }

  return (
    <div className='help_section_page'>
      <div className='help_btns_container'>
        {[1, 2, 3, 4].map((item, index) => (
          <div key={index} className={`help_btns ${selectedIndex === index ? 'active' : ''}`} onClick={() => changeText(index)}>
            {item}
          </div>
        ))}
      </div>
      <div className="help_info_container">
        <p className="help_info" >{text}</p>
      </div>
    </div>
  );
};

export default HelpSection;
