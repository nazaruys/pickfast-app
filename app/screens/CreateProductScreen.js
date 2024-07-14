import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppHeader from '../components/AppHeader';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import token from '../config/token';

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
});

function CreateProductScreen() {
    const navigation = useNavigation();
    const [stores, setStores] = useState([]);
    const storesUrl = 'http://10.0.2.2:8000/api/group/groups/WLMYBR/stores/';
    const productsUrl = 'http://10.0.2.2:8000/api/group/groups/WLMYBR/products/';

    const fetchStores = async () => {
        try {
            const response = await fetch(storesUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setStores(data);
            console.log('Stores:', data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    const fetchPostProduct = async (values) => {
        try {
            const response = await fetch(productsUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: values.title,
                    priority: values.priority,
                    store_id: values.store_id
                })
            });
            const data = await response.json();
            console.log('New Product:', data);
        } catch (error) {
            console.error('Error posting product:', error);
        }
    };

    useEffect(() => {
        fetchStores();
    }, []);

    return (
        <Screen style={styles.container}>
            <AppHeader title={'Add a Product'} />
            <View style={styles.content}>
                <Formik
                    initialValues={{ title: '', priority: 'M', store_id: null }}
                    validationSchema={validationSchema}
                    onSubmit={(values, { resetForm }) => {
                        fetchPostProduct(values);
                        resetForm();
                        navigation.goBack();
                    }}
                >
                    {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <>
                            <AppTextInput
                                placeholder='Title'
                                style={styles.textInput}
                                maxLength={50}
                                value={values.title}
                                onChangeText={handleChange('title')}
                            />
                            {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                            <View style={styles.picker}>
                                <Picker
                                    selectedValue={values.priority}
                                    onValueChange={(value) => setFieldValue('priority', value)}
                                >
                                    <Picker.Item label="Medium priority" value='M' />
                                    <Picker.Item label="Low priority" value='L' />
                                    <Picker.Item label="High priority" value='H' />
                                </Picker>
                            </View>
                            <View style={styles.picker}>
                                <Picker
                                    selectedValue={values.store_id}
                                    onValueChange={(value) => setFieldValue('store_id', value)}
                                >
                                    <Picker.Item label="Any Store" value={null} />
                                    {Array.isArray(stores) && stores.map(store => (
                                        <Picker.Item key={store.id} label={store.name} value={store.id} />
                                    ))}
                                </Picker>
                            </View>
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
    picker: {
        backgroundColor: colors.white,
        height: 60,
        borderRadius: 12,
        marginVertical: 12,
        justifyContent: 'center'
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
