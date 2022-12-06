import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView } from 'react-native';

import PlayButton from './PlayButton';
import ResetButton from './ResetButton';
import Stopwatch from './Stopwatch';


export default function App() {
    const [stopwatch, setStopwatch] = React.useState({
        active: false,
    });
    const [resetSignal, setResetSignal] = React.useState({
        fired: undefined
    });

    function onPlayButtonPress(signal) {
        setStopwatch(signal);
    }

    function onResetButtonPress() {
        console.log('SHOULD RESET');
        setResetSignal({
            fired: true
        });
    }

    React.useEffect(() => {
        if (resetSignal.fired === true) {
            console.log('RESET FIRED');
            setResetSignal({
                fired: false
            });
        }
    }, [resetSignal]);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>
                Become a Boxing Hero!
            </Text>

            <Stopwatch active={stopwatch.active} resetFired={resetSignal.fired} />

            <PlayButton onPress={onPlayButtonPress} resetFired={resetSignal.fired} />

            <ResetButton onPress={onResetButtonPress} />

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
