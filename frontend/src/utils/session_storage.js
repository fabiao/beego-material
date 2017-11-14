export const getUser = () => {
    const userString = localStorage.getItem('user')
    return userString != null ? JSON.parse(userString) : null
}

export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user))
}

export const getToken = () => {
    return localStorage.getItem('token')
}

export const setToken = (token) => {
    localStorage.setItem('token', token)
}

export const setUserAndToken = (user, token) => {
    setUser(user)
    setToken(token)
}

export const checkUserAuthenticated = () => {
    return getUser() != null && getToken() != null
}
