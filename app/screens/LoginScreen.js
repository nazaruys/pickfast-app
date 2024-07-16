import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';
import AppText from '../components/AppText';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

function LoginScreen(props) {
    const navigation = useNavigation()
    const loginUrl = "http://10.0.2.2:8000/api/core/login/";

    const fetchLoginUser = async (values) => {
        try {
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password
                })
            });
            const data = await response.json();
            console.log('Tokens:', data);
            return data
        } catch (error) {
            console.error('Error login user:', error);
        }
    };

    const handleSubmit = async (values) => {
        try {
          const tokens = await fetchLoginUser(values);
          console.log('Access: ', tokens.access, 'Refresh: ', tokens.refresh)
          await AsyncStorage.setItem('refreshToken', tokens.refresh);
          await AsyncStorage.setItem('accessToken', tokens.access);
          console.log('Async access: ', await AsyncStorage.getItem('accessToken'))
          navigation.navigate('Home')
        } catch (error) {
          console.error('Error logging in and storing tokens', error);
        }
      };

    return (
        <Screen style={styles.container}>
            <AppHeader title='Login' />
            <View style={styles.form}>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(values) => handleSubmit(values)}
                >
                    {({ handleChange, handleSubmit, values, errors, touched }) => (
                        <>
                            <AppTextInput
                                placeholder='Username'
                                style={styles.textInput}
                                value={values.username}
                                onChangeText={handleChange('username')}
                            />
                            {touched.username && errors.username && <AppText style={styles.errorText}>{errors.username}</AppText>}

                            <AppTextInput
                                placeholder='Password'
                                style={styles.textInput}
                                value={values.password}
                                onChangeText={handleChange('password')}
                                secureTextEntry
                            />
                            {touched.password && errors.password && <AppText style={styles.errorText}>{errors.password}</AppText>}
                            <AppButton title="Login" style={styles.button} onPress={handleSubmit} />
                        </>
                    )}
                </Formik>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background
    },
    form: {
        padding: 20,
    },
    textInput: {
        marginVertical: 15
    },
    errorText: {
        color: 'red',
        marginBottom: 10
    },
    button: {
        marginVertical: 15
    }

})

export default LoginScreen;