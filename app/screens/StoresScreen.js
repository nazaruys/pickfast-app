import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Store from '../components/Store';
import colors from '../config/colors';
import AddButton from '../components/AddButton';
import Container from '../components/Container';
import AppText from '../components/AppText';
import baseFetch from '../functions/baseFetch';

function StoresScreen() {
    const navigation = useNavigation();

    const [stores, setStores] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                const data = await baseFetch(`group/groups/groupId/stores/`, 'GET')
                data && setStores(data);
            };
            fetchData();
        }, [])
    );

    const onRefresh = async () => {
        const data = await baseFetch(`group/groups/groupId/stores/`, 'GET')
        data && setStores(data);
    };

    const renderEmptyState = () => (
        <View style={styles.emptyStateContainer}>
            <Image 
                source={require('../assets/shopping-cart.png')}
                style={styles.noStoresImage}
            />
            <AppText style={styles.title}>No stores</AppText>
            <AppText style={styles.subtitle}>Tap the + button to add</AppText>
        </View>
    );

    return (
        <Container>
            <FlatList
                data={stores}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Store 
                        store={item}
                        handlePress={() => navigation.navigate('StoreDetails', { store: item })}
                    />
                )}
                ListEmptyComponent={renderEmptyState}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
            />
            <AddButton style={styles.addButton} onPress={() => navigation.navigate('CreateStore')} />
        </Container>
    );
}

const styles = StyleSheet.create({
    addButton: {
        position: 'absolute',
        right: 25,
        bottom: 25,
    },
    noStoresImage: {
        width: '100%',
        height: 200,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginVertical: 20,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: '30%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: colors.darkGrey
    },
});

export default StoresScreen;
