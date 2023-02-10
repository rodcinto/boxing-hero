import * as React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    View,
    Pressable,
    ScrollView,
    TextInput
} from 'react-native';
import Slider from '@react-native-community/slider'

import { saveData } from '../utils/localStorage';
import { defaultSettings, loadSettings } from '../utils/settings';

function SettingsInput({ label, fieldKey, placeholder, onChangeText, value, maxLimit = 3000 }) {
    const [internalValue, setInternalValue] = React.useState(value);
    function onChange(value) {
        if (!parseInt(value)) {
            value = 0;
        }
        setInternalValue(value);
        onChangeText(fieldKey, value);
    }
    return (
        <>
            <Text style={formStyles.label}>{label}</Text>
            <View style={formStyles.row}>
                <Slider
                    style={formStyles.slider}
                    maximumValue={maxLimit}
                    minimumValue={0}
                    minimumTrackTintColor="cornflowerblue"
                    maximumTrackTintColor="#000000"
                    step={1}
                    value={internalValue}
                    onValueChange={onChange}
                />
                <TextInput
                    keyboardType='numeric'
                    maxLength={4}
                    style={formStyles.textInput}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    value={internalValue.toString()}
                />
            </View>
        </>
    );
}

function SettingsModal({ modalVisible, closeModal, currentSettings = {} }) {
    const [newSettings, setNewSettings] = React.useState(currentSettings);
    function updateSettings(fieldKey, value) {
        saveData(fieldKey, value);

        setNewSettings(prevSettings => {
            const field = {};
            field[fieldKey] = value
            return ({ ...prevSettings, ...field });
        });
    }

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            style={styles.modalDialog}
        >
            <ScrollView>
                <View style={styles.modalView}>
                    <SettingsInput
                        label='Round Time (seconds)'
                        fieldKey='roundTime'
                        placeholder='Unlimited'
                        onChangeText={updateSettings}
                        value={currentSettings.roundTime ?? defaultSettings.roundTime}
                    />
                    <SettingsInput
                        label='Combo Interval (seconds)'
                        fieldKey='comboSpeed'
                        placeholder='In Seconds'
                        onChangeText={saveData}
                        value={currentSettings.comboSpeed ?? defaultSettings.comboSpeed}
                        maxLimit={6}
                    />
                    <SettingsInput
                        label='Combo Max Size'
                        fieldKey='comboSize'
                        placeholder='Ex. 5'
                        onChangeText={saveData}
                        value={currentSettings.comboSize ?? defaultSettings.comboSize}
                        maxLimit={10}
                    />
                    <Pressable
                        style={styles.buttonClose}
                        onPress={() => closeModal(newSettings)}
                    >
                        <Text style={styles.closeModalText}>Save & Close</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </Modal>
    );
}

export default function SettingsButton(props) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [currentSettings, setCurrentSettings] = React.useState({});

    async function settingsPressHandler() {
        setCurrentSettings(await loadSettings());
        setModalVisible(true);
    }
    function closeModalHandler(newSettings) {
        props.onUpdate(newSettings);
        setModalVisible(false);
    }
    return (
        <>
            <SettingsModal
                modalVisible={modalVisible}
                closeModal={closeModalHandler}
                currentSettings={currentSettings}
            />
            <TouchableOpacity
                onPress={settingsPressHandler}
                style={styles.settingsButton}>
                <Text style={styles.settingsButtonText}>SETTINGS</Text>
            </TouchableOpacity>
        </>
    );
}

const formStyles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        margin: 10,
        width: '95%'
    },
    label: {
        marginTop: 5,
        width: '100%',
    },
    textInput: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginTop: 1,
        marginLeft: 10,
        textAlign: 'center',
        width: '20%',
        alignSelf: 'right'
    },
    slider: {
        width: '60%',
        marginTop: 1,
        alignSelf: 'left'
    }

});
const styles = StyleSheet.create({
    modalDialog: {
        flex: 1,
        display: 'absolute',
        bottom: 30
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    settingsButton: {
        borderWidth: 2,
        borderColor: '#eee',
        width: 200,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        marginTop: 70,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    settingsButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#eee',
    },
    buttonClose: {
        backgroundColor: "#eee",
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginTop: 15
    },
    closeModalText: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: "center",
    },
});
