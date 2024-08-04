import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, Image, Text } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import colors from '../config/colors';
import Product from '../components/Product';
import DropDownList from '../components/DropDownList';
import AddButton from '../components/AddButton';
import Container from '../components/Container';
import { fetchProducts, updateProductOnCheck } from '../functions/apiProducts';
import sortProductsByPriority from '../functions/sortProductsByPriority';
import AppText from '../components/AppText';

function ProductsScreen() {
  const navigation = useNavigation();

  const [dropDownOpen, setDropDownOpen] = useState(false);
  const [productsActive, setProductsActive] = useState([]);
  const [productsBought, setProductsBought] = useState([]);
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
    const data = await fetchProducts();
    setProductsActive(sortProductsByPriority(data.filter(product => !product.date_buyed)));
    setProductsBought(data.filter(product => product.date_buyed));
  };

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

  const renderActiveProducts = () => (
    <View>
      {productsActive.map((item) => (
        <Product
          key={item.id.toString()}
          product={item}
          handlePress={() => console.log('Navigating to the details screen.')}
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
            handlePress={() => console.log('Navigating to the details screen.')}
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
