import { jwtDecode } from 'jwt-decode';

import fetchRefreshToken from './fetchRefreshToken';
import { getAccessToken } from './getAsyncStorage';

const DEBUG = process.env.EXPO_PUBLIC_DEBUG === 'true'
let API_URL
if (DEBUG) {
    API_URL = process.env.EXPO_PUBLIC_DEV_API_URL
} else {
    API_URL = process.env.EXPO_PUBLIC_PROD_API_URL
}

export const fetchUser = async () => {
    const data = baseFetch('core/users/userId/', 'GET')
    return data
};

export const fetchPatchUserGroupCode = async (groupCode) => {
    try {
        const fetchData = async () => {
            const accessToken = await getAccessToken();
            const options = {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({group_id: groupCode})
            };
            const userId = jwtDecode(accessToken).user_id
            return await fetch(`${API_URL}core/users/${userId}/`, options);
        };
        for (let i = 0; i < 2; i++) {
            const response = await fetchData()
            if (response.status === 400 || response.status === 403 || response.status === 200) {
                return response
            } else if (response.status === 401) {
                const access = await fetchRefreshToken()
                if (!access || i === 1) {
                    logOut()
                    return null
                }
            } else {
                logOut()
                return null
            }
        }
    } catch (error) {
        console.error("Fetch error:", error);
        logOut()
        return null
    }
};

export const fetchPatchUser = async (values) => {
    try {
        const fetchData = async () => {
            const accessToken = await getAccessToken();
            const options = {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({username: values.username, name: values.name, email: values.email})
            };
            const userId = jwtDecode(accessToken).user_id
            return await fetch(API_URL + `core/users/${userId}/`, options);
        };
        for (let i = 0; i < 2; i++) {
            const response = await fetchData()
            const data = await response.json()
            if (response.status === 200 || response.status === 400) {
                return [response, data];
            } else if (response.status === 401) {
                const access = await fetchRefreshToken()
                if (!access || i === 1) {
                    logOut()
                    return [response, null]
                }
            } else {
                logOut()
                return [response, null]
            }
        }
          
    } catch (error) {
        console.error("Fetch error:", error);
        logOut()
        return null
    }
};


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
        console.error("Fetch error:", error);
        logOut()
        return null
    }
};
export const fetchVerifyEmail = async (email, code) => {
    try {
        const accessToken = await getAccessToken();
        const fetchData = async () => {
            return await fetch(`${API_URL}core/verify-email/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    verification_code: code
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
        console.error("Fetch error:", error);
        logOut()
        return null
    }
};

export const fetchResendVerificationEmail = async (email) => {
    try {
        const accessToken = await getAccessToken();
        const fetchData = async () => {
            return await fetch(`${API_URL}core/resend-verification-email/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email
                })
        })}
        const response = await fetchData()
        if (response.status === 200) {
            return null
        } else if (response.status === 429) {
            return await response.json();
        } else if (response.status === 400) {
            return await response.json();
        } else {
            return {'error': 'Something went wrong.'}
        }
    } catch (error) {
        console.error("Fetch error:", error);
        logOut()
        return null
    }
};
export const fetchSendFeedback = async (email, message) => {
    try {
        const accessToken = await getAccessToken();
        const fetchData = async () => {
            return await fetch(`${API_URL}core/feedback/`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    message: message
                })
        })}
        const response = await fetchData()
        if (response.status === 200) {
            return null
        } else if (response.status === 429) {
            return await response.json();
        } else if (response.status === 400) {
            return await response.json();
        } else {
            console.error("Fetch error:", response.status);
            return {'error': 'Something went wrong.'}
        }
    } catch (error) {
        console.error("Fetch error:", error);
        logOut()
        return null
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
        console.error("Fetch error:", error);
        logOut()
        return null
    }
};

