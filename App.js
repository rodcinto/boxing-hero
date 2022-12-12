import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, View } from 'react-native';

import PlayButton from './components/PlayButton';
import ResetButton from './components/ResetButton';
import Stopwatch from './components/Stopwatch';
import SettingsButton from './components/SettingsButton';

import { defaultSettings, loadSettings } from './utils/settings';

export default function App() {
    const [appSettings, setAppSettings] = React.useState(defaultSettings);

    const [stopwatch, setStopwatch] = React.useState({
        active: false,
    });

    const [resetSignal, setResetSignal] = React.useState({
        fired: undefined
    });

    const [moveText, setMoveText] = React.useState('');

    async function onPlayButtonPress(signal) {
        setAppSettings({
            ...appSettings,
            ...await loadSettings()
        });
        setStopwatch(signal);
    }

    function fireResetSignal() {
        console.log('SHOULD RESET');
        setResetSignal({
            fired: true
        });
    }

    function onMovePlay(text) {
        setMoveText(text);
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
            <View style={styles.movesDisplay}>
                <Text style={styles.moveText}>{moveText}</Text>
            </View>

            <Stopwatch
                active={stopwatch.active}
                resetFired={resetSignal.fired}
                onTimerZero={fireResetSignal}
            />

            <PlayButton
                onPress={onPlayButtonPress}
                resetFired={resetSignal.fired}
                onMovePlay={onMovePlay}
            />

            <ResetButton onPress={fireResetSignal} />

            <SettingsButton />

            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    movesDisplay: {
        padding: 10,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'cornflowerblue',
        height: 200,
        width: '80%',
        borderRadius: 10
    },
    moveText: {
        color: 'cornsilk',
        fontSize: 50
    },
    container: {
        flex: 1,
        backgroundColor: '#222',
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
