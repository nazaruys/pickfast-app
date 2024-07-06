import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import colors from '../config/colors';
import AppText from '../components/AppText';
import Screen from '../components/Screen';
import Product from '../components/Product';
import DropDownList from '../components/DropDownList';
import token from '../config/token'

function ProductsScreen() {
    const [isOpen, setIsOpen] = useState(false)

    const productsUrl = 'http://10.0.2.2:8000/api/group/groups/NSL7ZW/products/'

    const [stores, setStores] = useState()
    const storesUrl = 'http://10.0.2.2:8000/api/group/groups/NSL7ZW/stores/'

    const [productsActive, setProductsActive] = useState()

    const [productsBought, setProductsBought] = useState()


    useEffect(() => {
        fetchProducts()
        fetchStores()
    }, [])
  
    const fetchStores = async () => {
        try {
            const response = await fetch(storesUrl, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`
            }});
            const data = await response.json();
            setStores(data);
            console.log('Stores:', data)
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    } 
  
    const fetchProducts = async () => {
        try {
            const response = await fetch(productsUrl, {
              method: 'GET',
              headers: {
                  'Authorization': `Bearer ${token}`
            }});
            const data = await response.json();
            setProductsActive(data.filter(product => product.date_buyed === null));
            setProductsBought(data.filter(product => product.date_buyed !== null));
            console.log('Products:', data)
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    } 

    const productBought = (product) => {
        console.log('Adding product to the Bought list.')
        setProductsActive(productsActive.filter(item => item.id !== product.id))
        setProductsBought([...productsBought, product])
        console.log('Sending a request to the API!')
    }

    const productUnBought = (product) => {
        console.log('Adding product to the Active list.')
        setProductsBought(productsBought.filter(item => item.id !== product.id))
        setProductsActive([...productsActive, product])
        console.log('Sending a request to the API!')
    }

    return (
        <Screen style={styles.container}>
            <AppText style={styles.text}>Products</AppText>
            <View style={styles.content}>
                {productsActive &&
                <FlatList 
                    style={styles.products}
                    data={productsActive}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => 
                        <Product 
                            product={item} 
                            handlePress={() => console.log('Navigating to the details screen.')} 
                            onCheck={() => productBought(item)} 
                            stores={stores}
                            productsActive={productsActive}
                        />
                    }
                />}
                <DropDownList style={styles.dropDown} title={'BOUGHT'} isOpen={isOpen} setIsOpen={setIsOpen} /> 
                {isOpen && productsBought && <FlatList
                    style={styles.products}
                    data={productsBought}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item}) => 
                        <Product 
                            product={item} 
                            handlePress={() => console.log('Navigating to the details screen.')} 
                            onCheck={() => productUnBought(item)} 
                            stores={stores}
                            productsActive={productsActive} 
                        />
                    }
                />}
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: '5%'
    },
    content: {
        marginTop: 30
    },
    text: {
        fontSize: 40,
        fontWeight: '700',
    },
    products: {
        flex: 0,
    },
    dropDown: {
        marginVertical: 10
    }
})

export default ProductsScreen;