import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, StatusBar, BackHandler, Platform } from 'react-native';
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
    const inputRef = useRef(null);

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch stores when the component mounts
        const getStores = async () => {
            try {
                const data = await baseFetch(`group/groups/groupId/stores/`, 'GET');
                data && setStores(data);
            } catch (error) {
                console.error('Error fetching stores: ', error);
            }
        };
        getStores();

        // Handle hardware back button press
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
        });

        // Focus the TextInput after the component mounts
        const focusTimeout = setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus(); // Focus on the TextInput
            }
        }, 100); // Delay to ensure component is rendered before focusing

        return () => {
            backHandler.remove(); // Clean up back handler
            clearTimeout(focusTimeout); // Clear timeout
        };
    }, [navigation]);

    return (
        <Screen style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.backgroundSecondary} />
            <AppHeader title="Add a Product" />
            <View style={styles.content}>
                <Formik
                    initialValues={{ title: '', priority: 'M', store_id: null }}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm }) => {
                        setLoading(true);
                        const data = await baseFetch('group/groups/groupId/products/', 'POST', {
                            title: values.title,
                            priority: values.priority,
                            store_id: values.store_id,
                        });
                        if (data) {
                            navigation.goBack();
                            resetForm();
                        }
                        setLoading(false);
                    }}
                >
                    {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                        <>
                            <AppTextInput
                                placeholder="Title"
                                ref={inputRef} // Reference to the input field
                                style={styles.textInput}
                                maxLength={40}
                                value={values.title}
                                onChangeText={handleChange('title')}
                            />
                            {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={values.priority || "M"}
                                    onValueChange={(value) => setFieldValue('priority', value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Low priority" value="L" />
                                    <Picker.Item label="Medium priority" value="M" />
                                    <Picker.Item label="High priority" value="H" />
                                </Picker>
                            </View>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={values.store_id}
                                    onValueChange={(value) => setFieldValue('store_id', value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Any Store" value={null} />
                                    {Array.isArray(stores) &&
                                        stores.map((store) => (
                                            <Picker.Item key={store.id} label={store.name} value={store.id} />
                                        ))}
                                </Picker>
                            </View>
                            <AppButton title="Add" onPress={handleSubmit} style={styles.submitButton} />
                        </>
                    )}
                </Formik>
            </View>
            {loading && <AppProgress loading={loading} />}
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundSecondary,
    },
    content: {
        paddingHorizontal: '5%',
        paddingTop: 25,
    },
    textInput: {
        marginVertical: 12,
    },
    pickerContainer: {
        backgroundColor: Platform.OS === 'ios' ? 'rgba(0, 0, 0, 0)' : colors.white,
        height: Platform.OS === 'ios' ? 200 : 60,
        borderRadius: 12,
        marginVertical: Platform.OS === 'ios' ? 0 : 12,
        justifyContent: 'center',
    },
    picker: {
        height: Platform.OS === 'ios' ? 200 : 60,
        color: colors.dark,
    },
    submitButton: {
        marginVertical: 12,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});

export default CreateProductScreen;
