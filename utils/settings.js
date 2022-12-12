import { readInteger } from './localStorage';

export const defaultSettings = {
    roundTime: 0,
    comboSpeed: 5,
    comboSize: 5
}

export async function loadSettings() {
    const parsedSettings = {};
    const parsedRoundTime = await readInteger('roundTime').then(roundTime => {
        return roundTime ?? null
    });
    if (parsedRoundTime) {
        parsedSettings.roundTime = parsedRoundTime;
    }
    parsedSettings.comboSpeed = await readInteger('comboSpeed'),
    parsedSettings.comboSize = await readInteger('comboSize')

    return parsedSettings;
}
