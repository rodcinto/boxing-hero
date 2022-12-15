import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity } from 'react-native';

import PlayButton from './components/PlayButton';
import ResetButton from './components/ResetButton';
import TimerDisplay from './components/TimerDisplay';
import SettingsButton from './components/SettingsButton';

import { defaultSettings, loadSettings } from './utils/settings';

export default function App() {
    const [appSettings, setAppSettings] = React.useState(defaultSettings);
    const [state, setState] = React.useState({
        timerActive: false,
        reset: false,
        moveText: ''
    });

    async function onPlayButtonPress(timerActive) {
        setState(prevState => {
            let newState = { timerActive: timerActive };
            if (timerActive) {
                newState.reset = false;
            }
            return ({ ...prevState, ...newState });
        });
    }

    function fireResetSignal() {
        setState({
            timerActive: false,
            reset: true
        });
    }

    function onMovePlay(text) {
        setState({
            ...state,
            moveText: text
        });
    }

    function updateSettings(newSettings) {
        setAppSettings(oldSettings => {
            console.log('New Settings', newSettings);
            return ({ ...oldSettings, ...newSettings });
        });
    }

    React.useEffect(() => {
        loadSettings().then((loadedSettings) => setAppSettings({
            ...appSettings,
            ...loadedSettings
        }));
    }, []);

    React.useEffect(() => {
        console.log('AppSettings updated:', appSettings);
        fireResetSignal();
    }, [appSettings]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.movesDisplay}>
                <Text style={styles.moveText}>{state.moveText}</Text>
            </View>

            <TimerDisplay
                active={state.timerActive}
                resetFired={state.reset}
                onTimerZero={fireResetSignal}
                roundTime={appSettings.roundTime}
            />

            <PlayButton
                onPress={onPlayButtonPress}
                resetFired={state.reset}
                onMovePlay={onMovePlay}
                comboSize={appSettings.comboSize}
                comboSpeed={appSettings.comboSpeed}
            />

            <ResetButton onPress={fireResetSignal} />

            <SettingsButton onUpdate={updateSettings} />

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
