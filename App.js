import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';

import PlayButton from './PlayButton';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>
                Become a Boxing Hero!
            </Text>

            <PlayButton />

            <StatusBar style="auto" />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
    },
    text: {
        color: '#fff',
        fontWeight: 'bold',
        padding: 10
    },
});
