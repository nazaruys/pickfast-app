import React from 'react';
import { StyleSheet, View } from 'react-native';

import BackButton from './BackButton';
import AppText from './AppText';

function AppHeader({title}) {
    return (
        <View style={styles.header}>
            <BackButton style={styles.icon} />
            <AppText style={styles.headerTitle}>{title}</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5%',
        height: 60,
    },
    headerTitle: {
        position: 'absolute',
        left: '50%',
        transform: [{ translateX: -50 }],
        fontSize: 24,
        fontWeight: '700',
    }
})

export default AppHeader;