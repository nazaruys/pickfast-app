import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import Screen from '../components/Screen';
import colors from '../config/colors';
import AppHeader from '../components/AppHeader';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import baseFetch from '../functions/baseFetch';
import AppProgress from '../components/AppProgress';

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
});

function CreateProductScreen() {
    const navigation = useNavigation();

    const [stores, setStores] = useState([]);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getStores = async () => {
            try {
                const data = await baseFetch(`group/groups/groupId/stores/`, 'GET')
                data && setStores(data);
            } catch (error) {
                console.log('Error fetching stores: ', error)
            }
        };
        getStores();
    }, []);

    return (
        <Screen style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundSecondary} />
            <AppHeader title='Add a Product' />
            <View style={styles.content}>
                <Formik
                    initialValues={{ title: '', priority: 'M', store_id: null }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm }) => {
                        setLoading(true)
                        const data = await baseFetch('group/groups/groupId/products/', 'POST', {
                            title: values.title,
                            priority: values.priority,
                            store_id: values.store_id
                        })
                        if (data) {
                            navigation.goBack();
                            resetForm();
                        }
                        setLoading(false)
                    }}
                >
                    {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <>
                            <AppTextInput
                                placeholder='Title'
                                style={styles.textInput}
                                maxLength={40}
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
            {loading && (
                <AppProgress loading={loading} />
            )}
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
