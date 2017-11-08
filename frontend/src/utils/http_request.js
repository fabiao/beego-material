/*import axios from 'axios'

const BASE_URL = 'http://localhost:8080/'

const publicRequest = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'}
})

const performRequest = (method, url, params) => {
    const body = method === 'get' ? 'params' : 'data'
    const config = {
        method,
        url,
        [body]: params || {}
    }

    return publicRequest.request(config)
}

const authRequest = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'}
})

const setAuthRequestToken = (token) => {
    authRequest.defaults.headers.common['Authorization'] = 'Bearer ' + token
}

const performAuthRequest = (method, url, params) => {
    const body = method === 'get' ? 'params' : 'data'
    const config = {
        method,
        url,
        [body]: params || {}
    }

    return authRequest.request(config)
}

// Public interface
export const get = (url, params) => {
    return performRequest('GET', url, params)
}

export const post = (url, data) => {
    return performRequest('POST', url, data)
}

export const put = (url, data) => {
    return performRequest('PUT', url, data)
}

export const del = (url, data) => {
    return performRequest('DELETE', url, data)
}

// Auth interface
export const getAuth = (url, params) => {
    return performAuthRequest('GET', url, params)
}

export const postAuth = (url, data) => {
    return performAuthRequest('POST', url, data)
}

export const putAuth = (url, data) => {
    return performAuthRequest('PUT', url, data)
}

export const delAuth = (url, data) => {
    return performAuthRequest('DELETE', url, data)
}*/