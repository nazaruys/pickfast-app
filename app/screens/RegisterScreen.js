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
import { useNavigation } from '@react-navigation/native';

const passwordValidation = Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .test('password-strength', 'Password must contain at least one uppercase letter, one lowercase letter, and one number', value => {
        if (!value) return false;
        return (
            /[A-Z]/.test(value) &&
            /[a-z]/.test(value) &&
            /\d/.test(value)
        );
    });

const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required').min(2, 'Username must be at least 2 characters'),
    email: Yup.string().required('Email is required').email('Email must be valid'),
    name: Yup.string().required('Name is required'),
    password: passwordValidation,
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirming password is required')
});

function RegisterScreen(props) {
    const navigation = useNavigation()
    const usersUrl = "http://10.0.2.2:8000/api/core/users/";

    const fetchPostUser = async (values) => {
        try {
            const response = await fetch(usersUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    name: values.name,
                    password: values.password
                })
            });
            const data = await response.json();
            console.log('New User:', data);
            return data
        } catch (error) {
            console.error('Error posting user:', error);
        }
    };

    const handleSubmit = async (values) => {
        try {
          const data = await fetchPostUser(values);
          await AsyncStorage.setItem('refreshToken', data.token.refresh);
          await AsyncStorage.setItem('accessToken', data.token.access);
          navigation.navigate('Home')
        } catch (error) {
          console.error('Error registering and storing tokens', error);
        }
      };

    return (
        <Screen style={styles.container}>
            <AppHeader title='Register' />
            <View style={styles.form}>
                <Formik
                    initialValues={{ username: '', email: '', name: '', password: '', confirmPassword: '' }}
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
                                placeholder='Email'
                                style={styles.textInput}
                                value={values.email}
                                onChangeText={handleChange('email')}
                                keyboardType='email-address'
                            />
                            {touched.email && errors.email && <AppText style={styles.errorText}>{errors.email}</AppText>}

                            <AppTextInput
                                placeholder='Name'
                                style={styles.textInput}
                                value={values.name}
                                onChangeText={handleChange('name')}
                            />
                            {touched.name && errors.name && <AppText style={styles.errorText}>{errors.name}</AppText>}

                            <AppTextInput
                                placeholder='Password'
                                style={styles.textInput}
                                value={values.password}
                                onChangeText={handleChange('password')}
                                secureTextEntry
                            />
                            {touched.password && errors.password && <AppText style={styles.errorText}>{errors.password}</AppText>}

                            <AppTextInput
                                placeholder='Confirm Password'
                                style={styles.textInput}
                                value={values.confirmPassword}
                                onChangeText={handleChange('confirmPassword')}
                                secureTextEntry
                            />
                            {touched.confirmPassword && errors.confirmPassword && <AppText style={styles.errorText}>{errors.confirmPassword}</AppText>}
                            <AppButton title="Register" style={styles.button} onPress={handleSubmit} />
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

export default RegisterScreen;