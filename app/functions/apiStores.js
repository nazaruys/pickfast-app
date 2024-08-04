import fetchRefreshToken from './fetchRefreshToken';
import { getAccessToken, getGroupId } from './getAsyncStorage';

export const fetchStores = async () => {
    try {
        const access_token = await getAccessToken()
        const groupId = await getGroupId()
        const fetchData = async (token = access_token) => {
            return await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/stores/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
        })}
        const response = await fetchData()
        if (response.status === 200) {
            const data = await response.json();
            return data
        } else if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                const response = await fetchData(access)
                const data = await response.json()
                return data
            }
        } else {
            console.log(await response.json())
        }
    } catch (error) {
        throw error;
    }
};

export const fetchPostStore = async (values) => {
    try {
        const access_token = await getAccessToken()
        const groupId = await getGroupId()
        const fetchData = async (token = access_token) => {
            return await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/stores/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: values.name
                })
        })}
        const response = await fetchData()
        if (response.status === 201) {
            const data = await response.json();
            return data;
        } else if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                const response = await fetchData(access)
                const data = await response.json()
                return data
            }
        } else {
            console.log(await response.json())
        }
    } catch (error) {
        throw error
    }
};