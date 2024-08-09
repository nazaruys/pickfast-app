import fetchRefreshToken from './fetchRefreshToken';
import { getAccessToken, getGroupId } from './getAsyncStorage';


export const fetchProducts = async () => {
    try {
		const groupId = await getGroupId()
		const access_token = await getAccessToken()
		const fetchData = async (token = access_token) => { 
            return await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/products/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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
                const data = await response.json();
                return data
            }
        } else {
            console.log(await response.json())
        }
	} catch (error) {
		throw error
	}
  };
export const fetchProduct = async (productId) => {
    try {
		const groupId = await getGroupId()
		const access_token = await getAccessToken()
		const fetchData = async (token = access_token) => { 
            return await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/products/${productId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
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
                const data = await response.json();
                return data
            }
        } else {
            console.log(await response.json())
        }
	} catch (error) {
		throw error
	}
  };

export const fetchDeleteProduct = async (productId) => {
    try {
		const groupId = await getGroupId()
		const access_token = await getAccessToken()
		const fetchData = async (token = access_token) => { 
            return await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/products/${productId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
		})}
        const response = await fetchData()
        if (response.status === 204) {
            return
        } else if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                await fetchData(access)
                return
            }
        } else {
            console.log(await response.json())
        }
	} catch (error) {
		throw error
	}
  };
export const fetchPostProduct = async (values) => {
    try {
        const access_token = await getAccessToken()
        const groupId = await getGroupId()
        const fetchData = async (token = access_token) => {
            return await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/products/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: values.title,
                    priority: values.priority,
                    store_id: values.store_id
                })
        })}
        const response = await fetchData()
        if (response.status === 201) {
            const data = await response.json();
            return data
        } else if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                const response = await fetchData(access)
                const data = await response.json();
                return data
            }
        } else {
            console.log(await response.json())
        }
    } catch (error) {
        throw error;
    }
};
export const fetchPatchProduct = async (productId, values) => {
    try {
        const access_token = await getAccessToken()
        const groupId = await getGroupId()
        const fetchData = async (token = access_token) => {
            return await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/products/${productId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: values.title,
                    priority: values.priority,
                    store_id: values.store_id
                })
        })}
        const response = await fetchData()
        if (response.status === 200) {
            const data = await response.json();
            return data
        } else if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                const response = await fetchData(access)
                const data = await response.json();
                return data
            }
        } else {
            console.log(await response.json())
        }
    } catch (error) {
        throw error;
    }
};

export const updateProductOnCheck = async (product, bought) => {
    const currentTime = new Date().toISOString();
    try {
		const groupId = await getGroupId()
		const access_token = await getAccessToken()
		const fetchData = async (token = access_token) => {
                return await fetch(`http://10.0.2.2:8000/api/group/groups/${groupId}/products/${product.id}/`, {
                method: 'PATCH',
                headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date_buyed: bought ? currentTime : null })
		})}
        const response = await fetchData()
        if (response.status === 200) {
            const data = await response.json();
            return data
        } else if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                const response = await fetchData(access)
                const data = await response.json();
                return data
            }
        } else {
            console.log(await response.json())
        }
    } catch (error) {
        throw error
    }
};
