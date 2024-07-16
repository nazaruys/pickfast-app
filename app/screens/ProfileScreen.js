import React, { useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import ProfileCard from '../components/ProfileCard';
import Container from '../components/Container';
import token from '../config/token';
import AppText from '../components/AppText';

function ProfileScreen(props) {
    const [userData, setUserData] = useState();
    
    const fetchUser = async () => {
        const access_token = await AsyncStorage.getItem('accessToken');
        const decodedToken = jwtDecode(access_token);
        const url = `http://10.0.2.2:8000/api/core/users/${decodedToken.user_id}/`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            setUserData(data);
        } catch (error) {
            console.error('Error fetching the user:', error);
            setUserData({name: 'N/A', username: 'N/A', group_id: 'N/A'});
        }
    };
    
    useFocusEffect(
        useCallback(() => {
            fetchUser()
        }, [])
    );

    return (
        <Container>
            {userData &&
            <View style={styles.userContainer}>
                <AppText style={styles.name}>{userData.name}</AppText>
                <AppText style={styles.username}>{userData.username}</AppText>
            </View> 
            }
            {userData &&
            <ProfileCard icon='group' title='Group' subTitle={userData.group_id} onPress={() => console.log('Navigating to the Group Screen!')} />
            }   
            <ProfileCard icon='account-circle' title='Edit profile' onPress={() => console.log('Navigating to the Edit Profile Screen!')} />
        </Container>
    );
}

const styles = StyleSheet.create({
    userContainer: {
        padding: 10,
        marginBottom: 15
    },
    name: {
        fontSize: 24,
    },
    username: {
        fontSize: 20,
    }
})

export default ProfileScreen;