import { Audio } from 'expo-av';

export default {
    playFile(file) {
        return Audio.Sound.createAsync(file)
        .then(({ sound }) => {
                sound.playAsync();
            return sound;
            });
    },

    playSound(sound) {
        sound.playAsync();
    },

    pauseSound(sound) {
        sound.pauseAsync();
    },

    stopSound(sound) {
        sound.stopAsync().then(() => { sound.unloadAsync() });
    },
}
