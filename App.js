import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, SafeAreaView, TouchableOpacity } from 'react-native';

export default function App() {
    function buttonClickedHandler() {
        console.log('PLAY PUSHED!');
    }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>
                Become a Boxing Hero!
            </Text>

            <TouchableOpacity
                onPress={buttonClickedHandler}
                style={styles.roundButton}>
                <Text>PLAY</Text>
            </TouchableOpacity>

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
    roundButton: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        borderRadius: 100,
        backgroundColor: '#A00',
        color: '#fff',
        fontWeight: 'bold',
    },
});
