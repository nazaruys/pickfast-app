import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import fetchRefreshToken from './fetchRefreshToken';
import { getAccessToken } from './getAsyncStorage';

export const fetchUser = async (setUserData) => {
    try {
        const access_token = await getAccessToken()
        const decodedToken = jwtDecode(access_token);
        const fetchData = async (token = access_token) => { 
            return await fetch(`http://10.0.2.2:8000/api/core/users/${decodedToken.user_id}/`, {
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
        throw error
    }
};

export const fetchUserById = async (id) => {
    try {
        const access_token = await getAccessToken()
        const fetchData = async (token = access_token) => { 
            return await fetch(`http://10.0.2.2:8000/api/core/users/${id}/`, {
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
        throw error
    }
};

export const fetchPatchUserGroupCode = async (group_code) => {
    try {
        const access_token = await getAccessToken()
        const fetchData = async (token = access_token) => {
            return await fetch(`http://10.0.2.2:8000/api/core/users/${jwtDecode(access_token).user_id}/`, {
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
                AsyncStorage.setItem('groupId', group_code)
            }
        } else if (response.status === 200) {
            AsyncStorage.setItem('groupId', group_code)
        } else {
            console.log(response.status)
            return response
        }
    } catch (error) {
        throw error
    }
};

export const fetchLoginUser = async (values) => {
    try {
        const fetchData = async () => {
            return await fetch("http://10.0.2.2:8000/api/core/login/", {
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
        throw error
    }
};

export const fetchPostUser = async (values) => {
    try {
        const fetchData = async () => {
            return await fetch("http://10.0.2.2:8000/api/core/users/", {
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
        throw error
    }
};

