import {setUserAndToken} from './session_storage'
import {removeAuthRequestToken, updateAuthRequestToken} from './http_request'

export const applySessionData = (user, token) => {
    setUserAndToken(user, token)
    updateAuthRequestToken(token)
}

export const resetSessionData = () => {
    setUserAndToken(null, null)
    removeAuthRequestToken()
}