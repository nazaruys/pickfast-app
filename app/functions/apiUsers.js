import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

import fetchRefreshToken from './fetchRefreshToken';
import { getAccessToken } from './getAsyncStorage';

API_URL = process.env.EXPO_PUBLIC_API_URL

export const fetchUser = async (setUserData) => {
    // Gets and sets the data for current user
    try {
        const access_token = await getAccessToken()
        const decodedToken = jwtDecode(access_token);
        const fetchData = async (token = access_token) => { 
            return await fetch(`${API_URL}core/users/${decodedToken.user_id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })}
        const response = await fetchData()
        if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                const response = await fetchData(access)
                const data = await response.json()
                setUserData(data);
            }
        } else if (response.status === 200) {
            const data = await response.json();
            setUserData(data);
        } else {
            console.log(await response.json())
        }
    } catch (error) {
        throw(error)
    }
};

export const fetchUserById = async (id) => {
    try {
        const access_token = await getAccessToken()
        const fetchData = async (token = access_token) => { 
            return await fetch(`${API_URL}core/users/${id}/`, {
            method: 'GET', 
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })}
        const response = await fetchData()
        if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                const response = await fetchData(access)
                const data = await response.json()
                return data
            }
        } else if (response.status === 200) {
            const data = await response.json();
            return data
        } else {
            console.log(await response.json())
        }
    } catch (error) {
        throw(error)
    }
};

export const fetchPatchUserGroupCode = async (group_code) => {
    try {
        const access_token = await getAccessToken()
        const fetchData = async (token = access_token) => {
            return await fetch(`${API_URL}core/users/${jwtDecode(access_token).user_id}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id: group_code
            })
        })}
        const response = await fetchData()
        if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                await fetchData(access)
                await AsyncStorage.setItem('groupId', group_code)
            }
        } else if (response.status === 200) {
            await AsyncStorage.setItem('groupId', group_code)
        } else {
            console.log(response.status)
            return response
        }
    } catch (error) {
        throw(error)
    }
};
export const fetchPatchUser = async (values) => {
    try {
        const access_token = await getAccessToken()
        const fetchData = async (token = access_token) => {
            return await fetch(
                `${API_URL}core/users/${jwtDecode(access_token).user_id}/`, 
                {method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: values.username,
                    name: values.name
                    })}
                )
        }
        const response = await fetchData()
        if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                const response = await fetchData(access)
                return response
            }
            return response
        }
        return response

    } catch (error) {
        throw(error)
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
        throw(error)
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
        throw(error)
    }
};

