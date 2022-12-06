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
const RESUME_TEXT = 'RESUME';

function loadAndPlaySound(file) {
    Audio.Sound.createAsync(file)
        .then(({ sound }) => {
            sound.playAsync();
        });
}

let isRoundActive = false;

export default function PlayButton(props) {
    const [musicSound, setMusicSound] = React.useState();
    const [playButtonText, setPlayButtonText] = React.useState(PLAY_TEXT);

    function playPressedHandler() {
        if (musicSound) {
            if (isRoundActive === true) {
                pauseRound(musicSound);
            } else {
                resumeRound(musicSound);
            }
            return;
        }
        startRound();
    }

    function startRound() {
        console.log('START ROUND');
        loadAndPlaySound(boxingBell.file);
        loadMusic(soundtrack1);
        setPlayButtonText(PAUSE_TEXT);
        props.onPress({ active: true });

        setTimeout(playCombo, INTRO_TIME);
    }

    function loadMusic(musicData) {
        Audio.Sound.createAsync(musicData.file)
            .then(({ sound }) => {
                setMusicSound(sound);
                sound.playAsync();
                isRoundActive = true;
            });
    }

    async function pauseRound(musicData) {
        console.log('PAUSE ROUND');
        await musicData.pauseAsync();
        isRoundActive = false;
        setPlayButtonText(RESUME_TEXT);
        props.onPress({ active: false });
    }

    async function resumeRound(musicData) {
        console.log('RESUME ROUND');
        loadAndPlaySound(boxingBell.file);
        await musicData.playAsync();
        isRoundActive = true;
        setPlayButtonText(PAUSE_TEXT);
        props.onPress({ active: true });

        setTimeout(playCombo, AFTER_RESUME_TIME);
    }

    async function stopRound(musicData) {
        if (musicData) {
            await musicData.stopAsync();
            await musicData.unloadAsync();
            setMusicSound(null);
        }
        isRoundActive = false;
        setPlayButtonText(PLAY_TEXT);

        // virtual button press
        props.onPress({ active: false });
    }

    async function playCombo() {
        if (!isRoundActive) {
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
        if (!isRoundActive) {
            return;
        }

        loadAndPlaySound(combo[moveIndex].file);
        console.log('Load and Play', combo[moveIndex].title);
        setTimeout(() => {
            moveIndex++;
            playMoveSet(combo, moveIndex);
        }, MOVE_GAP_TIME);
    }

    React.useEffect(() => {
        console.log('Use Effect');

        console.log('StopRound?', props);
        if (props.resetFired) {
            stopRound(musicSound);
        }
    });

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
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#A00',

    },
    buttonText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222',
    }
});
