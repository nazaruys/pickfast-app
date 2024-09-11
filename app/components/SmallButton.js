import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import colors from '../config/colors';
import AppText from './AppText';

function SmallButton({style, title, onPress, icon = true, activeOpacity = 0.2}) {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={activeOpacity}>
            <View style={[styles.button, style]}>
                <AppText style={styles.text}>{title}</AppText>
                {icon && <MaterialIcons name="keyboard-arrow-right" size={20} color="white" />}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '90%',
        backgroundColor: colors.primary,
        borderRadius: 7,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
        paddingVertical: '2%',
    },
    text: {
        fontSize: 15,
        color: 'white'
    }
})

export default SmallButton;