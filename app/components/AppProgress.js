import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import * as Progress from 'react-native-progress';
import colors from '../config/colors';


function AppProgress({loading}) {
    return (
        <Modal
            transparent={true}
            animationType="none"
            visible={loading}
            onRequestClose={() => {}}
        >
            <View style={styles.modalBackground}>
                <Progress.Circle size={100} indeterminate={true} color={colors.green} />
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
})

export default AppProgress;