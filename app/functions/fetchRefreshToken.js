import AsyncStorage from "@react-native-async-storage/async-storage";

import logOut from "./logOut";
import { getRefreshToken } from "./getAsyncStorage";


export default fetchRefreshToken = async () => {
    try {
        console.log('Refreshing token!')
        const refreshToken = await getRefreshToken()
        const response = await fetch("http://10.0.2.2:8000/api/core/refresh/", {
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
        } else {
            logOut()
            return
        }
    } catch (error) {
        throw error
    }
}