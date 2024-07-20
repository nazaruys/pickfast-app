import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';

import AppHeader from '../components/AppHeader';
import Screen from '../components/Screen';
import colors from '../config/colors';
import UserCard from '../components/UserCard';
import AppText from '../components/AppText';
import { fetchUser } from '../functions/apiUsers';
import { fetchGroupPrivacy, fetchMembers } from '../functions/apiGroups';
import { createChangeGroupPrivacyAlert, createGiveAdminAlert, createNotAdminAlert, createRemoveUserAlert, createExitGroupAlert } from '../functions/alerts';

function GroupScreen() {
    const navigation = useNavigation()

    const [isPrivate, setIsPrivate] = useState(false)
    const [members, setMembers] = useState([]);
    const [userData, setUserData] = useState();

    useFocusEffect(
        useCallback(() => {
          const fetchData = async () => {
            await fetchUser(setUserData)
            await fetchMembers(setMembers)
            await fetchGroupPrivacy(setIsPrivate)
          };
          fetchData();
        }, [])
    );

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
                                    <Ripple onPress={userData.admin_of ? () => createChangeGroupPrivacyAlert(isPrivate, setIsPrivate) : createNotAdminAlert} style={styles.icon}>
                                        <MaterialCommunityIcons name={isPrivate ? 'lock' : 'lock-open'} size={40} />
                                    </Ripple>
                                    <Ripple onPress={() => createExitGroupAlert(navigation)} style={styles.icon}>
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
                            blocked={false}
                            onPressDeleteIcon={() => createRemoveUserAlert(item)}
                            onPressAdminIcon={() => createGiveAdminAlert(item)}
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