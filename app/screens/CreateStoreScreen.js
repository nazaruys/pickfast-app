import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppHeader from '../components/AppHeader';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
});

function CreateProductScreen() {
    const navigation = useNavigation();

    const fetchPostStore = async (values) => {
        try {
            const access_token = await AsyncStorage.getItem('accessToken');
            const groupId = await AsyncStorage.getItem('groupId')
            const response = await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/stores/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name
                })
            });
            const data = await response.json();
            console.log('New Store:', data);
        } catch (error) {
            console.error('Error posting store:', error);
        }
    };


    return (
        <Screen style={styles.container}>
            <AppHeader title={'Add a Store'} />
            <View style={styles.content}>
                <Formik
                    initialValues={{ name: ''}}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm }) => {
                        await fetchPostStore(values);
                        navigation.goBack();
                        resetForm();
                    }}
                >
                    {({ handleChange, handleSubmit, values, errors, touched }) => (
                        <>
                            <AppTextInput
                                placeholder='Name'
                                style={styles.textInput}
                                maxLength={50}
                                value={values.name}
                                onChangeText={handleChange('name')}
                            />
                            {touched.name && errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                            <AppButton title='Add' onPress={handleSubmit} style={styles.submitButton} />
                        </>
                    )}
                </Formik>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundSecondary,
    },
    content: {
        paddingHorizontal: '5%',
        paddingTop: 25
    },
    textInput: {
        marginVertical: 12
    },
    submitButton: {
        marginVertical: 12
    },
    errorText: {
        color: 'red',
        marginBottom: 10
    }
});

export default CreateProductScreen;
