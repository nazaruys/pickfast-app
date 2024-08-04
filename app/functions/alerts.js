import { Alert } from "react-native";
import logOut from "./logOut";
import { 
    changeGroupPrivacy, 
    handleLeave, 
    handleRemoveUser, 
    handleUnblockMember, 
    makeUserAdmin 
} from "./handle";

export const createLogoutAlert = () =>
    Alert.alert('Are you sure you want to logout?', 'You will need to login or create a new account', [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Log out', onPress: logOut},
  ], {cancelable: true});

export const createExitGroupAlert = () =>
    Alert.alert('Confirm', 'Are you sure you want to leave your group?', [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Leave', onPress: handleLeave},
], {cancelable: true});

export const createRemoveUserAlert = (user, setMembers, membersBlocked, setMembersBlocked) =>
    Alert.alert('Confirm', `Are you sure you want to remove ${user.name} from the group?`, [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Remove and block', onPress: () => handleRemoveUser(user, block=true, setMembers, membersBlocked, setMembersBlocked)},
        {text: 'Remove', onPress: () => handleRemoveUser(user, block=false, setMembers)},
], {cancelable: true});

export const createChangeGroupPrivacyAlert = (isPrivate, setIsPrivate) =>
    Alert.alert(`Are you sure you want to make this group ${isPrivate ? 'Public' : 'Private'}?`, 
            `This group is then ${isPrivate ? 'open' : 'closed'} for anyone`, [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Confirm', onPress: () => changeGroupPrivacy(isPrivate, setIsPrivate)},
], {cancelable: true});

export const createNotAdminAlert = () =>
    Alert.alert(`You are not allowed to change the privacy of the group`, 
            ``, [
        {
        text: 'Close',
        style: 'cancel',
        },
], {cancelable: true});

export const createGiveAdminAlert = (user) =>
    Alert.alert(`Are you sure you want to make ${user.name} an admin?`, 
            `You will lose your admin abilities`, [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Confirm', onPress: () => makeUserAdmin(user, setMembers)},
], {cancelable: true});

export const createOkAlert = (message) =>
    Alert.alert(message, '', [
        {
        text: 'OK',
        },
  ], {cancelable: true});

  
  export const createUnBlockMemberAlert = (user, setMembers, membersBlocked, setMembersBlocked) =>
    Alert.alert(`Are you sure you want to unblock ${user.name}?`, 
            `${user.name} is then able to join this group`, [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Confirm', onPress: () => handleUnblockMember(user, setMembers, membersBlocked, setMembersBlocked)},
], {cancelable: true});