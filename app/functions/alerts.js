import { Alert } from "react-native";
import { logOut } from "./apiUsers";
import { 
    changeGroupPrivacy, 
    handleLeave, 
    handleRemoveUser, 
    makeUserAdmin 
} from "./handle";

export const createLogoutAlert = () =>
    Alert.alert('Are you sure you want to logout?', 'You will need to login or create a new account', [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Log out', onPress: logOut},
  ]);

export const createExitGroupAlert = (navigation) =>
    Alert.alert('Confirm', 'Are you sure you want to leave your group?', [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Leave', onPress: () => handleLeave(navigation)},
]);

export const createRemoveUserAlert = (user) =>
    Alert.alert('Confirm', `Are you sure you want to remove ${user.name} from the group?`, [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Remove and block', onPress: () => handleRemoveUser(user, block=true)},
        {text: 'Remove', onPress: () => handleRemoveUser(user, block=false)},
]);

export const createChangeGroupPrivacyAlert = (isPrivate, setIsPrivate) =>
    Alert.alert(`Are you sure you want to make this group ${isPrivate ? 'Public' : 'Private'}?`, 
            `This group is then ${isPrivate ? 'open' : 'closed'} for anyone`, [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Confirm', onPress: () => changeGroupPrivacy(isPrivate, setIsPrivate)},
]);

export const createNotAdminAlert = () =>
    Alert.alert(`You are not allowed to change the privacy of the group`, 
            ``, [
        {
        text: 'Close',
        style: 'cancel',
        },
]);

export const createGiveAdminAlert = (user) =>
    Alert.alert(`Are you sure you want to make ${user.name} an admin?`, 
            `You will lose your admin abilities`, [
        {
        text: 'Cancel',
        style: 'cancel',
        },
        {text: 'Confirm', onPress: () => makeUserAdmin(user)},
]);
