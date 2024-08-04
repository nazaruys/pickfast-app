import AsyncStorage from "@react-native-async-storage/async-storage"

export const getGroupId = async () => {
    return await AsyncStorage.getItem('groupId')
}
export const getAccessToken = async () => {
    return await AsyncStorage.getItem('accessToken')
}
export const getRefreshToken = async () => {
    return await AsyncStorage.getItem('refreshToken')
}