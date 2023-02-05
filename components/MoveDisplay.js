import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

import player from '../soundPlayer/player';

import { soundtrack1 } from '../soundData/musics/soundtrack1';
import { boxingBell } from '../soundData/boxingBell';
import { ding } from '../soundData/ding';
import { moveSoundList } from '../soundData/moves/moveSoundList';

import { shuffle } from '../utils/shuffle';

export default function MoveDisplay(props) {
    const [hasStarted, setHasStarted] = React.useState(false);
    const [music, setMusic] = React.useState();
    const [comboTimeout, setComboTimeout] = React.useState();
    const [moveTimeout, setMoveTimeout] = React.useState();
    const [moveText, setMoveText] = React.useState();

    const INTRO_TIME = 3000;
    const AFTER_RESUME_TIME = 2000;
    const COMBO_GAP_TIME = props.comboSpeed * 1000;
    const COMBO_MIN = 1;
    const MOVE_GAP_TIME = Platform.select({
        android: 1,
        web: 500
    });

    let COMBO_MAX = props.comboSize;

    function startRound() {
        setHasStarted(true);
        player.playFile(boxingBell.file);
        loadMusic();

        setComboTimeout(setTimeout(playCombo, INTRO_TIME));

        console.log('START ROUND', props);
    }

    async function pauseRound() {
        if (hasStarted) {
            player.pauseSound(music);
        }

        clearTimeout(comboTimeout);
        clearTimeout(moveTimeout);

        console.log('PAUSE ROUND', props);
    }

    async function resumeRound() {
        player.playFile(boxingBell.file);
        player.playSound(music);

        setComboTimeout(setTimeout(playCombo, AFTER_RESUME_TIME));

        console.log('RESUME ROUND', props);
    }

    async function stopRound() {
        if (hasStarted) {
            player.stopSound(music);
            setMusic(null);
            setHasStarted(false);
        }

        clearTimeout(comboTimeout);
        clearTimeout(moveTimeout);

        setMoveText('');
    }

    async function loadMusic() {
        const sound = await player.playFile(soundtrack1.file);
        console.log("MUSIC SOUND", sound);
        setMusic(sound);
    }

    async function playCombo() {
        const combo = shuffle(moveSoundList, COMBO_MAX, COMBO_MIN);
        combo.push(ding);
        console.log('Combo:', combo);

        await playMoveSet(combo).then(() => {
            setComboTimeout(setTimeout(playCombo, COMBO_GAP_TIME));
        });
    }

    async function playMoveSet(combo, moveIndex = 0) {
        if (moveIndex >= combo.length) {
            return;
        }

        const currentMove = combo[moveIndex];

        console.log('Load and Play', currentMove);
        await player.playFile(currentMove.file);

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
            stopRound();
        }
    }, [props.resetFired]);

    React.useEffect(() => {
        if (props.active) {
            if (hasStarted) {
                resumeRound();
            } else {
                startRound();
            }
        } else {
            pauseRound();
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
