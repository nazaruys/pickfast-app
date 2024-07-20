import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import Store from '../components/Store';
import colors from '../config/colors';
import AddButton from '../components/AddButton';
import Container from '../components/Container';
import { fetchStores } from '../functions/apiStores';

function StoresScreen() {
    const navigation = useNavigation();

    const [stores, setStores] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                const data = await fetchStores();
                setStores(data)
              };
              fetchData();
        }, [])
    );
    
    return (
        <Container>
            <FlatList
                data={stores}
                keyExtractor={(item) => item.id.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={async () => {await fetchStores();}}
                        colors={[colors.primary]}
                        tintColor={colors.primary}
                    />
                }
                renderItem={({ item }) => (
                    <Store 
                        store={item}
                        handlePress={() => console.log('Navigating to the Store Details Screen!')}
                    />
                )}
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
    }
});

export default StoresScreen;
