import { readInteger } from './localStorage';

export const defaultSettings = {
    roundTime: 0,
    comboSpeed: 5,
    comboSize: 5
}

export async function loadSettings() {
    const parsedSettings = {};
    parsedSettings.roundTime  = await readInteger('roundTime');
    parsedSettings.comboSpeed = await readInteger('comboSpeed'),
    parsedSettings.comboSize = await readInteger('comboSize')

    return parsedSettings;
}
