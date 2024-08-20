import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import colors from '../config/colors';
import Checkbox from './Checkbox';
import AppText from './AppText';
import { useNavigation } from '@react-navigation/native';

function Product({ product, onCheck, productsActive }) {
    const navigation = useNavigation()
    const [isBought, setIsBought] = useState(!productsActive.some(prod => prod.id === product.id))

    const store_name = product?.store_name ?? null;
    
    return (
        <TouchableOpacity style={styles.rippleContainer} onPress={() => navigation.navigate('ProductDetails', { productId: product.id })}>
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
                {store_name && <AppText
                    style={[styles.subTitle, { color: isBought ? colors.grey : colors.tiffany }]}>
                    {store_name}
                </AppText>}
            </View> 
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: colors.white,
        borderColor: colors.grey,
        borderWidth: 0.4,
        borderRadius: 5,
        elevation: 3,
    },
    rippleContainer: {
        marginVertical: 10
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