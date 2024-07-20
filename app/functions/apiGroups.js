import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

export const fetchMembers = async (setMembers) => {
    const groupId = await AsyncStorage.getItem('groupId');
    const access_token = await AsyncStorage.getItem('accessToken');
    try {
        const response = await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/members/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        const data = await response.json();
        setMembers(data);
    } catch (error) {
        throw error
    }
};

export const fetchGroupId = async () => {
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
        return data.group_id
    } catch (error) {
        throw error
    }
};

export const fetchGroupPrivacy = async (setIsPrivate) => {
    const groupId = await AsyncStorage.getItem('groupId');
    const access_token = await AsyncStorage.getItem('accessToken');
    try {
        const response = await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        const data = await response.json();
        setIsPrivate(data.private);
    } catch (error) {
        throw error
    }
};

export const fetchChangeGroupPrivacy = async (isPrivate) => {
    try {
        const access_token = await AsyncStorage.getItem('accessToken')
        const groupId = await AsyncStorage.getItem('groupId');
        await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                private: !isPrivate
            })
        });
    } catch (error) {
        throw error
    }
};

export const fetchLeaveGroup = async () => {
    try {
        const access_token = await AsyncStorage.getItem('accessToken')
        await fetch(`http://10.0.2.2:8000/api/core/users/${jwtDecode(access_token).user_id}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id: null
            })
        });
    } catch (error) {
        throw error
    }
};

export const fetchRemoveUser = async (user) => {
    try {
        const access_token = await AsyncStorage.getItem('accessToken')
        await fetch(`http://10.0.2.2:8000/api/core/users/${user.id}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                group_id: null
            })
        });
    } catch (error) {
        throw error
    }
};

export const fetchBlockUser = async (user) => {
    try {
        const access_token = await AsyncStorage.getItem('accessToken')
        const groupId = await AsyncStorage.getItem('groupId');
        await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                users_blacklist: [user.id]
            })
        });
    } catch (error) {
        throw error
    }
};

export const fetchMakeUserAdmin = async (user) => {
    try {
        const access_token = await AsyncStorage.getItem('accessToken')
        const groupId = await AsyncStorage.getItem('groupId');
        await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                admin: user.id
            })
        });
    } catch (error) {
        throw error
    }
};