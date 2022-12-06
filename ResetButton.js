import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ResetButton({ onPress }) {
    function resetPressedHandler() {
        onPress();
    }

    return (
        <TouchableOpacity
            onPress={resetPressedHandler}
            style={styles.roundButton}>
            <Text style={styles.buttonText}>RESET</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    roundButton: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        margin: 20,
        borderRadius: 100,
        backgroundColor: '#ccc',

    },
    buttonText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#222',
    }
});
