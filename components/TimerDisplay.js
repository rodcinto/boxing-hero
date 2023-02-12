import React from 'react';
import StopwatchTimer, {
    StopwatchTimerMethods
  } from 'react-native-animated-stopwatch-timer';

export default function TimerDisplay(props) {
    const stopwatchTimerRef = React.useRef(null);
    const [timerState, setTimerState] = React.useState('stopped');

    function play() {
        stopwatchTimerRef.current?.play();
        setTimerState('running');
    }

    function pause() {
        stopwatchTimerRef.current?.pause();
        setTimerState('paused');
    }

    function reset() {
        stopwatchTimerRef.current?.reset();
        setTimerState('stopped');
    }

    function finish() {
        if (timerState === 'stopped') {
            // props.onTimerZero();
        }
    }

    React.useEffect(() => {
        if (props.active) {
            play();
        } else {
            pause();
        }
    }, [props.active]);

    React.useEffect(() => {
        if (props.resetFired) {
            reset();
        }
    }, [props.resetFired]);

    return (
        <StopwatchTimer
            leadingZeros={2}
            trailingZeros={2}
            ref={stopwatchTimerRef}
            initialTimeInMs={props.roundTime * 1000}
            onFinish={finish()}
            enterAnimationType={'slide-in-up'}
            containerStyle={stopwatchStyles.stopWatchContainer}
            textCharStyle={stopwatchStyles.stopWatchChar}
        />
    );
}

const stopwatchStyles = {
    stopWatchContainer: {
        paddingVertical: 16,
        paddingHorizontal: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        backgroundColor: '#313131',
        borderColor: 'white',
        borderRadius: 5,
        padding: 14,
        margin: 10,
        width: 310,
    },
    stopWatchChar: {
        fontSize: 45,
        color: 'gold',
        fontWeight: 'bold',
        letterSpacing: 1,
    },
};
