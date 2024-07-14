import React from 'react';
import { StyleSheet, TouchableOpacity} from 'react-native';

import colors from '../config/colors';
import AppText from './AppText';

function AppButton({title, onPress, style, color = colors.primary, textColor = colors.white}) {
    return (
        <TouchableOpacity style={[styles.container, {backgroundColor: color}, style]} onPress={onPress}>
            <AppText style={[styles.text, {color: textColor}]}>{title}</AppText>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 80,
        backgroundColor: colors.primary,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text: {
        color: colors.white,
        fontSize: 20,
    }
})

export default AppButton;