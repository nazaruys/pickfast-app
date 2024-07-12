import token from "../config/token";

const storesUrl = 'http://10.0.2.2:8000/api/group/groups/WLMYBR/stores/'

const fetchStores = async (setStores) => {
    try {
        const response = await fetch(storesUrl, {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`
        }});
        const data = await response.json();
        setStores(data);
        console.log('Stores:', data)
    } catch (error) {
        console.error('Error fetching stores:', error);
    }
} 

export default fetchStores;