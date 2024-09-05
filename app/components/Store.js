import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ripple from 'react-native-material-ripple';

import colors from '../config/colors';import AppText from './AppText';

function Store({ store, handlePress }) {
    return (
        <Ripple rippleOpacity={0.2} onPress={handlePress} style={styles.rippleContainer}>
            <View style={styles.container}>
                <AppText
                    style={styles.name}
                    numberOfLines={1}
                    >
                    {store.name}
                </AppText>
                <AppText
                    style={styles.subTitle}>
                    {store.products_count ?? 0} {store.products_count === 1 ? "product" : "products"}
                </AppText>
            </View>
        </Ripple>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 17,
        backgroundColor: colors.white,
        borderColor: colors.grey,
        borderWidth: 0.4,
        borderRadius: 1,
    },
    rippleContainer: {
        marginVertical: 10
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