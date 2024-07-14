import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import colors from '../config/colors';
import defaultStyles from '../config/styles'

function AppTextInput({ placeholder, style, ...otherProps }) {
    return (
        <View style={[styles.container, style]}>
            <TextInput 
                placeholder={placeholder} 
                style={defaultStyles.text}
                {...otherProps}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.white,
        width: '100%', 
        height: 60,
        borderRadius: 12,
        justifyContent: 'center',
        paddingHorizontal: '5%'
    },
})

export default AppTextInput;