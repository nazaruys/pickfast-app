import React, { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Store from '../components/Store';
import colors from '../config/colors';
import AddButton from '../components/AddButton';
import Container from '../components/Container';

function StoresScreen() {
    const navigation = useNavigation();

    const [stores, setStores] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    
    const fetchStores = async () => {
        const groupId = await AsyncStorage.getItem('groupId')
        const access_token = await AsyncStorage.getItem('accessToken');
        const url = `http://10.0.2.2:8000/api/group/groups/${groupId}/stores/`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            const data = await response.json();
            console.log(data)
            setStores(data);
        } catch (error) {
            console.error('Error fetching the stores:', error);
        }
    };
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                await fetchStores();
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
                        onRefresh={() => fetchStores()}
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
