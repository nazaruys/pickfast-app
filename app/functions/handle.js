import AsyncStorage from "@react-native-async-storage/async-storage"
import { 
    fetchBlockUser, 
    fetchChangeGroupPrivacy, 
    fetchLeaveGroup, 
    fetchMakeUserAdmin, 
    fetchMembers, 
    fetchRemoveUser
} from "./apiGroups"
import { fetchUser } from "./apiUsers"

export const handleLeave = async (navigation) => {
    await AsyncStorage.removeItem('groupId')
    await fetchLeaveGroup()
    navigation.navigate('EnterGroup')
}

export const handleRemoveUser = async (user, block = false) => {
    await fetchRemoveUser(user)
    if (block) {
        await fetchBlockUser(user)
    }
    await fetchMembers()
}

export const makeUserAdmin = async (user) => {
    await fetchMakeUserAdmin(user)
    await fetchUser()
    await fetchMembers()
}

export const changeGroupPrivacy = async (isPrivate, setIsPrivate) => {
    await fetchChangeGroupPrivacy(isPrivate)
    setIsPrivate(!isPrivate)
}