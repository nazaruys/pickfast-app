import React, { useCallback, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import AppHeader from '../components/AppHeader';
import Screen from '../components/Screen';
import colors from '../config/colors';
import UserCard from '../components/UserCard';
import AppText from '../components/AppText';

function GroupScreen() {
    const navigation = useNavigation()

    const [isPrivate, setIsPrivate] = useState(false)
    const [members, setMembers] = useState([]);
    const [userData, setUserData] = useState();

    const fetchMembers = async () => {
        const groupId = await AsyncStorage.getItem('groupId');
        const access_token = await AsyncStorage.getItem('accessToken');
        const url = `http://10.0.2.2:8000/api/group/groups/${groupId}/members/`;
        console.log(url)
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            const data = await response.json();
            setMembers(data);
        } catch (error) {
            console.error('Error fetching the user:', error);
            setMembers([]);
        }
    };

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

    const fetchGroupPrivacy = async () => {
        const groupId = await AsyncStorage.getItem('groupId');
        const access_token = await AsyncStorage.getItem('accessToken');
        const url = `http://10.0.2.2:8000/api/group/groups/${groupId}/`;
        console.log(url)
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            });
            const data = await response.json();
            setIsPrivate(data.private);
        } catch (error) {
            console.error('Error fetching the user:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
          const fetchData = async () => {
            await fetchUser()
            await fetchMembers()
            await fetchGroupPrivacy()
          };
          fetchData();
        }, [])
    );

    const fetchLeaveGroup = async () => {
        try {
            const access_token = await AsyncStorage.getItem('accessToken')
            console.log("Fetching: ", `http://10.0.2.2:8000/api/core/users/${jwtDecode(access_token).user_id}/`)
            const response = await fetch(`http://10.0.2.2:8000/api/core/users/${jwtDecode(access_token).user_id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    group_id: null
                })
            });
            const data = await response.json();
            console.log('Updated user:', data);
        } catch (error) {
            console.error('Error posting user:', error);
        }
    };

    const fetchRemoveUser = async (user) => {
        try {
            const access_token = await AsyncStorage.getItem('accessToken')
            console.log("Fetching: ", `http://10.0.2.2:8000/api/core/users/${user.id}/`)
            const response = await fetch(`http://10.0.2.2:8000/api/core/users/${user.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    group_id: null
                })
            });
            const data = await response.json();
            console.log('Updated user:', data);
        } catch (error) {
            console.error('Error posting user:', error);
        }
    };
    const fetchBlockUser = async (user) => {
        try {
            const access_token = await AsyncStorage.getItem('accessToken')
            const response = await fetch(`http://10.0.2.2:8000/api/group/groups/${userData.group_id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    users_blacklist: [user.id]
                })
            });
            const data = await response.json();
            console.log('Updated group:', data);
        } catch (error) {
            console.error('Error posting user:', error);
        }
    };
    
    const fetchChangeGroupPrivacy = async () => {
        try {
            const access_token = await AsyncStorage.getItem('accessToken')
            const response = await fetch(`http://10.0.2.2:8000/api/group/groups/${userData.group_id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    private: !isPrivate
                })
            });
            const data = await response.json();
            console.log('Updated group:', data);
        } catch (error) {
            console.error('Error posting user:', error);
        }
    };

    const handleLeave = async () => {
        await AsyncStorage.removeItem('groupId')
        await fetchLeaveGroup()
        navigation.navigate('EnterGroup')
    }

    const handleRemoveUser = async (user, block = false) => {
        await fetchRemoveUser(user)
        await fetchMembers()
        if (block) {
            await fetchBlockUser(user)
        }
    }

    const changeGroupPrivacy = async () => {
        await fetchChangeGroupPrivacy()
        setIsPrivate(!isPrivate)
    }

    const createExitGroupAlert = () =>
        Alert.alert('Confirm', 'Are you sure you want to leave your group?', [
            {
            text: 'Cancel',
            style: 'cancel',
            },
            {text: 'Leave', onPress: handleLeave},
    ]);

    const createRemoveUserAlert = (user) =>
        Alert.alert('Confirm', `Are you sure you want to remove ${user.name} from the group?`, [
            {
            text: 'Cancel',
            style: 'cancel',
            },
            {text: 'Remove and block', onPress: () => handleRemoveUser(user, block=true)},
            {text: 'Remove', onPress: () => handleRemoveUser(user, block=false)},
    ]);

    const createChangeGroupStatusAlert = () =>
        Alert.alert(`Are you sure you want to make this group ${isPrivate ? 'Public' : 'Private'}?`, 
                `This group is then ${isPrivate ? 'open' : 'closed'} for everyone`, [
            {
            text: 'Cancel',
            style: 'cancel',
            },
            {text: 'Confirm', onPress: changeGroupPrivacy},
    ]);
    const createNotAdminAlert = () =>
        Alert.alert(`You are not allowed to change the privacy of the group`, 
                ``, [
            {
            text: 'Cancel',
            style: 'cancel',
            },
    ]);


    return (
        <Screen style={styles.container}>
            <AppHeader title='Group' />
            {members && userData && 
                <FlatList
                    ListHeaderComponent={
                        <View style={styles.content}>
                            <View style={styles.groupInfoContainer}>
                                <AppText style={styles.groupCode}>{userData.group_id}</AppText>
                                <View style={styles.iconsContainer}>
                                    <Ripple onPress={userData.admin_of ? createChangeGroupStatusAlert : createNotAdminAlert} style={styles.icon}>
                                        <MaterialCommunityIcons name={isPrivate ? 'lock' : 'lock-open'} size={40} />
                                    </Ripple>
                                    <Ripple onPress={createExitGroupAlert} style={styles.icon}>
                                        <MaterialCommunityIcons name='logout' size={40} />
                                    </Ripple>
                                </View>
                            </View>
                            {userData && <UserCard style={styles.user} user={userData} />}
                        </View>
                    }
                    style={styles.membersList}
                    data={members.filter(member => member.id !== userData.id)}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <UserCard 
                            user={item}
                            iconShown={userData.admin_of ? true : false}
                            onPressIcon={() => createRemoveUserAlert(item)}
                        />
                    )}
                />
            }
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.backgroundSecondary
    },
    content: {
        paddingTop: 25,
    },
    groupInfoContainer: {
        paddingHorizontal: '5%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25
    },
    groupCode: {
        fontSize: 30
    },
    user: {
        marginBottom: 20
    },
    membersList: {
        paddingHorizontal: '5%',
        bottom: 10,
    },
    iconsContainer: {
        flexDirection: 'row'
    },
    icon: {
        marginHorizontal: 5,
    }
})

export default GroupScreen;