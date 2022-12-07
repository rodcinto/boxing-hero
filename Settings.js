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

import {saveData, readData} from './components/localStorage';

const defaultSettings = {
    roundTime: 120,
    comboSpeed: 5,
    comboSize: 5
};

function SettingsTextInput({ label, fieldKey, placeholder, onChangeText, value }) {
    function onChange(value) {
        onChangeText(fieldKey, value);
    }
    return (
        <View style={formStyles.row}>
            <Text style={formStyles.label}>{label}</Text>
            <TextInput
                keyboardType='numeric'
                maxLength={3}
                style={formStyles.textInput}
                onChangeText={onChange}
                placeholder={placeholder}
                defaultValue={value}
            />
        </View>
    );
}

function SettingsModal({ modalVisible, closeModal, currentSettings={} }) {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            style={styles.modalDialog}
        >
            <ScrollView>
                <View style={styles.modalView}>
                    <SettingsTextInput
                        label='Round Time (seconds)'
                        fieldKey='roundTime'
                        placeholder='Unlimited'
                        onChangeText={saveData}
                        value={currentSettings.roundTime ?? defaultSettings.roundTime}
                    />
                    <SettingsTextInput
                        label='Combo Speed (seconds)'
                        fieldKey='comboSpeed'
                        placeholder='In Seconds'
                        onChangeText={saveData}
                        value={currentSettings.comboSpeed ?? defaultSettings.comboSpeed}
                    />
                    <SettingsTextInput
                        label='Combo Max Size'
                        fieldKey='comboSize'
                        placeholder='Ex. 5'
                        onChangeText={saveData}
                        value={currentSettings.comboSize ?? defaultSettings.comboSize}
                    />
                    <Pressable
                        style={styles.buttonClose}
                        onPress={() => closeModal(!modalVisible)}
                    >
                        <Text style={styles.closeModalText}>CLOSE</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </Modal>
    );
}

export default function Settings() {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [currentSettings, setCurrentSettings] = React.useState({});

    async function settingsPressHandler() {
        setCurrentSettings({
            roundTime: await readData('roundTime'),
            comboSpeed: await readData('comboSpeed'),
            comboSize: await readData('comboSize')
        });
        setModalVisible(true);
    }
    return (
        <>
            <SettingsModal
            modalVisible={modalVisible}
            closeModal={setModalVisible}
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
        margin: 10,
        width: '95%'
    },
    label: {
        marginBottom: 5
    },
    textInput: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        borderRadius: 5
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
