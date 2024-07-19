import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import ProfileCard from '../components/ProfileCard';
import Container from '../components/Container';
import AppText from '../components/AppText';

function ProfileScreen() {
    const navigation = useNavigation()
    
    const [userData, setUserData] = useState();
    
    const fetchUser = async () => {
        const access_token = await AsyncStorage.getItem('accessToken');
        const decodedToken = jwtDecode(access_token);
        const url = `http://10.0.2.2:8000/api/core/users/${decodedToken.user_id}/`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
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
    
    const logOut = async () => {
        navigation.navigate('Welcome')

        await AsyncStorage.removeItem('accessToken')
        await AsyncStorage.removeItem('refreshToken')
        await AsyncStorage.removeItem('groupId')
    }

    const createLogoutAlert = () =>
        Alert.alert('Are you sure you want to logout?', 'You will need to login or create a new account', [
            {
            text: 'Cancel',
            style: 'cancel',
            },
            {text: 'Log out', onPress: logOut},
    ]);

    return (
        <Container>
            {userData &&
            <View style={styles.userContainer}>
                <AppText style={styles.name}>{userData.name}</AppText>
                <AppText style={styles.username}>{userData.username}</AppText>
            </View> 
            }
            {userData &&
            <ProfileCard icon='group' title='Group' subTitle={userData.group_id} onPress={() => navigation.navigate('Group')} />
            }   
            <ProfileCard icon='account-circle' title='Edit profile' onPress={() => console.log('Navigating to the Edit Profile Screen!')} />
            <ProfileCard icon='logout' title='Log out' style={styles.logoutCard} onPress={createLogoutAlert} />
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
    },
    logoutCard: {
        marginTop: 30
    }
})

export default ProfileScreen;