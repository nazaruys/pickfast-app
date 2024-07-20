import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchStores = async () => {
    try {
        const access_token = await AsyncStorage.getItem('accessToken');
        const groupId = await AsyncStorage.getItem('groupId');
        const response = await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/stores/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const fetchPostStore = async (values) => {
    try {
        const access_token = await AsyncStorage.getItem('accessToken');
        const groupId = await AsyncStorage.getItem('groupId')
        await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/stores/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: values.name
            })
        });
    } catch (error) {
        throw error
    }
};