import * as React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity
} from 'react-native';

export default function MusicButton(props) {
    return (
        <TouchableOpacity
            style={[styles.musicButton, props.muted ? styles.mutedMusicButton : {}]}
            onPress={props.onPress}>
            <Text style={[styles.musicButtonText, props.muted ? styles.mutedButtonText : {}]}>
                MUSIC
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    musicButton: {
        backgroundColor: '#333',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'white',
        width: '20%'
    },
    mutedMusicButton: {
        backgroundColor: '#eee'
    },
    musicButtonText: {
        color: '#eee',
        textAlign: 'center',
        fontSize: 16
    },
    mutedButtonText: {
        color: '#333'
    }
});
