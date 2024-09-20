import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import colors from '../config/colors';
import AppText from './AppText';
import { useNavigation } from '@react-navigation/native';

const getMarkColor = (priority) => {
    if (priority === 'M') {
        return colors.lightBlue
    } else if (priority === 'L') {
        return colors.grey
    } else if (priority === 'H') {
        return colors.primary
    }
}

function Product({ product, onCheck, productsActive }) {
    const navigation = useNavigation()
    const [isBought, setIsBought] = useState(!productsActive.some(prod => prod.id === product.id))

    const store_name = product?.store_name ?? null;

    const markColor = getMarkColor(product.priority)
    
    return (
        <TouchableOpacity 
            style={styles.rippleContainer} 
            onPress={onCheck}
            onLongPress={() => navigation.navigate('ProductDetails', { productId: product.id })}
        >
            <View style={[
                styles.container,
                { opacity: isBought ? 0.5 : 1, borderWidth: 0.4, }
            ]}>
                <MaterialCommunityIcons 
                    name={isBought ? "exclamation" : "exclamation"} 
                    size={26} 
                    color={markColor}
                    style={[styles.checkcircle]} 
                />
                <AppText
                    style={styles.title}
                    numberOfLines={2}>
                    {product.title}
                </AppText>
                {store_name && <AppText
                                    numberOfLines={1}
                                    style={[styles.subTitle, { color: isBought ? colors.grey : colors.tiffany }]}
                                >
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
        paddingHorizontal: 15,
        paddingVertical: 14,
        backgroundColor: colors.white,
        borderColor: colors.grey,
        borderWidth: 0.4,
        borderRadius: 5,
    },
    rippleContainer: {
        marginVertical: 10
    },
    checkcircle: {
        marginRight: 3
    },
    title: {
        flex: 1
    },
    subTitle: {
        color: colors.tiffany,
        fontSize: 16,
        marginLeft: 25,
    }
})

export default Product;