import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons'

import colors from '../config/colors';

function AddButton({style, onPress}) {
    return (
        <TouchableOpacity activeOpacity={0.4} onPress={onPress}>
            <View style={[styles.button, style]}>
                <MaterialCommunityIcons name='plus' size={50} color='#fff' />
            </View>
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