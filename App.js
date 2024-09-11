import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {jwtDecode} from 'jwt-decode';
import { StatusBar } from 'react-native';

import ProductsScreen from './app/screens/ProductsScreen';
import StoresScreen from './app/screens/StoresScreen';
import ProfileScreen from './app/screens/ProfileScreen';
import colors from './app/config/colors';
import ScreenHeader from './app/components/ScreenHeader';
import CreateProductScreen from './app/screens/CreateProductScreen';
import CreateStoreScreen from './app/screens/CreateStoreScreen';
import GroupScreen from './app/screens/GroupScreen';
import EditProfileScreen from './app/screens/EditProfileScreen';
import WelcomeScreen from './app/screens/WelcomeScreen';
import RegisterScreen from './app/screens/RegisterScreen';
import LoginScreen from './app/screens/LoginScreen';
import EnterGroupScreen from './app/screens/EnterGroupScreen';
import { navigationRef } from './app/navigationService';
import { getGroupId, getRefreshToken } from './app/functions/getAsyncStorage';
import ProductDetailsScreen from './app/screens/ProductDetailsScreen';
import StoreDetailsScreen from './app/screens/StoreDetailsScreen';
import Screen from './app/components/Screen';
import VerifyEmailScreen from './app/screens/VerifyEmailScreen';
import EmailVerifiedScreen from './app/screens/EmailVerifiedScreen';
import FeedbackScreen from './app/screens/FeedbackScreen';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function BottomTabs() {
return (
  <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color }) => {
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
          height: '10%',
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
      	const refreshToken = await getRefreshToken()
      	if (refreshToken) {
          const decodedToken = jwtDecode(refreshToken);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            const groupId = await getGroupId()
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
        console.error('Error checking the token: ', error)
        setInitialRoute('Welcome');
      }
};

useEffect(() => {
  checkToken()
}, [])

if (initialRoute === null) {
  return <Screen style={{backgroundColor: colors.background}}></Screen>;
}
return (
  <>
    <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
    <NavigationContainer ref={navigationRef}>
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
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateStore"
          component={CreateStoreScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="StoreDetails"
          component={StoreDetailsScreen}
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
        <Stack.Screen
          name="VerifyEmail"
          component={VerifyEmailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EmailVerified"
          component={EmailVerifiedScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  </>
);
}

export default App;
