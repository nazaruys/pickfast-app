import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const fetchUser = async (setUserData) => {
    const access_token = await AsyncStorage.getItem('accessToken');
    const decodedToken = jwtDecode(access_token);
    try {
        const response = await fetch(`http://10.0.2.2:8000/api/core/users/${decodedToken.user_id}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        const data = await response.json();
        setUserData(data);
    } catch (error) {
        throw error
    }
};

export const fetchPatchUserGroupCode = async (group_code) => {
    try {
        const access_token = await AsyncStorage.getItem('accessToken')
        await fetch(`http://10.0.2.2:8000/api/core/users/${jwtDecode(access_token).user_id}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id: group_code
            })
        });
        AsyncStorage.setItem('groupId', group_code)
        
    } catch (error) {
        throw error
    }
};

export const fetchLoginUser = async (values) => {
    try {
        const response = await fetch("http://10.0.2.2:8000/api/core/login/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: values.username,
                password: values.password
            })
        });
        const data = await response.json();
        return data
    } catch (error) {
        throw error
    }
};

export const fetchPostUser = async (values) => {
    try {
        const response = await fetch("http://10.0.2.2:8000/api/core/users/", {
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
        });
        const data = await response.json();
        return data
    } catch (error) {
        throw error
    }
};

export const logOut = async () => {
    navigation.navigate('Welcome')
    await AsyncStorage.removeItem('accessToken')
    await AsyncStorage.removeItem('refreshToken')
    await AsyncStorage.removeItem('groupId')
}