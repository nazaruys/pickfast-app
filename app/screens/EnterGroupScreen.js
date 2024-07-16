import React, {useState} from 'react';
import { Image, StyleSheet, View } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {jwtDecode} from 'jwt-decode';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppText from '../components/AppText';
import AppButton from '../components/AppButton';
import token from '../config/token';


const CELL_COUNT = 6;

const App = () => {
    const [code, setCode] = useState('');
    const ref = useBlurOnFulfill({value: code, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value: code,
        setValue: setCode,
    });

    const fetchPatchUser = async (group_code) => {
      try {
          const response = await fetch(`http://10.0.2.2:8000/api/core/users/${jwtDecode(token).user_id}}/`, {
              method: 'PATCH',
              headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  group_id: group_code
              })
          });
          const data = await response.json();
          console.log('Updated user:', data);
      } catch (error) {
          console.error('Error posting user:', error);
      }
  };

    const handleCodeInput = (input) => {
      setCode(input);
      if (input.length === CELL_COUNT) {
        const decoded = jwtDecode(token)
        console.log(decoded.user_id)
        setCode('')
      }
    };
    
    return (
      <Screen style={styles.container}>
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
  }
});

export default App;