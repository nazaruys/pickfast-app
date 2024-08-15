import AsyncStorage from "@react-native-async-storage/async-storage";

import logOut from "./logOut";
import { getRefreshToken } from "./getAsyncStorage";

export default fetchRefreshToken = async () => {
    try {
        API_URL = process.env.EXPO_PUBLIC_API_URL
        console.log('Refreshing token!')
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
            console.log('Refreshed succesfully!')
            return data.access 
        }
        logOut()
        return
    } catch (error) {
        logOut()
        return
    }
}