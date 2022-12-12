import {readData} from './localStorage';

export const defaultSettings = {
    roundTime: 0,
    comboSpeed: 5,
    comboSize: 5
}

export async function loadSettings() {
    return {
        roundTime: await readData('roundTime'),
        comboSpeed: await readData('comboSpeed'),
        comboSize: await readData('comboSize')
    };
}
