import React, {useState} from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useNavigation } from '@react-navigation/native';
import {MaterialIcons} from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';


const CELL_COUNT = 6;

const App = () => {
    const navigation = useNavigation()

    const [code, setCode] = useState('');
    const ref = useBlurOnFulfill({value: code, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

    const fetchPatchUser = async (group_code) => {
      try {
          const access_token = await AsyncStorage.getItem('accessToken')
          console.log("Fetching: ", `http://10.0.2.2:8000/api/core/users/${jwtDecode(access_token).user_id}/`)
          const response = await fetch(`http://10.0.2.2:8000/api/core/users/${jwtDecode(access_token).user_id}/`, {
              method: 'PATCH',
              headers: {
                  'Authorization': `Bearer ${access_token}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  group_id: group_code
              })
          });
          const data = await response.json();
          if (response.ok) {
            console.log('Setting async group to: ', group_code)
            AsyncStorage.setItem('groupId', group_code)
            navigation.navigate('Home')
          } else {
            console.log('Displaying an error')
          }
          console.log('Updated user:', data);
      } catch (error) {
          console.error('Error posting user:', error);
      }
  };

    const handleCodeInput = (input) => {
      setCode(input.toUpperCase());
      if (input.length === CELL_COUNT) {
        fetchPatchUser(input.toUpperCase())
        setCode('')
      }
    };

    const logOut = async () => {
        navigation.navigate('Welcome')

        await AsyncStorage.removeItem('accessToken')
        await AsyncStorage.removeItem('refreshToken')
        await AsyncStorage.removeItem('groupId')
    }

    const createLogoutAlert = () =>
      Alert.alert('Are you sure you want to logout?', 'You will need to login or create a new account', [
          {
          text: 'Cancel',
          style: 'cancel',
          },
          {text: 'Log out', onPress: logOut},
    ]);
  
    
    return (
      <Screen style={styles.container}>
        <TouchableOpacity style={styles.logoutContainer} onPress={createLogoutAlert}>
            <MaterialIcons color={colors.dark} name='logout' size={35} style={styles.icon} />
        </TouchableOpacity>
        <View style={styles.codeContainer}>
          <Image style={styles.logoImage} source={require('../assets/Groceries-Cart.png')}/>
          <AppText style={styles.title}>Enter the code of your group</AppText>
          <CodeField
            ref={ref}
            {...props}
            value={code}
            onChangeText={handleCodeInput}
            keyboardType='ascii-capable'
            cellCount={CELL_COUNT}
            renderCell={({index, symbol, isFocused}) => (
                <AppText
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor/> : null)}
              </AppText>
            )}
          />
        </View>
        <View style={styles.buttonContainer}>
          <AppText style={styles.buttonText}>Don't have a group?</AppText>
          <AppButton title="Create a new Group" onPress={() => console.log('Creating a group.')} />
        </View>
      </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '5%',
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoImage: {
    width: 275,
    height: 275,
    marginBottom: 25
  },
  codeContainer: {
    bottom: 225,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 30
  },
  cell: {
    width: 50,
    height: 70,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 5,
    borderColor: colors.tiffany,
    borderRadius: 10,
    textAlign: 'center',
    padding: 15,
    marginHorizontal: 7
  },
  focusCell: {
    borderColor: colors.primary,
  },
  buttonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 100,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 20,
    marginBottom: 20,
    color: colors.darkGrey
  },
  logoutContainer: {
    position: 'absolute',
    top: 70,
    left: '5%'
  },
  icon: {

  }
});

export default App;