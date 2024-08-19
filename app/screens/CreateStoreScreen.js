import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
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
    name: Yup.string().required('Name is required'),
});

function CreateProductScreen() {
    const navigation = useNavigation();

    const [loading, setLoading] = useState(false);

    return (
        <Screen style={styles.container}>
            <AppHeader title={'Add a Store'} />
            <View style={styles.content}>
                <Formik
                    initialValues={{ name: ''}}
                    validationSchema={validationSchema}
                    onSubmit={async (values, { resetForm }) => {
                        setLoading(true)
                        const data = await baseFetch(`group/groups/groupId/stores/`, 'POST', {name: values.name})
                        data && navigation.goBack();
                        resetForm();
                        setLoading(false)
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
    submitButton: {
        marginVertical: 12
    },
    errorText: {
        color: 'red',
        marginBottom: 10
    }
});

export default CreateProductScreen;
