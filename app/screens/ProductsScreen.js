import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import colors from '../config/colors';
import Product from '../components/Product';
import DropDownList from '../components/DropDownList';
import AddButton from '../components/AddButton';
import Container from '../components/Container';

function ProductsScreen() {
  const navigation = useNavigation();

  const [isOpen, setIsOpen] = useState(false);
  const [productsActive, setProductsActive] = useState();
  const [productsBought, setProductsBought] = useState();
  const [refreshing, setRefreshing] = useState(false); 

  const fetchProducts = async () => {
    try {
        const groupId = await AsyncStorage.getItem('groupId');
        const access_token = await AsyncStorage.getItem('accessToken');
		console.log(groupId, access_token)
        const response = await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/products/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setProductsActive(sortProductsByPriority(data.filter(product => !product.date_buyed)));
          setProductsBought(data.filter(product => product.date_buyed));
        } else {
          console.error('Error fetching products:', response.status);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
  };

  const updateProductOnCheck = async (product, bought) => {
    const currentTime = new Date().toISOString();
    try {
		const groupId = await AsyncStorage.getItem('groupId');
		const access_token = await AsyncStorage.getItem('accessToken');
		const response = await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/products/${product.id}/`, {
			method: 'PATCH',
			headers: {
			'Authorization': `Bearer ${access_token}`,
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
    setProductsActive(productsActive.filter(item => item.id !== product.id));
    setProductsBought([...productsBought, product]);
    updateProductOnCheck(product, true);
  };

  const productUnBought = (product) => {
    setProductsBought(productsBought.filter(item => item.id !== product.id));
    setProductsActive(sortProductsByPriority([...productsActive, product]));
    updateProductOnCheck(product, false);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProducts().then(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchProducts();
      };
      fetchData();
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
        {productsActive && (
          <FlatList 
            data={productsActive}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Product 
                product={item} 
                handlePress={() => console.log('Navigating to the details screen.')} 
                onCheck={() => productBought(item)} 
                productsActive={productsActive}
              />
            )}
          />
        )}
        <DropDownList style={styles.dropDown} title={'BOUGHT'} isOpen={isOpen} setIsOpen={setIsOpen} /> 
        {isOpen && productsBought && (
          <FlatList
            data={productsBought}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <Product 
                product={item} 
                handlePress={() => console.log('Navigating to the details screen.')} 
                onCheck={() => productUnBought(item)} 
                productsActive={productsActive}
              />
            )}
          />
        )}
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
});

export default ProductsScreen;
