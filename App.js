import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, View } from 'react-native';

import PlayButton from './PlayButton';
import Stopwatch from './Stopwatch';

export default function App() {
    const [stopwatch, setStopwatch] = React.useState({
        active: false
    });

    function onPlayButtonPress(signal) {
        setStopwatch(signal);
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>
                Become a Boxing Hero!
            </Text>

            <Stopwatch active={stopwatch.active} />

            <PlayButton onPress={onPlayButtonPress} />

            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        padding: 10
    },
});
