import AsyncStorage from "@react-native-async-storage/async-storage"
import { 
    fetchBlockUser, 
    fetchChangeGroupPrivacy, 
    fetchLeaveGroup, 
    fetchMakeUserAdmin, 
    fetchMembers, 
    fetchRemoveUser,
    fetchUnBlockUser
} from "./apiGroups"
import { fetchUser } from "./apiUsers"
import { resetToEnterGroup } from "../navigationService"

export const handleLeave = async () => {
    await AsyncStorage.removeItem('groupId')
    await fetchLeaveGroup()
    resetToEnterGroup()
}

export const handleRemoveUser = async (user, block = false, setMembers, membersBlocked, setMembersBlocked) => {
    await fetchRemoveUser(user)
    if (block) {
        await fetchBlockUser(user, membersBlocked, setMembersBlocked)
    }
    await fetchMembers(setMembers)
}

export const handleUnblockMember = async (user, setMembers, membersBlocked, setMembersBlocked) => {
    await fetchUnBlockUser(user, membersBlocked, setMembersBlocked)
    await fetchMembers(setMembers)
}

export const makeUserAdmin = async (user, setMembers) => {
    await fetchMakeUserAdmin(user)
    await fetchUser()
    await fetchMembers(setMembers)
}

export const changeGroupPrivacy = async (isPrivate, setIsPrivate) => {
    await fetchChangeGroupPrivacy(isPrivate)
    setIsPrivate(!isPrivate)
}