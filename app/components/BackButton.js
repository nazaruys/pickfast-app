import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {MaterialIcons} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

import AppText from './AppText'

function BackButton({style}) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={[styles.container, style]}>
                    <MaterialIcons style={styles.icon} name="keyboard-arrow-left" size={30} color="black" />
                    <AppText style={styles.text}>Back</AppText>
                </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingLeft: 0,
    },
    icon: {
        marginRight: -6
    },
    text: {

        }
})

export default BackButton;