import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import colors from '../config/colors';import AppText from './AppText';
import token from '../config/token';


function Store({ store, handlePress }) {
    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.container}>
                <AppText
                    style={styles.name}
                    numberOfLines={1}
                    >
                    {store.name}
                </AppText>
                <AppText
                    style={styles.subTitle}>
                    {store.products_count ?? 0} products
                </AppText>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 25,
        paddingVertical: 17,
        marginVertical: 10,
        backgroundColor: colors.white,
        borderColor: colors.grey,
        borderWidth: 0.4,
        borderRadius: 1,
        elevation: 3,
    },
    name: {
        flex: 1
    },
    subTitle: {
        color: colors.tiffany,
        fontSize: 16,
        marginLeft: 25
    }
})

export default Store;