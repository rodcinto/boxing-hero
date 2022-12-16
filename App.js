import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, View } from 'react-native';

import PlayButton from './components/PlayButton';
import ResetButton from './components/ResetButton';
import TimerDisplay from './components/TimerDisplay';
import SettingsButton from './components/SettingsButton';

import { defaultSettings, loadSettings } from './utils/settings';

export default function App() {
    const [state, setState] = React.useState({
        roundActive: false,
        reset: false,
        moveText: '',
        appSettings: defaultSettings
    });

    async function onPlayButtonPress(active) {
        setState(prevState => {
            const newState = { roundActive: active };
            if (active) {
                newState.reset = false;
            }
            return ({ ...prevState, ...newState });
        });
    }

    function fireResetSignal() {
        setState(prevState => (
            {
                ...prevState,
                roundActive: false,
                reset: true
            }
        ));
    }

    function onMovePlay(text) {
        setState(prevState => ({ ...prevState, moveText: text }));
    }

    function updateSettings(newSettings) {
        setState(prevState => {
            console.log('New Settings', newSettings);
            return ({ ...prevState, appSettings: { ...state.appSettings, ...newSettings } });
        });
    }

    React.useEffect(() => {
        loadSettings().then((loadedSettings) => updateSettings(loadedSettings));
    }, []);

    React.useEffect(() => {
        console.log('AppSettings updated:', state.appSettings);
        fireResetSignal();
    }, [state.appSettings]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.movesDisplay}>
                <Text style={styles.moveText}>{state.moveText}</Text>
            </View>

            <TimerDisplay
                active={state.roundActive}
                resetFired={state.reset}
                onTimerZero={fireResetSignal}
                roundTime={state.appSettings.roundTime}
            />

            <PlayButton
                active={state.roundActive}
                onPress={onPlayButtonPress}
                resetFired={state.reset}
                onMovePlay={onMovePlay}
                comboSize={state.appSettings.comboSize}
                comboSpeed={state.appSettings.comboSpeed}
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
