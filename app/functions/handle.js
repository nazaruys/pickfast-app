import AsyncStorage from "@react-native-async-storage/async-storage"
import { 
    fetchBlockUser, 
    fetchChangeGroupPrivacy, 
    fetchLeaveGroup, 
    fetchRemoveUser,
} from "./apiGroups"
import { resetToEnterGroup } from "../navigationService"

export const handleLeave = async () => {
    await AsyncStorage.removeItem('groupId')
    await fetchLeaveGroup()
    resetToEnterGroup()
}

export const handleRemoveUser = async (user, block = false, membersBlocked, setMembersBlocked) => {
    await fetchRemoveUser(user)
    if (block) {
        await fetchBlockUser(user, membersBlocked, setMembersBlocked)
    }
}
export const changeGroupPrivacy = async (isPrivate, setIsPrivate) => {
    await fetchChangeGroupPrivacy(isPrivate)
    setIsPrivate(!isPrivate)
}