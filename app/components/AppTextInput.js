import React, { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import colors from '../config/colors';
import defaultStyles from '../config/styles'

const AppTextInput = forwardRef(({ placeholder, style, onChangeText, value, ...otherProps }, ref) => {
    const [text, setText] = useState(value || '');

    const handleTextChange = (input) => {
        const filteredInput = input.replace(/[^\p{L}\p{N}\p{P}\p{Zs}]/gu, '');
        setText(filteredInput);
        if (onChangeText) {
            onChangeText(filteredInput);
        }
    };

    return (
        <View style={[styles.container, style]}>
            <TextInput
                ref={ref}
                placeholder={placeholder} 
                style={defaultStyles.text}
                value={text}
                onChangeText={handleTextChange}
                {...otherProps}
            />
        </View>
    );
});

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