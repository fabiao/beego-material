import { updateAuthRequestToken } from './http_request'

export const getUser = () => {
    const userString = localStorage.getItem('user')
    if (userString == null) {
        localStorage.removeItem('user')
        return null
    }

    return JSON.parse(userString)
}

export const setUser = (user) => {
    if (user != null) {
        localStorage.setItem('user', JSON.stringify(user))
    } else {
        localStorage.removeItem('user')
    }
}

export const getToken = () => {
    const token = localStorage.getItem('token')
    if (token == null) {
        localStorage.removeItem('token')
        return null
    }

    return token
}

export const setToken = (token) => {
    if (token != null) {
        localStorage.setItem('token', token)
        updateAuthRequestToken(token)
    } else {
        localStorage.removeItem('token')
    }
}

export const setUserAndToken = (user, token) => {
    setUser(user)
    setToken(token)
}

export const checkUserAuthenticated = () => {
    return getUser() != null && getToken() != null
}
