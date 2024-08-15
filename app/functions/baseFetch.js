import fetchRefreshToken from "./fetchRefreshToken"
import { getAccessToken, getGroupId } from "./getAsyncStorage"
import logOut from "./logOut"

export default baseFetch = async (passedPath, method, body = {}) => {
    try {
        const groupId = await getGroupId()
        let path = passedPath.replace('groupId', groupId)
        const fetchData = async () => {
            const accessToken = await getAccessToken();
            const options = {
                method: method,
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            };
            
            if (method !== 'GET') {
                options.body = JSON.stringify(body);
            }
            API_URL = process.env.EXPO_PUBLIC_API_URL
            return await fetch(API_URL + path, options);
        };
        for (let i = 0; i < 2; i++) {
            const response = await fetchData()
            if (response.ok) {
                if (response.status !== 204) {
                    const data = await response.json();
                    return data;
                } else {
                    return response
                }
            } else if (response.status === 401) {
                const access = await fetchRefreshToken()
                if (!access || i === 1) {
                    logOut()
                    return null
                }
            } else {
                logOut()
                return null
            }
        }
          
    } catch (error) {
        console.error("Fetch error:", error);
        logOut()
        return null
    }
}