import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

import { soundtrack1 } from './components/musics/soundtrack1';
import { boxingBell } from './components/boxingBell';
import { ding } from './components/ding';
import { moveSoundList } from './components/moveSounds/moveSoundList';

import { shuffle } from './components/shuffle';

const INTRO_TIME = 3000;
const AFTER_RESUME_TIME = 2000;
const MOVE_GAP_TIME = 500;
const COMBO_GAP_TIME = 3500;

const COMBO_MIN = 1;
const COMBO_MAX = 5;

const PLAY_TEXT = 'PLAY';
const PAUSE_TEXT = 'PAUSE';

function loadAndPlay(file) {
    Audio.Sound.createAsync(file)
        .then(({ sound }) => {
            sound.playAsync();
        });
}

let isMusicPlaying = false;

export default function PlayButton(props) {
    const [musicSound, setMusicSound] = React.useState();
    const [playButtonText, setPlayButtonText] = React.useState(PLAY_TEXT);
    const [stopWatchOn, setStopWatchOn] = React.useState(props.stopwatchOn);

    function playPressedHandler() {
        loadAndPlay(boxingBell.file);
        if (musicSound) {
            toggleMusic(musicSound);
            return;
        }
        kickStart();
    }

    function kickStart() {
        loadMusic(soundtrack1);
        setPlayButtonText(PAUSE_TEXT);
        setStopWatchOn(true);
        props.onPress({active: true});

        setTimeout(playCombo, INTRO_TIME);
    }

    function loadMusic(musicData) {
        Audio.Sound.createAsync(musicData.file)
            .then(({ sound }) => {
                setMusicSound(sound);
                sound.playAsync();
                isMusicPlaying = true;
            });
    }

    async function toggleMusic(musicData) {
        if (isMusicPlaying === true) {
            await musicData.pauseAsync();
            isMusicPlaying = false;
            setPlayButtonText(PLAY_TEXT);
            setStopWatchOn(false);
            props.onPress({active: false});
        } else {
            await musicData.playAsync();
            isMusicPlaying = true;
            setPlayButtonText(PAUSE_TEXT);
            setStopWatchOn(true);
            props.onPress({active: true});

            setTimeout(playCombo, AFTER_RESUME_TIME);
        }
    }

    async function playCombo() {
        if (!isMusicPlaying) {
            return;
        }

        const combo = shuffle(moveSoundList, COMBO_MAX, COMBO_MIN);
        combo.push(ding);
        console.log('Combo:', combo);

        playMoveSet(combo).then(() => {
            setTimeout(playCombo, COMBO_GAP_TIME);
        });
    }

    async function playMoveSet(combo, moveIndex = 0) {
        if (moveIndex >= combo.length) {
            return;
        }
        if (!isMusicPlaying) {
            return;
        }

        loadAndPlay(combo[moveIndex].file);
        console.log('Load and Play', combo[moveIndex].title);
        setTimeout(() => {
            moveIndex++;
            playMoveSet(combo, moveIndex);
        }, MOVE_GAP_TIME);
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
