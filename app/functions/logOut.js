import AsyncStorage from "@react-native-async-storage/async-storage"
import { resetToWelcome } from "../navigationService"

export default logOut = async () => {
    await AsyncStorage.removeItem('accessToken')
    await AsyncStorage.removeItem('refreshToken')
    await AsyncStorage.removeItem('groupId')
    resetToWelcome()
}