import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

import { soundtrack1 } from '../soundData/musics/soundtrack1';
import { boxingBell } from '../soundData/boxingBell';
import { ding } from '../soundData/ding';
import { moveSoundList } from '../soundData/moves/moveSoundList';

import { shuffle } from '../utils/shuffle';

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

    const INTRO_TIME = 3000;
    const AFTER_RESUME_TIME = 2000;
    const MOVE_GAP_TIME = 500;

    const COMBO_MIN = 1;
    let COMBO_MAX = props.comboSize;
    let COMBO_GAP_TIME = props.comboSpeed * 1000;

    async function playPressedHandler() {
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

        setTimeout(playCombo, INTRO_TIME);
        props.onPress(true);
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
        props.onPress(false);
    }

    async function resumeRound(musicData) {
        console.log('RESUME ROUND');
        loadAndPlaySound(boxingBell.file);
        await musicData.playAsync();
        isRoundActive = true;
        setPlayButtonText(PAUSE_TEXT);
        props.onPress(true);

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
        props.onMovePlay('');
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

        const currentMove = combo[moveIndex];

        loadAndPlaySound(currentMove.file);
        // console.log('Load and Play', currentMove.title);
        if (currentMove.title !== 'Ding') {
            props.onMovePlay(combo[moveIndex].title.toUpperCase());
        }
        setTimeout(() => {
            moveIndex++;
            playMoveSet(combo, moveIndex);
        }, MOVE_GAP_TIME);
    }

    React.useEffect(() => {
        if (props.resetFired) {
            console.log('PlayButton Reset Fired. Props:', props);
            stopRound(musicSound);
        }
    }, [props.resetFired]);

    return (
        <TouchableOpacity
            onPress={playPressedHandler}
            style={styles.roundButton}
        >
            <Text style={styles.buttonText}>{playButtonText}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    roundButton: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: 'orangered',

    },
    buttonText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#222',
    }
});
