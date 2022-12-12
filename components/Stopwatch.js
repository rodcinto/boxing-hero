import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

import { defaultSettings, loadSettings } from '../utils/settings';

let ROUND_TIME = defaultSettings.roundTime;

function Timer({ interval }) {
    const pad = (n) => n < 10 ? '0' + n : n;
    const duration = moment.duration(interval);
    const centiseconds = Math.floor(duration.milliseconds() / 10);

    return (
        <View style={styles.timerContainer}>
            <Text style={styles.text}>{pad(duration.minutes())}</Text>
            <Text style={[styles.text, styles.colon]}>:</Text>
            <Text style={styles.text}>{pad(duration.seconds())}</Text>
            <Text style={[styles.text, styles.colon]}>:</Text>
            <Text style={styles.text}>{pad(centiseconds)}</Text>
        </View>
    );
}

export default function Stopwatch({ active, resetFired, onTimerZero }) {
    const [state, setState] = React.useState({
        startTime: 0,
        nowTime: 0,
        elapsedTime: 0,
        stopped: true
    });
    const [runningTimer, setRunningTimer] = React.useState(0);

    const { nowTime, startTime } = state;

    const start = async () => {
        clearTimer();
        await updatePreferences();
        const startTime = defineStartTime();
        setState({
            startTime: startTime,
            nowTime: startTime,
            elapsedTime: 0,
            stopped: false
        });

        let elapsedTime = 0;
        const currentInteval = setInterval(() => {
            const nowDate = new Date();
            elapsedTime += 100;
            setState({
                startTime: startTime,
                nowTime: nowDate.getTime(),
                elapsedTime: elapsedTime,
                stopped: false
            });
        }, 100);
        setRunningTimer(currentInteval);
        console.log('Start Running Timer', runningTimer);
    }

    const resume = () => {
        clearTimer();
        const startTime = defineStartTime();
        setState({
            startTime: startTime,
            nowTime: nowTime,
            stopped: false
        });

        let elapsedTime = 0;
        const currentInteval = setInterval(() => {
            elapsedTime += 100;
            setState({
                startTime: startTime,
                nowTime: new Date().getTime(),
                elapsedTime: elapsedTime,
                stopped: false
            });
        }, 100);

        setRunningTimer(currentInteval);
        console.log('Resume Running Timer', runningTimer);
    }

    const pause = () => {
        clearTimer();

        setState({
            startTime: state.startTime,
            nowTime: state.nowTime,
            elapsedTime: state.elapsedTime,
            stopped: true
        });
    }

    const stopAndReset = () => {
        clearTimer();
        setRunningTimer(0);
        setState({
            startTime: 0,
            nowTime: 0,
            elapsedTime: 0,
            stopped: true
        });
    }

    const clearTimer = () => {
        if (runningTimer) {
            clearInterval(runningTimer);
            setRunningTimer(0);
        }
    }

    async function updatePreferences() {
        const currentSettings = await loadSettings();

        ROUND_TIME = (parseInt(currentSettings.roundTime)> 0) ?
            parseInt(currentSettings.roundTime) :
            parseInt(defaultSettings.roundTime);
    }

    function defineStartTime() {
        const date = new Date();
        date.setSeconds(date.getSeconds() + ROUND_TIME);
        if (ROUND_TIME > 0 && state.elapsedTime > 0) {
            date.setMilliseconds(date.getMilliseconds() - state.elapsedTime);
        }
        return date.getTime();
    }

    function calculateInterval() {
        let diff = nowTime - startTime
        if (ROUND_TIME > 0) {
            diff =  startTime - nowTime;
        }

        if (diff < 0 && active && !resetFired) {
            stopAndReset();
            onTimerZero();
            return 0;
        }

        return diff;
    }

    React.useEffect(() => {
        if (resetFired) {
            console.log('STOP WATCH');
            stopAndReset();
            return;
        }

        if (active) {
            if (state.nowTime === 0) {
                console.log('START WATCH');
                start();
            } else if(state.stopped) {
                console.log('RESUME WATCH');
                resume();
            }
            return;
        }

        if (!active && runningTimer !== 0) {
            console.log('PAUSE WATCH');
            console.log('Elapsed Time', state.elapsedTime);
            pause();
        }
    });

    return (
        <>
            <Timer interval={calculateInterval()} />
            {/* <TouchableOpacity
                onPress={start}
                style={styles.button}>
                <Text style={styles.buttonText}>START</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={stop}
                style={styles.button}>
                <Text style={styles.buttonText}>STOP</Text>
            </TouchableOpacity> */}
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#aaa'
    },
    buttonText: {
        color: '#000'
    },
    timerContainer: {
        flexDirection: 'row',
        padding: 10,
        width: 346
    },
    text: {
        color: 'gold',
        fontSize: 80,
        width: 115
    },
    colon: {
        width: 'auto'
    }
});
