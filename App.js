import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';

import PlayButton from './components/PlayButton';
import ResetButton from './components/ResetButton';
import TimerDisplay from './components/TimerDisplay';
import SettingsButton from './components/SettingsButton';

import { defaultSettings, loadSettings } from './utils/settings';
import MoveDisplay from './components/MoveDisplay';

const initialState = {
    roundActive: false,
    reset: false,
    moveText: '',
    appSettings: defaultSettings
};

function reducer(state, action) {
    switch (action.type) {
        case 'updateSettings':
            console.log('UpdateSettings', action);
            const newSettings = {};
            newSettings.roundTime = defaultSettings.roundTime;
            newSettings.comboSize = defaultSettings.comboSize;
            newSettings.comboSpeed = defaultSettings.comboSpeed;
            if (action.value) {
                newSettings.roundTime = action.value.roundTime ?? defaultSettings.roundTime;
                newSettings.comboSize = action.value.comboSize ?? defaultSettings.comboSize;
                newSettings.comboSpeed = action.value.comboSpeed ?? defaultSettings.comboSpeed;
            }
            return {
                ...state,
                appSettings: newSettings
            };
        case 'start':
            console.log('Start');
            return { ...state, roundActive: true, reset: false };
        case 'pause':
            console.log('Pause');
            return { ...state, roundActive: false, reset: false };
        case 'reset':
            console.log('Reset');
            return { ...state, roundActive: false, reset: true };
        default:
            throw new Error('I do not know this action');
    }
}

export default function App() {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    async function onPlayButtonPress() {
        if (state.roundActive) {
            dispatch({ type: 'pause' });
            return;
        }
        dispatch({ type: 'start' });
    }

    function updateSettings(newSettings) {
        console.log('New Settings', newSettings);

        dispatch({
            type: 'updateSettings',
            value: newSettings
        });
    }

    React.useEffect(() => {
        loadSettings().then((loadedSettings) => {
            console.log('Loaded settings', loadedSettings);
            return dispatch({
                type: 'updateSettings',
                value: loadedSettings
            });
        });
    }, []);

    React.useEffect(() => {
        console.log('AppSettings updated:', state);
        dispatch({ type: 'reset' });
    }, [state.appSettings]);

    return (
        <SafeAreaView style={styles.container}>
            <MoveDisplay
                active={state.roundActive}
                resetFired={state.reset}
                comboSize={state.appSettings.comboSize}
                comboSpeed={state.appSettings.comboSpeed}
            />

            <TimerDisplay
                active={state.roundActive}
                resetFired={state.reset}
                onTimerZero={() => dispatch({ type: 'reset' })}
                roundTime={state.appSettings.roundTime}
            />

            <PlayButton
                active={state.roundActive}
                reset={state.reset}
                onPress={onPlayButtonPress}
            />

            <ResetButton onPress={() => dispatch({ type: 'reset' })} />

            <SettingsButton onUpdate={updateSettings} />

            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
