import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';

import player from '../soundPlayer/player';

import { soundtrack1 } from '../soundData/musics/soundtrack1';
import { boxingBell } from '../soundData/boxingBell';
import { ding } from '../soundData/ding';
import { moveSoundList } from '../soundData/moves/moveSoundList';

import { shuffle } from '../utils/shuffle';

export default function MoveDisplay(props) {
    const comboTimeoutRef = React.useRef(null);
    const moveTimeoutRef = React.useRef(null);

    const [hasStarted, setHasStarted] = React.useState(false);
    const [music, setMusic] = React.useState();
    const [moveText, setMoveText] = React.useState();

    const INTRO_TIME = 3000;
    const AFTER_RESUME_TIME = 2000;
    const COMBO_GAP_TIME = props.comboSpeed * 1000;
    const COMBO_MIN = 1;
    const MOVE_GAP_TIME = Platform.select({
        android: 500,
        web: 500
    });

    const COMBO_MAX = props.comboSize;

    function startRound() {
        setHasStarted(true);
        player.playFile(boxingBell.file);

        if (!props.muted) {
            loadMusic();
        }

        comboTimeoutRef.current = setTimeout(playCombo, INTRO_TIME);

        console.log('START ROUND', props);
    }

    async function pauseRound() {
        if (hasStarted) {
            player.pauseSound(music);
        }

        clearTimeout(comboTimeoutRef.current);
        clearTimeout(moveTimeoutRef.current);

        console.log('PAUSE ROUND', props);
    }

    function resumeRound() {
        player.playFile(boxingBell.file);
        player.playSound(music);

        comboTimeoutRef.current = setTimeout(playCombo, AFTER_RESUME_TIME);

        console.log('RESUME ROUND', props);
    }

    function stopRound() {
        if (hasStarted) {
            player.stopSound(music);
            setMusic(null);
            setHasStarted(false);
        }

        clearTimeout(comboTimeoutRef.current);
        clearTimeout(moveTimeoutRef.current);

        setMoveText('');
    }

    async function loadMusic() {
        const sound = await player.playFile(soundtrack1.file);
        console.log("MUSIC SOUND", sound);
        setMusic(sound);
    }

    const playCombo = React.useCallback(async () => {
        const combo = shuffle(moveSoundList, COMBO_MAX, COMBO_MIN);
        combo.push(ding);
        console.log("Combo:", combo);

        await playMoveSet(combo).then(() => {
            comboTimeoutRef.current = setTimeout(playCombo, COMBO_GAP_TIME);
        });
    }, [COMBO_GAP_TIME, ding, moveSoundList, playMoveSet]);

    const playMoveSet = React.useCallback(
        async (combo, moveIndex = 0) => {
          if (moveIndex >= combo.length) {
            return;
          }

          const currentMove = combo[moveIndex];

          console.log("Load and Play", currentMove);
          player.playFile(currentMove.file);

          if (currentMove.title !== "Ding") {
            setMoveText(combo[moveIndex].title.toUpperCase());
          }

          moveTimeoutRef.current = setTimeout(() => {
            playMoveSet(combo, ++moveIndex);
          }, MOVE_GAP_TIME);
        },
        [MOVE_GAP_TIME]
      );

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
