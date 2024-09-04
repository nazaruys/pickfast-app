import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';
import AppText from '../components/AppText';
import { fetchPostUser } from '../functions/apiUsers';
import { createOkAlert } from '../functions/alerts';
import AppProgress from '../components/AppProgress';

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

function RegisterScreen() {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const data = await fetchPostUser(values);
            if (data.token) {
                await AsyncStorage.setItem('refreshToken', data.token.refresh);
                await AsyncStorage.setItem('accessToken', data.token.access);
                setLoading(false);
                navigation.navigate('EnterGroup');
            } else {
                setLoading(false);
                if (data.username) {
                    createOkAlert(data.username[0]);
                } else if (data.email) {
                    createOkAlert(data.email[0]);
                } else if (data.password) {
                    createOkAlert(data.password[0]);
                } else {
                    createOkAlert('Something went wrong');
                }
            }
        } catch (error) {
            setLoading(false);
            console.error(error);
            createOkAlert('Something went wrong');
        }
    };

    return (
        <Screen style={styles.container}>
            <AppHeader title="Register" />
            <ScrollView style={styles.form}>
                <Formik
                    initialValues={{ username: '', email: '', name: '', password: '', confirmPassword: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ handleChange, handleSubmit, values, errors, touched }) => (
                        <>
                            <AppTextInput
                                placeholder="Username"
                                style={styles.textInput}
                                value={values.username}
                                onChangeText={handleChange('username')}
                            />
                            {touched.username && errors.username && <AppText style={styles.errorText}>{errors.username}</AppText>}

                            <AppTextInput
                                placeholder="Email"
                                style={styles.textInput}
                                value={values.email}
                                onChangeText={handleChange('email')}
                                keyboardType="email-address"
                            />
                            {touched.email && errors.email && <AppText style={styles.errorText}>{errors.email}</AppText>}

                            <AppTextInput
                                placeholder="Name"
                                style={styles.textInput}
                                value={values.name}
                                onChangeText={handleChange('name')}
                            />
                            {touched.name && errors.name && <AppText style={styles.errorText}>{errors.name}</AppText>}

                            <AppTextInput
                                placeholder="Password"
                                style={styles.textInput}
                                value={values.password}
                                onChangeText={handleChange('password')}
                                secureTextEntry
                            />
                            {touched.password && errors.password && <AppText style={styles.errorText}>{errors.password}</AppText>}

                            <AppTextInput
                                placeholder="Confirm Password"
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
            </ScrollView>
            {loading && (
                <AppProgress loading={loading} />
            )}
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
    },
    form: {
        padding: 20,
    },
    textInput: {
        marginVertical: 15,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    button: {
        marginVertical: 15,
    },
    emailInfo: {
        fontSize: 16,
        color: colors.darkGrey,
    },
});

export default RegisterScreen;
