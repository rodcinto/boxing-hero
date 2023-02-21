import { readInteger, readBoolean } from './localStorage';

export const defaultSettings = {
    roundTime: 0,
    comboSpeed: 5,
    comboSize: 5,
    muted: true
}

export async function loadSettings() {
    const parsedSettings = {};
    parsedSettings.roundTime  = await readInteger('roundTime');
    parsedSettings.comboSpeed = await readInteger('comboSpeed');
    parsedSettings.comboSize = await readInteger('comboSize');
    parsedSettings.muted = await readBoolean('muted');

    return parsedSettings;
}
