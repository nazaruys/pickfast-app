import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import ProductsScreen from './screens/ProductsScreen';
import StoresScreen from './screens/StoresScreen';
import ProfileScreen from './screens/ProfileScreen';
import colors from './config/colors';
import ScreenHeader from './components/ScreenHeader';
import CreateProductScreen from './screens/CreateProductScreen';
import CreateStoreScreen from './screens/CreateStoreScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            let iconSize = 35

            if (route.name === 'Products') {
              iconName = 'cart';
            } else if (route.name === 'Stores') {
              iconName = 'store';
            } else if (route.name === 'Profile') {
              iconName = 'account';
            }

            return <MaterialCommunityIcons name={iconName} size={iconSize} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.grey,
          tabBarShowLabel: false,
          tabBarStyle: {
            height: '13%',
            backgroundColor: colors.background,
            borderTopWidth: 0,
            elevation: 0,
          },
          header: ({ route }) => <ScreenHeader title={route.name} />,
        })}
      >
        <Tab.Screen name="Products" component={ProductsScreen} />
        <Tab.Screen name="Stores" component={StoresScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
  )
}


function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateProduct"
          component={CreateProductScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateStore"
          component={CreateStoreScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
