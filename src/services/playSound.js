// Web Audio API ile ses çalma
const sounds = {
  bc: '/sounds/bc.mp3',
  success: '/sounds/ok.mp3'
};

const playSound = (soundName) => {
  try {
    const audio = new Audio(sounds[soundName]);
    audio.play().then(() => {
      console.log('Sound played successfully');
    }).catch((error) => {
      console.log('Error playing sound:', error);
    });
  } catch (error) {
    console.log('Error loading sound:', error);
  }
};

export default playSound;
