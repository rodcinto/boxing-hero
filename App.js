import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, View } from 'react-native';

import PlayButton from './components/PlayButton';
import ResetButton from './components/ResetButton';
import TimerDisplay from './components/TimerDisplay';
import SettingsButton from './components/SettingsButton';

import { defaultSettings, loadSettings } from './utils/settings';

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
            return {
                ...state,
                appSettings: {
                    roundTime: action.value.roundTime ?? 0,
                    comboSize: action.value.comboSize,
                    comboSpeed: action.value.comboSpeed,
                }
            };
        case 'updateMove':
            console.log('updateMove');
            return { ...state, moveText: action.value };
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

    function onMovePlay(text) {
        dispatch({ type: 'updateMove', value: text });
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
            <View style={styles.movesDisplay}>
                <Text style={styles.moveText}>{state.moveText}</Text>
            </View>

            <TimerDisplay
                active={state.roundActive}
                resetFired={state.reset}
                onTimerZero={() => dispatch({ type: 'reset' })}
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

            <ResetButton onPress={() => dispatch({ type: 'reset' })} />

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
