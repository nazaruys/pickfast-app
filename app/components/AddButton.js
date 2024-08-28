import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons'

import colors from '../config/colors';

function AddButton({style, onPress}) {
    return (
        <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
            <MaterialCommunityIcons name='plus' size={50} color='#fff' />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 70,
        height: 70,
        backgroundColor: colors.primary,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default AddButton;