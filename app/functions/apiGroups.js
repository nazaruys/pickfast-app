import { jwtDecode } from 'jwt-decode';

import fetchRefreshToken from './fetchRefreshToken';
import { getAccessToken, getGroupId } from './getAsyncStorage';

API_URL = process.env.EXPO_PUBLIC_API_URL

// X
export const fetchMembersBlocked = async () => {
    try {
        const groupId = await getGroupId()
        const access_token = await getAccessToken()
        const fetchData = async (token = access_token) => {
            return await fetch(`${API_URL}group/groups/${groupId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
        })}
        const response = await fetchData()
        if (response.status === 200) {
            const data = await response.json();
            return data.users_blacklist
        } else if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                const response = await fetchData(access)
                const data = await response.json();
                return data.users_blacklist
            }
        } else {
            console.log(await response.json())
        }
    } catch (error) {
        throw(error)
    }
};
// X
export const fetchGroupId = async () => {
    const access_token = await getAccessToken()
    const decodedToken = jwtDecode(access_token);
    try {
        const fetchData = async (token = access_token) => {
            return await fetch(`${API_URL}core/users/${decodedToken.user_id}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
        })}
        const response = await fetchData()
        if (response.status === 200) {
            const data = await response.json();
            return data.group_id
        } else if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                const response = await fetchData(access)
                const data = await response.json();
                return data.group_id
            }
        } else {
            console.log(await response.json())
        }
    } catch (error) {
        throw(error)
    }
};
// X
export const fetchGroupPrivacy = async (setIsPrivate) => {
    const groupId = await getGroupId()
    const access_token = await getAccessToken()
    try {
        const fetchData = async (token = access_token) => {
            return await fetch(`${API_URL}group/groups/${groupId}/`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
        })}
        const response = await fetchData()
        if (response.status === 200) {
            const data = await response.json();
            setIsPrivate(data.private)
        } else if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                const response = await fetchData(access)
                const data = await response.json();
                setIsPrivate(data.private)
            }
        } else {
            console.log(await response.json())
        }
    } catch (error) {
        throw(error)
    }
};
// X
export const fetchChangeGroupPrivacy = async (isPrivate) => {
    try {
        const access_token = await getAccessToken()
        const groupId = await getGroupId()
        const fetchData = async (token = access_token) => {
            return await fetch(`${API_URL}group/groups/${groupId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    private: !isPrivate
                })
        })}
        const response = await fetchData()
        if (response.status === 200) {
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
        throw(error)
    }
};
// X
export const fetchLeaveGroup = async () => {
    try {
        const access_token = await getAccessToken()
        const fetchData = async (token = access_token) => {
            return await fetch(`${API_URL}core/users/${jwtDecode(token).user_id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    group_id: null
                })
        })}
        const response = await fetchData()
        if (response.status === 200) {
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
        throw(error)
    }
};
// X
export const fetchRemoveUser = async (user) => {
    try {
        const access_token = await getAccessToken()
        const fetchData = async (token = access_token) => {
            return await fetch(`${API_URL}core/users/${user.id}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    group_id: null
                })
        })}
        const response = await fetchData()
        if (response.status === 200) {
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
        throw(error)
    }
};
// X
export const fetchBlockUser = async (user, membersBlocked, setMembersBlocked) => {
    try {
        const access_token = await getAccessToken()
        const groupId = await getGroupId()
        const fetchData = async (token = access_token) => {
            return await fetch(`${API_URL}group/groups/${groupId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    users_blacklist: [user.id]
                })
        })}
        const response = await fetchData()
        if (response.status === 200) {
            setMembersBlocked([...membersBlocked, user])
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
        throw(error)
    }
};
// X
export const fetchUnBlockUser = async (user, membersBlocked, setMembersBlocked) => {
    try {
        const access_token = await getAccessToken()
        const groupId = await getGroupId()
        const newMembersBlocked = membersBlocked.filter(member => member.id !== user.id)
        const fetchData = async (token = access_token) => {
            return await fetch(`${API_URL}group/groups/${groupId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    users_blacklist: newMembersBlocked
                })
        })}
        const response = await fetchData()
        if (response.status === 200) {
            setMembersBlocked(newMembersBlocked)
            return 
        } else if (response.status === 401) {
            const access = await fetchRefreshToken()
            if (access) {
                await fetchData(access)
                setMembersBlocked(newMembersBlocked)
                return
            }
        } else {
            console.log(await response.json())
        }
    } catch (error) {
        throw(error)
    }
};
// X
export const fetchMakeUserAdmin = async (user) => {
    try {
        const access_token = await getAccessToken()
        const groupId = await getGroupId()
        const fetchData = async (token = access_token) => {
            return await fetch(`${API_URL}group/groups/${groupId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    admin: user.id
                })
        })}
        const response = await fetchData()
        if (response.status === 200) {
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
        throw(error)
    }
};
// X
export const fetchPostGroup = async () => {
    try {
        const access_token = await getAccessToken()
        const fetchData = async (token = access_token) => {
            return await fetch(`${API_URL}group/groups/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({})
        })}
        const response = await fetchData()
        if (response.status === 201) {
            const data = await response.json()
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
        throw(error)
    }
};