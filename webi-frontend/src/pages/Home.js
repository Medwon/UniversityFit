import React from 'react';
import FirstSection from '../components/FirstSection';
import HelpSection from '../components/HelpSection';

function Home({ user, }) {
  
  return (
    <div>
      <FirstSection user={user} />
      <HelpSection/>

    </div>
  );
}

export default Home;
