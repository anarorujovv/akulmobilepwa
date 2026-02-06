import Sound from 'react-native-sound';

Sound.setCategory('Playback');

let obj = {
  bc: require('../sounds/bc.mp3'),
  success: require('../sounds/ok.mp3')
}

const playSound = (soundName) => {
  const sound = new Sound(obj[soundName], (error) => {
    if (error) {
      console.log('Error loading sound:', error);
      return;
    }
    sound.play((success) => {
      if (!success) {
        console.log('Error playing sound');
      } else {
        console.log('Sound played successfully');
      }
      sound.release();
    });
  });
};

export default playSound;
