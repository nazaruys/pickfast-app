import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import colors from '../config/colors';
import Product from '../components/Product';
import DropDownList from '../components/DropDownList';
import token from '../config/token'
import AddButton from '../components/AddButton';
import Container from '../components/Container';

function ProductsScreen() {
    const navigation = useNavigation();

    const [isOpen, setIsOpen] = useState(false)

    const productsUrl = 'http://10.0.2.2:8000/api/group/groups/WLMYBR/products/'

    const [stores, setStores] = useState()
    const storesUrl = 'http://10.0.2.2:8000/api/group/groups/WLMYBR/stores/'

    const [productsActive, setProductsActive] = useState()

    const [productsBought, setProductsBought] = useState()

    const [refreshing, setRefreshing] = useState(false);
  
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
            setProductsActive(sortProductsByPriority(data.filter(product => product.date_buyed === null)));
            setProductsBought(data.filter(product => product.date_buyed !== null));
            console.log('Products:', data)
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    } 

    const updateProductOnCheck = async (product, bought) => {
        const url = `http://10.0.2.2:8000/api/group/groups/WLMYBR/products/${product.id}/`;
        const currentTime = new Date().toISOString();

        try {
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date_buyed: bought ? currentTime : null })
            });
            const data = await response.json();
            console.log('Updated Product:', data);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const sortProductsByPriority = (products) => {
        const priorityOrder = { 'H': 1, 'M': 2, 'L': 3 };
        return products.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      };

    const productBought = (product) => {
        setProductsActive(productsActive.filter(item => item.id !== product.id))
        setProductsBought([...productsBought, product])
        console.log('Sending a request to the API!')
        updateProductOnCheck(product, true)
    }

    const productUnBought = (product) => {
        setProductsBought(productsBought.filter(item => item.id !== product.id))
        setProductsActive(sortProductsByPriority([...productsActive, product]))
        console.log('Sending a request to the API!')
        updateProductOnCheck(product, false)
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProducts();
        fetchStores().then(() => setRefreshing(false));
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchProducts();
            fetchStores();
        }, [])
    );

    return (
        <Container>
            <ScrollView 
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
                >
                {productsActive &&
                <FlatList 
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
            </ScrollView>
            <AddButton style={styles.addButton} onPress={() => navigation.navigate('CreateProduct')} />
        </Container>
    );
}

const styles = StyleSheet.create({
    dropDown: {
        marginVertical: 10
    },
    addButton: {
        position: 'absolute',
        right: 25,
        bottom: 25,
    }
})

export default ProductsScreen;