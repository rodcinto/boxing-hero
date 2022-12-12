import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@boxingHero:';

export async function saveData(fieldKey, value) {
    try {
        await AsyncStorage.setItem(STORAGE_KEY + fieldKey, value);
        console.log('Data successfully saved', fieldKey, value);
    } catch (e) {
        console.log('Failed to save the data to the storage', fieldKey, value, e);
    }
}
export async function readData(fieldKey) {
    try {
        return await AsyncStorage.getItem(STORAGE_KEY + fieldKey);
      } catch (e) {
        console.log('Failed to fetch the input from storage', fieldKey);
      }
}

export async function readInteger(fieldKey) {
    return await readData(fieldKey).then(value => parseInt(value));
}
