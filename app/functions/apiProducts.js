import AsyncStorage from '@react-native-async-storage/async-storage';

export const fetchProducts = async () => {
    try {
		const groupId = await AsyncStorage.getItem('groupId');
		const access_token = await AsyncStorage.getItem('accessToken');
		const response = await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/products/`, {
		method: 'GET',
		headers: {
			'Authorization': `Bearer ${access_token}`
		}
		});
		const data = await response.json();
		return data
	} catch (error) {
		throw error
	}
  };

export const fetchPostProduct = async (values) => {
    try {
        const access_token = await AsyncStorage.getItem('accessToken');
        const groupId = await AsyncStorage.getItem('groupId');
        await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/products/`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: values.title,
                priority: values.priority,
                store_id: values.store_id
            })
        });
    } catch (error) {
        throw error;
    }
};

export const updateProductOnCheck = async (product, bought) => {
    const currentTime = new Date().toISOString();
    try {
		const groupId = await AsyncStorage.getItem('groupId');
		const access_token = await AsyncStorage.getItem('accessToken');
		await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/products/${product.id}/`, {
			method: 'PATCH',
			headers: {
			'Authorization': `Bearer ${access_token}`,
			'Content-Type': 'application/json'
			},
			body: JSON.stringify({ date_buyed: bought ? currentTime : null })
		});
    } catch (error) {
        throw error
    }
};
