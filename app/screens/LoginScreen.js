import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppHeader from '../components/AppHeader';
import AppButton from '../components/AppButton';
import AppTextInput from '../components/AppTextInput';
import AppText from '../components/AppText';
import { fetchLoginUser } from '../functions/apiUsers';
import { fetchGroupId } from '../functions/apiGroups';
import { createOkAlert } from '../functions/alerts';


const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
});

function LoginScreen() {
    const navigation = useNavigation()

    let previousValues = null;

    const handleSubmit = async (values) => {
        if (previousValues && JSON.stringify(values) === JSON.stringify(previousValues)) {
            return;
        }
        previousValues = values;
        try {
            const tokens = await fetchLoginUser(values);
            if (tokens) {
                await AsyncStorage.setItem('refreshToken', tokens.refresh);
                await AsyncStorage.setItem('accessToken', tokens.access);

                groupId = await fetchGroupId()
                if (groupId) {
                    await AsyncStorage.setItem('groupId', groupId);
                    navigation.navigate('Home')
                } else {
                    navigation.navigate('EnterGroup')
                }
            } else {
                createOkAlert('Invalid credentials')
            }
        } catch (error) {
            throw(error)
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