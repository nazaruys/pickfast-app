import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { formatDistanceToNow } from 'date-fns';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import Screen from '../components/Screen';
import colors from '../config/colors';
import AppText from '../components/AppText';
import { useNavigation } from '@react-navigation/native';
import baseFetch from '../functions/baseFetch';

const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    priority: Yup.string().required('Priority is required'),
    store_id: Yup.string().nullable(),
});

function ProductDetailsScreen({ route }) {
    const navigation = useNavigation();
    const { productId } = route.params;

    const [product, setProduct] = useState(null);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);

    const onDeleteProduct = async () => {
        const data = await baseFetch(`group/groups/groupId/products/${productId}/`, 'DELETE');
        data && navigation.goBack();
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const product = await baseFetch(`group/groups/groupId/products/${productId}/`, 'GET');
                product && setProduct(product);

                const stores = await baseFetch(`group/groups/groupId/stores/`, 'GET');
                stores && setStores(stores);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching data: ', error);
            }
        };
        fetchData();
    }, [productId]);

    const handleTextChange = (input) => {
        const filteredInput = input.replace(/[^\p{L}\p{N}\p{P}\p{Zs}]/gu, '');
        return filteredInput;
    };

    if (loading) {
        return <Screen style={{ backgroundColor: colors.background }} />;
    }

    return (
        <Screen style={{ backgroundColor: product.date_buyed ? colors.lightGreen : colors.yellow }}>
            <Formik
                enableReinitialize
                initialValues={{
                    title: product.title,
                    priority: product.priority,
                    store_id: product?.store_id ?? null,
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                    const data = await baseFetch(`group/groups/groupId/products/${productId}/`, 'PATCH', {
                        title: values.title,
                        priority: values.priority,
                        store_id: values.store_id,
                    });
                    data && navigation.goBack();
                }}
            >
                {({ handleSubmit, setFieldValue, values, errors, touched }) => (
                    <>
                        <AppHeader title="Product Details" onBackPress={handleSubmit} />
                        <View style={styles.container}>
                            <TextInput
                                value={values.title}
                                onChangeText={(text) => setFieldValue('title', handleTextChange(text))}
                                maxLength={40}
                                style={styles.titleInput}
                                placeholder="Title"
                            />
                            {touched.title && errors.title && <AppText style={styles.error}>{errors.title}</AppText>}

                            {product.date_buyed && (
                                <AppText style={styles.boughtDate}>
                                    Bought {formatDistanceToNow(new Date(product.date_buyed), { addSuffix: true })}
                                </AppText>
                            )}

                            <View style={styles.picker}>
                                <Picker
                                    selectedValue={values.priority}
                                    onValueChange={(value) => setFieldValue('priority', value)}
                                >
                                    <Picker.Item label="Low priority" value="L" />
                                    <Picker.Item label="Medium priority" value="M" />
                                    <Picker.Item label="High priority" value="H" />
                                </Picker>
                            </View>
                            {touched.priority && errors.priority && <AppText style={styles.error}>{errors.priority}</AppText>}

                            <View style={styles.picker}>
                                <Picker
                                    selectedValue={values.store_id}
                                    onValueChange={(value) => setFieldValue('store_id', value)}
                                >
                                    <Picker.Item label="Any Store" value={null} />
                                    {Array.isArray(stores) &&
                                        stores.map((store) => (
                                            <Picker.Item key={store.id} label={store.name} value={store.id} />
                                        ))}
                                </Picker>
                            </View>

                            <AppText style={styles.added_by}>Added by {product.added_by.name}</AppText>
                            <TouchableOpacity style={styles.deleteButton} onPress={onDeleteProduct}>
                                <MaterialCommunityIcons name="delete" color={colors.red} size={40} />
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
    titleInput: {
        fontSize: 28,
        marginVertical: '5%',
    },
    picker: {
        backgroundColor: colors.white,
        height: 60,
        borderRadius: 12,
        marginBottom: '5%',
        justifyContent: 'center',
    },
    added_by: {
        fontSize: 20,
        marginBottom: 30,
    },
    error: {
        color: 'red',
        fontSize: 14,
        marginBottom: 10,
    },
    boughtDate: {
        marginBottom: '5%',
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
    },
    deleteText: {
        fontSize: 22,
        color: colors.red,
    },
});

export default ProductDetailsScreen;
