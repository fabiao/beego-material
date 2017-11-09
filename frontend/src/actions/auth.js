//import axios from 'axios'
import { FetchCode, post } from '../utils/http_request'

export const AUTHENTICATED = 'authenticated_user'
export const UNAUTHENTICATED = 'unauthenticated_user'
export const AUTHENTICATION_ERROR = 'authentication_error'

export const signInAction = ({ email, password }, history) => {
    return async (dispatch) => {
        post('/signin', { email, password })
        .then(state => {
            switch(state.name) {
                case FetchCode.SUCCESS: {
                    dispatch({ type: AUTHENTICATED })
                    localStorage.setItem('user', state.data.user)
                    history.push('/')
                    break
                }
                case FetchCode.AUTH_FAILED: {
                    dispatch({
                        type: AUTHENTICATION_ERROR,
                        payload: state.message
                    })
                    break
                }
                default: {
                    alert(JSON.stringify(state))
                    break
                }
            }

        })
    }
}

export const signOutAction = () => {
    localStorage.clear()
    return {
        type: UNAUTHENTICATED
    }
}