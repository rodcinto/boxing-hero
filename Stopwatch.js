import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import moment from 'moment';

function Timer({ interval }) {
    const pad = (n) => n < 10 ? '0' + n : n;
    const duration = moment.duration(interval);
    const centiseconds = Math.floor(duration.milliseconds() / 10);

    return (
        <View style={styles.timerContainer}>
            <Text style={styles.text}>{pad(duration.minutes())}:</Text>
            <Text style={styles.text}>{pad(duration.seconds())}:</Text>
            <Text style={styles.text}>{pad(centiseconds)}</Text>
        </View>
    );
}

export default function Stopwatch({ active, resetFired }) {
    const [state, setState] = React.useState({
        startTime: 0,
        nowTime: 0,
        stopped: true
    });
    const [runningTimer, setRunningTimer] = React.useState(0);

    const { nowTime, startTime } = state;

    const start = () => {
        clearTimer();
        const now = new Date().getTime();
        setState({
            startTime: now,
            nowTime: now
        });
        const currentInteval = setInterval(() => {
            setState({
                startTime: now,
                nowTime: new Date().getTime(),
                stopped: false
            });
        }, 100);
        setRunningTimer(currentInteval);
        console.log('Start Running Timer', runningTimer);
    }

    const resume = () => {
        clearTimer();
        setState({
            startTime: startTime,
            nowTime: nowTime,
            stopped: false
        });
        const currentInteval = setInterval(() => {
            setState({
                startTime: startTime,
                nowTime: new Date().getTime(),
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
            stopped: true
        });
    }

    const stopAndReset = () => {
        clearTimer();
        setRunningTimer(0);
        setState({
            startTime: 0,
            nowTime: 0,
            stopped: true
        });
    }

    const clearTimer = () => {
        if (runningTimer) {
            clearInterval(runningTimer);
            setRunningTimer(0);
        }
    }

    React.useEffect(() => {
        if (active) {
            if (state.nowTime === 0) {
                console.log('START WATCH');
                start();
            } else if(state.stopped) {
                console.log('RESUME WATCH');
                resume();
            }
        }

        if (!active && runningTimer !== 0) {
            console.log('PAUSE WATCH');
            pause();
        }

        if (resetFired) {
            console.log('STOP WATCH');
            stopAndReset();
        }
    });

    return (
        <>
            <Timer interval={nowTime - startTime} />
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
        padding: 10
    },
    text: {
        color: 'gold',
        fontSize: 80
    }
});
