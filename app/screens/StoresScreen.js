import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';

import Store from '../components/Store';
import token from '../config/token';
import colors from '../config/colors';
import AddButton from '../components/AddButton';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Container from '../components/Container';

function StoresScreen(props) {
    const navigation = useNavigation();
    const [stores, setStores] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    
    const fetchStores = async () => {
        const url = `http://10.0.2.2:8000/api/group/groups/WLMYBR/stores/`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setStores(data);
        } catch (error) {
            console.error('Error fetching the stores:', error);
        }
    };
    useFocusEffect(
        useCallback(() => {
            fetchStores();
        }, [])
    );
    
    return (
        <Container>
            <FlatList
                data={stores}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Store 
                        store={item}
                        handlePress={() => console.log('Navigating to the Store Details Screen!')}
                    />
                )}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchStores}
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
    }
});

export default StoresScreen;
