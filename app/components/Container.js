import React from 'react';
import { StyleSheet, View } from 'react-native';
import colors from '../config/colors';

function Container({style, children}) {
    return (
        <View style={[styles.container, style]}>{children}</View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: '5%'
    }
})

export default Container;