import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { BackHandler, Image, ScrollView, StyleSheet, View } from 'react-native';

import ProfileCard from '../components/ProfileCard';
import AppText from '../components/AppText';
import { createLogoutAlert } from '../functions/alerts';
import { fetchUser } from '../functions/apiUsers';
import colors from '../config/colors';
import SmallButton from '../components/SmallButton';

function ProfileScreen() {
    const navigation = useNavigation()
    
    const [userData, setUserData] = useState();
    
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
        });
        return () => backHandler.remove();
    }, [navigation]);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                const data = await fetchUser()
                data && setUserData(data)
            };
            fetchData()   
        }, [])
    );

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {userData &&
                <>
                    <View style={styles.userContainer}>
                        <AppText style={styles.name}>{userData.name}</AppText>
                        <AppText style={styles.username}>{userData.username}</AppText>
                    </View> 
                    <ProfileCard icon='group' title='Group' subTitle={userData.group_id} onPress={() => navigation.navigate('Group')} />
                    <ProfileCard icon='account-circle' title='Edit profile' onPress={() => navigation.navigate('EditProfile')} />
                    
                    {!userData.verified && 
                        <View style={styles.verifyEmailCard}>
                            <Image style={styles.verifyEmailImage} source={require('../assets/email.png')}/>
                            <View style={styles.verifyEmailContent}>
                                <AppText style={styles.verifyEmailTitle}>Unlock new features!</AppText>
                                <SmallButton title={'Verify Email'} onPress={() => navigation.navigate('VerifyEmail', {email: userData.email})} />
                            </View>
                        </View>
                    }
                    <ProfileCard icon='feedback' title='Feedback' onPress={() => navigation.navigate('Feedback', {email: userData.email})} />
                </>
            }
            <ProfileCard icon='logout' title='Log out' style={styles.logoutCard} onPress={createLogoutAlert} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: '5%'
    },
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
        marginTop: 20
    },
    verifyEmailCard: {
        width: '100%',
        height: 130,
        padding: '3%',
        backgroundColor: colors.backgroundSecondary,
        borderRadius: 10,
        borderWidth: 0.4,
        borderColor: colors.grey,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    verifyEmailImage: {
        width: 120,
        height: '90%',
    },
    verifyEmailTitle: {
        fontWeight: '700',
        fontSize: 16
    },
    verifyEmailContent: {
        width: '50%',
        height: '100%',
        justifyContent: 'space-evenly'
    }
})

export default ProfileScreen;