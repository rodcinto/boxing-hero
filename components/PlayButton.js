import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const PLAY_TEXT = 'PLAY';
const PAUSE_TEXT = 'PAUSE';
const RESUME_TEXT = 'RESUME';


export default function PlayButton(props) {
    const [playButtonText, setPlayButtonText] = React.useState(PLAY_TEXT);

    async function playPressedHandler() {
        props.onPress();

        if (props.active) {
            setPlayButtonText(PAUSE_TEXT);
        } else {
            setPlayButtonText(RESUME_TEXT);
        }
    }

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
