import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

import ProductsScreen from './screens/ProductsScreen';
import StoresScreen from './screens/StoresScreen';
import ProfileScreen from './screens/ProfileScreen';
import colors from './config/colors';
import ScreenHeader from './components/ScreenHeader';
import CreateProductScreen from './screens/CreateProductScreen';
import CreateStoreScreen from './screens/CreateStoreScreen';
import GroupScreen from './screens/GroupScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import RegisterScreen from './screens/RegisterScreen';
import LoginScreen from './screens/LoginScreen';
import EnterGroupScreen from './screens/EnterGroupScreen'

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
  const [initialRoute, setInitialRoute] = useState(null);
  const checkToken = async () => {
    try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        console.log(refreshToken)
        if (refreshToken) {
            const decodedToken = jwtDecode(refreshToken);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp > currentTime) {
				const groupId = await AsyncStorage.getItem('groupId')
				if (groupId && groupId.length === 6) {
              		setInitialRoute('Home');
				} else {
					setInitialRoute('EnterGroup');
				}
            } else {
              	setInitialRoute('Welcome');
            }
        } else {
            setInitialRoute('Welcome');
        }
        } catch (error) {
        console.error('Error checking token', error);
        setInitialRoute('Welcome');
        }
  };

  useEffect(() => {
    checkToken()
  }, [])

  if (initialRoute === null) {
    console.log('Returning null...')
    return null;
  }
  console.log(initialRoute)
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Home"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
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
        <Stack.Screen
          name="Group"
          component={GroupScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EnterGroup"
          component={EnterGroupScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
