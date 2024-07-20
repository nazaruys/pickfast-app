import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import colors from '../config/colors';
import Product from '../components/Product';
import DropDownList from '../components/DropDownList';
import AddButton from '../components/AddButton';
import Container from '../components/Container';
import { fetchProducts, updateProductOnCheck } from '../functions/apiProducts';
import sortProductsByPriority from '../functions/sortProductsByPriority';

function ProductsScreen() {
  const navigation = useNavigation();

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [productsActive, setProductsActive] = useState();
  const [productsBought, setProductsBought] = useState();
  const [refreshing, setRefreshing] = useState(false); 

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

  const onRefresh = async () => {
	const data = await fetchProducts()
	setProductsActive(sortProductsByPriority(data.filter(product => !product.date_buyed)));
	setProductsBought(data.filter(product => product.date_buyed));
  }

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const data = await fetchProducts();
		setProductsActive(sortProductsByPriority(data.filter(product => !product.date_buyed)));
		setProductsBought(data.filter(product => product.date_buyed));
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
        <DropDownList style={styles.dropDown} title={'BOUGHT'} isOpen={dropDownOpen} setIsOpen={setDropDownOpen} /> 
        {dropDownOpen && productsBought && (
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
