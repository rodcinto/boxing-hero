import { Audio } from 'expo-av';

export default {
    async playFile(file) {
        return Audio.Sound.createAsync(file)
        .then(({ sound }) => {
                sound.playAsync();
            return sound;
            });
    },

    playSound(sound) {
        if (sound) {
            sound.playAsync();
        }
    },

    pauseSound(sound) {
        if (sound) {
            sound.pauseAsync();
        }
    },

    stopSound(sound) {
        if (sound) {
            sound.stopAsync().then(() => { sound.unloadAsync() });
        }
    },
}
