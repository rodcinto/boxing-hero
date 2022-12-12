import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

import { soundtrack1 } from '../soundData/musics/soundtrack1';
import { boxingBell } from '../soundData/boxingBell';
import { ding } from '../soundData/ding';
import { moveSoundList } from '../soundData/moves/moveSoundList';

import { shuffle } from '../utils/shuffle';
import { defaultSettings, loadSettings } from '../utils/settings';

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
    let COMBO_MAX = defaultSettings.comboSize;
    let COMBO_GAP_TIME = defaultSettings.comboSpeed * 1000;

    async function playPressedHandler() {
        await updatePreferences();

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

    async function updatePreferences() {
        const currentSettings = await loadSettings();
        console.log('Updated settings', currentSettings);
        COMBO_GAP_TIME = (currentSettings.comboSpeed ?? defaultSettings.comboSpeed) * 1000;
        COMBO_MAX = (loadSettings.comboSize ?? defaultSettings.comboSize);
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
        console.log('PlayButtonProps', props);
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
