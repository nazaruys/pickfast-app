import { StyleSheet, Text, View, ViewBase } from 'react-native';
import Checkbox from './components/Checkbox';
import Product from './components/Product';
import colors from './config/colors';
import ProductsScreen from './screens/ProductsScreen';
import DropDownList from './components/DropDownList';
import { useEffect, useState } from 'react';

export default function App() {
  return (
    <ProductsScreen />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
