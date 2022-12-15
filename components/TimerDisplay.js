import React from 'react';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';

export default function TimerDisplay(props) {
    if (props.roundTime === 0) {
        return (
            <Stopwatch msecs
                start={props.active}
                reset={props.resetFired}
                options={stopwatchOptions}
            />
        );
    }

    return (
        <Timer msecs
            totalDuration={props.roundTime * 1000}
            start={props.active}
            reset={props.resetFired}
            options={stopwatchOptions}
        />
    );
}

const stopwatchOptions = {
    container: {
        backgroundColor: '#313131',
        borderRadius: 5,
        padding: 14,
        margin: 10,
        width: 310,
    },
    text: {
        fontSize: 45,
        color: 'gold',
    }
};
