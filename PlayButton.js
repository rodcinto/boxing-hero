import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

import { soundtrack1 } from './components/musics/soundtrack1';
import { moveSoundList } from './components/moveSounds/moveSoundList';

const INTRO_TIME = 4000;
const AFTER_RESUME_TIME = 2000;
const TIME_GAP_MOVE = 500;

const PLAY_TEXT = 'PLAY';
const PAUSE_TEXT = 'PAUSE';

function loadAndPlay(file) {
    Audio.Sound.createAsync(file)
        .then(({ sound }) => {
            sound.playAsync();
        });
}

export default function PlayButton() {
    const [musicSound, setMusicSound] = React.useState();
    const [playButtonText, setPlayButtonText] = React.useState(PLAY_TEXT);

    function playPressedHandler() {
        if (musicSound) {
            toggleMusic(musicSound);
            return;
        }
        loadMusic(soundtrack1);
        setPlayButtonText(PAUSE_TEXT);

        setTimeout(playMoveSet, INTRO_TIME);
    }

    function loadMusic(musicData) {
        Audio.Sound.createAsync(musicData.file)
            .then(({ sound }) => {
                setMusicSound(sound);
                sound.playAsync();
            });
    }

    async function toggleMusic(musicData) {
        const status = await musicData.getStatusAsync();
        if (status.isPlaying) {
            await musicData.pauseAsync();
            setPlayButtonText(PLAY_TEXT);
        } else {
            await musicData.playAsync();
            setPlayButtonText(PAUSE_TEXT);

            setTimeout(playMoveSet, INTRO_TIME);
        }
    }

    async function playMoveSet(moveIndex = 0) {
        if (musicSound) {
            const musicStatus = await musicSound.getStatusAsync();
            if (!musicStatus.isPlaying) {
                return;
            }
        }

        if (moveIndex >= moveSoundList.length - 1) {
            return;
        }

        loadAndPlay(moveSoundList[moveIndex].file);
        console.log('Load and Play', moveSoundList[moveIndex].title);
        setTimeout(() => {
            playMoveSet(++moveIndex);
        }, TIME_GAP_MOVE);
    }

    React.useEffect(() => {
        console.log('Use Effect');

        if (musicSound) {
          return () => {
            console.log('Unloading Sound Music');
            musicSound.unloadAsync();
          }
        }
      }, [musicSound]);

    return (
        <TouchableOpacity
            onPress={playPressedHandler}
            style={styles.roundButton}>
            <Text style={styles.buttonText}>{playButtonText}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    roundButton: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#A00',

    },
    buttonText: {
        fontWeight: 'bold',
        color: '#222',
    }
});
