import React, { useState } from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import colors from '../config/colors';
import Checkbox from './Checkbox';
import AppText from './AppText';

function Product({ product, handlePress, onCheck, stores, productsActive }) {
    const [isBought, setIsBought] = useState(!productsActive.some(prod => prod.id === product.id))

    const store = stores && stores.find(store => store.id === product.store_id)

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={[
                styles.container,
                { opacity: isBought ? 0.5 : 1 }
            ]}>
                <Checkbox
                    style={styles.checkbox}
                    priority={product.priority}
                    onPress={onCheck}
                    isBought={isBought}
                    setIsBought={setIsBought}
                />
                <AppText
                    style={styles.title}
                    numberOfLines={2}>
                    {product.title}
                </AppText>
                {store && <AppText
                    style={[styles.subTitle, { color: isBought ? colors.grey : colors.tiffany }]}>
                    {store.name}
                </AppText>}
            </View> 
        </TouchableWithoutFeedback>
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
        borderRadius: 5,
        elevation: 3,
    },
    checkbox: {
        marginRight: 30
    },
    title: {
        flex: 1
    },
    subTitle: {
        color: colors.tiffany,
        fontSize: 16,
        marginLeft: 25
    }
})

export default Product;