import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Audio } from 'expo-av';

import { soundtrack1 } from '../soundData/musics/soundtrack1';
import { boxingBell } from '../soundData/boxingBell';
import { ding } from '../soundData/ding';
import { moveSoundList } from '../soundData/moves/moveSoundList';

import { shuffle } from '../utils/shuffle';

function loadAndPlaySound(file) {
    Audio.Sound.createAsync(file)
        .then(({ sound }) => {
            sound.playAsync();
        });
}

export default function MoveDisplay(props) {
    const [musicSound, setMusicSound] = React.useState();
    const [comboTimeout, setComboTimeout] = React.useState();
    const [moveTimeout, setMoveTimeout] = React.useState();
    const [moveText, setMoveText] = React.useState();

    const INTRO_TIME = 3000;
    const AFTER_RESUME_TIME = 2000;
    const MOVE_GAP_TIME = 500;

    const COMBO_MIN = 1;
    let COMBO_MAX = props.comboSize;
    let COMBO_GAP_TIME = props.comboSpeed * 1000;

    function startRound() {
        loadAndPlaySound(boxingBell.file);
        loadMusic(soundtrack1);

        setComboTimeout(setTimeout(playCombo, INTRO_TIME));

        console.log('START ROUND', props);
    }

    async function pauseRound(musicData) {
        if (musicData) {
            await musicData.pauseAsync();
        }

        clearTimeout(comboTimeout);
        clearTimeout(moveTimeout);

        console.log('PAUSE ROUND', props);
    }

    async function resumeRound(musicData) {
        loadAndPlaySound(boxingBell.file);
        await musicData.playAsync();

        setComboTimeout(setTimeout(playCombo, AFTER_RESUME_TIME));

        console.log('RESUME ROUND', props);
    }

    async function stopRound(musicData) {
        if (musicData) {
            await musicData.stopAsync();
            await musicData.unloadAsync();
            setMusicSound(null);
        }

        clearTimeout(comboTimeout);
        clearTimeout(moveTimeout);

        setMoveText('');
    }

    function loadMusic(musicData) {
        Audio.Sound.createAsync(musicData.file)
            .then(({ sound }) => {
                setMusicSound(sound);
                sound.playAsync();
            });
    }

    async function playCombo() {
        const combo = shuffle(moveSoundList, COMBO_MAX, COMBO_MIN);
        combo.push(ding);
        console.log('Combo:', combo);

        playMoveSet(combo).then(() => {
            setComboTimeout(setTimeout(playCombo, COMBO_GAP_TIME));
        });
    }

    async function playMoveSet(combo, moveIndex = 0) {
        if (moveIndex >= combo.length) {
            return;
        }

        const currentMove = combo[moveIndex];

        loadAndPlaySound(currentMove.file);
        console.log('Load and Play', currentMove.title);

        if (currentMove.title !== 'Ding') {
            setMoveText(combo[moveIndex].title.toUpperCase());
        }
        setMoveTimeout(setTimeout(() => {
            moveIndex++;
            playMoveSet(combo, moveIndex);
        }, MOVE_GAP_TIME));
    }

    React.useEffect(() => {
        if (props.resetFired) {
            console.log('PlayButton Reset Fired. Props:', props);
            stopRound(musicSound);
        }
    }, [props.resetFired]);

    React.useEffect(() => {
        if (props.active) {
            if (musicSound) {
                resumeRound(musicSound);
            } else {
                startRound();
            }
        } else {
            pauseRound(musicSound);
        }
    }, [props.active]);

    return (
        <View style={styles.movesDisplay}>
            <Text style={styles.moveText}>{moveText}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    movesDisplay: {
        padding: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'cornflowerblue',
        borderColor: 'white',
        borderWidth: 3,
        height: 200,
        width: '80%',
        borderRadius: 10
    },
    moveText: {
        color: 'cornsilk',
        fontSize: 50
    },
});
