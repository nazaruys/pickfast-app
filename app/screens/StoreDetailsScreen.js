import React from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {MaterialCommunityIcons} from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../components/AppHeader';
import Screen from '../components/Screen';
import colors from '../config/colors';
import AppText from '../components/AppText';
import baseFetch from '../functions/baseFetch';

const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
});

function StoreDetailsScreen({ route }) {
    const navigation = useNavigation();
    const { store } = route.params;

    const onDeleteStore = async () => {
        const response = await baseFetch(`group/groups/groupId/stores/${store.id}/`, "DELETE")
        if (response) {
            navigation.goBack();
        }
    }

    const handleTextChange = (input) => {
        const filteredInput = input.replace(/[^\p{L}\p{N}\p{P}\p{Zs}]/gu, '');
        return filteredInput;
    };

    return (
        <Screen style={{ backgroundColor: colors.yellow }}>
            <Formik
                enableReinitialize
                initialValues={{
                    name: store.name
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    const data = await baseFetch(`group/groups/groupId/stores/${store.id}/`, "PATCH", {name: values.name})
                    data && navigation.goBack();
                }}
            >
                {({ setFieldValue, handleSubmit, values, errors, touched }) => (
                    <>
                        <AppHeader 
                            title='Store Details' 
                            onBackPress={handleSubmit}
                        />
                        <View style={styles.container}>
                            <TextInput
                                value={values.name}
                                maxLength={50}
                                onChangeText={(text) => setFieldValue('name', handleTextChange(text))}
                                style={styles.nameInput}
                                placeholder="Name"
                            />
                            {touched.name && errors.name && <AppText style={styles.error}>{errors.name}</AppText>}
                        
                            <TouchableOpacity style={styles.deleteButton} onPress={onDeleteStore}>
                                <MaterialCommunityIcons name='delete' color={colors.red} size={40} />
                                <AppText style={styles.deleteText}>Delete</AppText>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </Formik>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: '5%',
    },
    nameInput: {
        fontSize: 28,
        marginVertical: '5%',
    },
    added_by: {
        fontSize: 20,
        marginBottom: 30
    },
    error: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12
    },
    deleteText: {
        fontSize: 22,
        color: colors.red
    }
});

export default StoreDetailsScreen;
