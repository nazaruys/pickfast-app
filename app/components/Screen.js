import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Screen({ children, style }) {
    return (
        <SafeAreaView style={[styles.screen, {backgroundColor: style.backgroundColor}]}>
            <View style={[styles.screen, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    }
})

export default Screen;