import React, {useState} from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons'

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import { fetchPatchUserGroupCode } from '../functions/apiUsers';
import { createLogoutAlert, createOkAlert } from '../functions/alerts';
import { fetchPostGroup } from '../functions/apiGroups';
import AsyncStorage from '@react-native-async-storage/async-storage';

function EnterGroupScreen() {
    const navigation = useNavigation()

    // CodeField variables
    const CELL_COUNT = 6;
    const [code, setCode] = useState('');
    const ref = useBlurOnFulfill({value: code, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

    const handleCodeInput = async (input) => {
      setCode(input.toUpperCase());
      if (input.length === CELL_COUNT) {
        const response = await fetchPatchUserGroupCode(input.toUpperCase())
        if (response) {
			setCode('')
			let message;
			if (response.status === 400) {
				message = 'Group does not exist'
			} else if (response.status === 403) {
				message = 'You are blocked from this group'
			} else {
				message = 'Unknown error'
			}
			createOkAlert(message)
			return
        }
        navigation.navigate('Home')
        setCode('')
      }
    };

    const createGroup = async () => {
        data = await fetchPostGroup()
        console.log('Data: ', data)
        await AsyncStorage.setItem('groupId', data.code)
		    navigation.navigate('Home')
    }
    
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
          <AppButton title="Create a new Group" onPress={createGroup} />
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
});

export default EnterGroupScreen;