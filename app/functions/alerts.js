import { Alert } from "react-native";
import logOut from "./logOut";
import AsyncStorage from "@react-native-async-storage/async-storage";

import baseFetch from "./baseFetch";
import { fetchUser } from "./apiUsers";
import { getAccessToken } from "./getAsyncStorage";
import { resetToEnterGroup } from "../navigationService";

export const createLogoutAlert = () =>
    Alert.alert('Are you sure you want to logout?', 'You will need to login or create a new account', [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Log out', onPress: logOut},
  ], {cancelable: true});

export const createExitGroupAlert = () => {
    const leaveGroup = async () => {
        const data = await baseFetch(`core/users/userId/`, "PATCH", {group_id: null})
        if (data) {
            await AsyncStorage.removeItem('groupId')
            resetToEnterGroup()
        }
    }
    Alert.alert('Confirm', 'Are you sure you want to leave your group?', [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Leave', onPress: leaveGroup},
    ], {cancelable: true});
}

export const createRemoveUserAlert = (user, setMembers, membersBlocked, setMembersBlocked) => {
    const removeUserAndRefresh = async (block = false) => {
        await baseFetch(`core/users/${user.id}/`, 'PATCH', {group_id: null})
        if (block) {
            const data = await baseFetch('group/groups/groupId/', 'PATCH', {users_blacklist: [user.id]})
            data && setMembersBlocked([...membersBlocked, user])
        }
        
        const members = await baseFetch('group/groups/groupId/members/', 'GET')
        members && setMembers(members)
    }
    Alert.alert('Confirm', `Are you sure you want to remove ${user.name} from the group?`, [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Remove and block', onPress: () => removeUserAndRefresh(block=true)},
        {text: 'Remove', onPress: () => removeUserAndRefresh(block=false)},
    ], {cancelable: true})
}

export const createChangeGroupPrivacyAlert = (isPrivate, setIsPrivate) => {
    const changeGroupPrivacy = async () => {
        const newPrivate = !isPrivate
        const data = await baseFetch('group/groups/groupId/', 'PATCH', {private: newPrivate})
        data && setIsPrivate(newPrivate)
    }
    Alert.alert(`Are you sure you want to make this group ${isPrivate ? 'Public' : 'Private'}?`, 
            `This group is then ${isPrivate ? 'open' : 'closed'} for anyone`, [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Confirm', onPress: changeGroupPrivacy},
    ], {cancelable: true})
}

export const createNotAdminAlert = () =>
    Alert.alert(`You are not allowed to change the privacy of the group`, 
            ``, [
        {
        text: 'Close',
        style: 'cancel',
        },
], {cancelable: true});

export const createGiveAdminAlert = (user, setMembers, setUserData) => {
    const giveAdminAndRefresh = async () => {
        await baseFetch('group/groups/groupId/', 'PATCH', {admin: user.id})

        const data = fetchUser()
        data && setUserData(data)

        const members = await baseFetch('group/groups/groupId/members/', 'GET')
        members && setMembers(members)
    }
    Alert.alert(`Are you sure you want to make ${user.name} an admin?`, 
            `You will lose your admin abilities`, [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Confirm', onPress: giveAdminAndRefresh},
    ], {cancelable: true})
}

export const createOkAlert = (message) => {
    if (typeof message !== 'string' || !message.trim()) {
        message = 'An unexpected error occurred';
    }

    Alert.alert(message, '', [
        { text: 'OK' },
    ], { cancelable: true });
};
  
  export const createUnBlockMemberAlert = (user, setMembers, membersBlocked, setMembersBlocked) => {
    const unblockMemberAndRefresh = async () => {
        const newMembersBlocked = membersBlocked.filter(member => member.id !== user.id)

        const data = await baseFetch('group/groups/groupId/', 'PATCH', {users_blacklist: newMembersBlocked})
        data && setMembersBlocked(newMembersBlocked)

        const members = await baseFetch('group/groups/groupId/members/', 'GET')
        members && setMembers(members)
    }
    Alert.alert(`Are you sure you want to unblock ${user.name}?`, 
            `${user.name} is then able to join this group`, [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Confirm', onPress: unblockMemberAndRefresh},
    ], {cancelable: true})
}