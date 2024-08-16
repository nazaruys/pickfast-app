import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

import fetchRefreshToken from './fetchRefreshToken';
import { getAccessToken } from './getAsyncStorage';

API_URL = process.env.EXPO_PUBLIC_API_URL

export const fetchUser = async () => {
    const data = baseFetch('core/users/userId/', 'GET')
    return data
};

export const fetchPatchUserGroupCode = async (groupCode) => {
    try {
        const fetchData = async () => {
            const accessToken = await getAccessToken();
            const options = {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({group_id: groupCode})
            };
            const userId = jwtDecode(accessToken).user_id
            return await fetch(`${API_URL}core/users/${userId}/`, options);
        };
        for (let i = 0; i < 2; i++) {
            const response = await fetchData()
            if (response.status === 400 || response.status === 403 || response.status === 200) {
                return response
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
};

export const fetchPatchUser = async () => {
    try {
        const fetchData = async () => {
            const accessToken = await getAccessToken();
            const options = {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: values.username, name: values.name})
            };
            const userId = jwtDecode(accessToken).user_id
            return await fetch(API_URL + `core/users/${userId}/`, options);
        };
        for (let i = 0; i < 2; i++) {
            const response = await fetchData()
            if (response.status === 200 || response.status === 400) {
                return response;
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
};


// 2 individuals

export const fetchLoginUser = async (values) => {
    try {
        const fetchData = async () => {
            return await fetch(`${API_URL}core/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    password: values.password
                })
        })}
        const response = await fetchData()
        if (response.status === 200) {
            const data = await response.json();
            return data
        } else {
            return null
        }
    } catch (error) {
        console.error("Fetch error:", error);
        logOut()
        return null
    }
};

export const fetchPostUser = async (values) => {
    try {
        const fetchData = async () => {
            return await fetch(`${API_URL}core/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    email: values.email,
                    name: values.name,
                    password: values.password
                })
        })}
        const response = await fetchData()
        const data = await response.json();
        return data
    } catch (error) {
        console.error("Fetch error:", error);
        logOut()
        return null
    }
};

