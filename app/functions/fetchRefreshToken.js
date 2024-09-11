import AsyncStorage from "@react-native-async-storage/async-storage";

import logOut from "./logOut";
import { getRefreshToken } from "./getAsyncStorage";

export default fetchRefreshToken = async () => {
    try {
        const DEBUG = process.env.EXPO_PUBLIC_DEBUG === 'true'
        let API_URL
        if (DEBUG) {
            API_URL = process.env.EXPO_PUBLIC_DEV_API_URL
        } else {
            API_URL = process.env.EXPO_PUBLIC_PROD_API_URL
        }
        const refreshToken = await getRefreshToken()
        const response = await fetch(`${API_URL}core/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh: refreshToken
            })
        });
        if (response.status === 200) {
            const data = await response.json()
            await AsyncStorage.setItem('accessToken', data.access)
            return data.access 
        }
        logOut()
        return
    } catch (error) {
        logOut()
        return
    }
}