import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, Image, Text, BackHandler, StatusBar, AppState } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import colors from '../config/colors';
import Product from '../components/Product';
import DropDownList from '../components/DropDownList';
import AddButton from '../components/AddButton';
import Container from '../components/Container';
import sortProductsByPriority from '../functions/sortProductsByPriority';
import AppText from '../components/AppText';
import baseFetch from '../functions/baseFetch';

function ProductsScreen() {
  const navigation = useNavigation();

  const [dropDownOpen, setDropDownOpen] = useState(true);
  const [productsActive, setProductsActive] = useState([]);
  const [productsBought, setProductsBought] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    const data = await baseFetch(`group/groups/groupId/products/`, 'GET');
    if (data) {
      setProducts(data);
    }
  };

  const productBought = async (product) => {
    const currentTime = new Date().toISOString();
    const data = await baseFetch(`group/groups/groupId/products/${product.id}/`, 'PATCH', { date_buyed: currentTime });
    if (data) {
      setProductsActive(productsActive.filter(item => item.id !== product.id));
      setProductsBought([...productsBought, product]);
    }
  };

  const productUnBought = async (product) => {
    const data = await baseFetch(`group/groups/groupId/products/${product.id}/`, 'PATCH', { date_buyed: null });
    if (data) {
      setProductsBought(productsBought.filter(item => item.id !== product.id));
      setProductsActive(sortProductsByPriority([...productsActive, product]));
    }
  };

  const setProducts = (data) => {
    const newProductsActive = data.filter(product => !product.date_buyed);
    const newProductsBought = data.filter(product => product.date_buyed);

    setProductsActive(sortProductsByPriority(newProductsActive));
    setProductsBought(newProductsBought);
  };

  const onRefresh = async () => {
    const data = await baseFetch(`group/groups/groupId/products/`, 'GET');
    if (data) {
      setProducts(data);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);

      return () => backHandler.remove();
    }, [])
  );

  useEffect(() => {
    const appStateListener = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        fetchData();
      }
    });

    return () => appStateListener.remove();
  }, []);

  const renderActiveProducts = () => (
    <View>
      {productsActive.map((item) => (
        <Product
          key={item.id.toString()}
          product={item}
          onCheck={() => productBought(item)}
          productsActive={productsActive}
        />
      ))}
    </View>
  );

  const renderBoughtProducts = () => (
    dropDownOpen && (
      <View>
        {productsBought.map((item) => (
          <Product
            key={item.id.toString()}
            product={item}
            onCheck={() => productUnBought(item)}
            productsActive={productsActive}
          />
        ))}
      </View>
    )
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Image 
        source={require('../assets/shopping-bag.png')}
        style={styles.noProductsImage}
      />
      <AppText style={styles.title}>No products</AppText>
      <AppText style={styles.subtitle}>Tap the + button to add</AppText>
    </View>
  );

  return (
    <Container>
      <FlatList
        data={[]}
        ListHeaderComponent={renderActiveProducts}
        ListFooterComponent={() => (
          <>
            {productsActive.length > 0 || productsBought.length > 0 ? (
              <DropDownList
                style={styles.dropDown}
                title={'BOUGHT'}
                isOpen={dropDownOpen}
                setIsOpen={setDropDownOpen}
              />
            ) : (
              renderEmptyState()
            )}
            {renderBoughtProducts()}
          </>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      />
      <AddButton style={styles.addButton} onPress={() => navigation.navigate('CreateProduct')} />
    </Container>
  );
}

const styles = StyleSheet.create({
  dropDown: {
    marginVertical: 10,
  },
  addButton: {
    position: 'absolute',
    right: 25,
    bottom: 25,
  },
  noProductsImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: '30%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: colors.darkGrey
  },
});

export default ProductsScreen;
