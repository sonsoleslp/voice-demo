import React, { useEffect, useState } from 'react';

const config =  {
  initialImage: 'closed.png',
  finalImage: 'open.png',
  command: 'alohomora'
}

const App = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const {initialImage, finalImage, command} = config;
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      console.log('Heard:', transcript);

      if (transcript.includes(command)) {
        setIsFading(true);
        setTimeout(() => {
          setIsUnlocked(prev => !prev);
          setIsFading(false);
        }, 300); // fade out, then change image
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.start();

    return () => recognition.stop();
  }, []);

  const imageSrc = isUnlocked ?  finalImage : initialImage

  return (
    <div style={{
      margin: 0, padding: 0,
      height: '100vh', width: '100vw',
      overflow: 'hidden', backgroundColor: 'black',
      position: 'relative'
    }}>
      <img
        src={imageSrc}
        alt={isUnlocked ? 'Door Open' : 'Door Closed'}
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'contain',
          transition: 'opacity 0.5s ease',
          opacity: isFading ? 0 : 1
        }}
      />
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        padding: '10px 15px',
        borderRadius: '8px',
        fontSize: '20px',
        fontFamily: 'sans-serif'
      }}>
        Say <em>"{command}"</em> to unlock the door
      </div>
    </div>
  );
};

export default App;
