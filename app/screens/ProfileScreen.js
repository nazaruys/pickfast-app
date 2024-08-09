import React, { useCallback, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';

import ProfileCard from '../components/ProfileCard';
import Container from '../components/Container';
import AppText from '../components/AppText';
import { createLogoutAlert } from '../functions/alerts';
import { fetchUser } from '../functions/apiUsers';

function ProfileScreen() {
    const navigation = useNavigation()
    
    const [userData, setUserData] = useState();
    
    useFocusEffect(() => {
        const fetchData = async () => {
            await fetchUser(setUserData)
        };
        fetchData()
        }
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
            <ProfileCard icon='group' title='Group' subTitle={userData.group_id} onPress={() => navigation.navigate('Group')} />
            }   
            <ProfileCard icon='account-circle' title='Edit profile' onPress={() => navigation.navigate('EditProfile')} />
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