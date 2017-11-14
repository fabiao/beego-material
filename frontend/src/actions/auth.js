import { FetchCode, post } from '../utils/http_request'
import { actions as notifActions } from 'redux-notifications'
import { setUserAndToken } from '../utils/session_storage'

const { notifSend } = notifActions

export const AUTHENTICATED = 'authenticated_user'
export const UNAUTHENTICATED = 'unauthenticated_user'
export const AUTHENTICATION_ERROR = 'authentication_error'

export const signUpAction = ({ firstName, lastName, email, password, confirmPassword, address }, history) => {
    return async (dispatch) => {
        post('/signup', { firstName, lastName, email, password, confirmPassword, address })
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        setUserAndToken(state.data.user, state.data.token)
                        dispatch({ type: AUTHENTICATED })
                        history.push('/')
                        return
                    }
                    case FetchCode.AUTH_FAILED: {
                        dispatch({
                            type: AUTHENTICATION_ERROR,
                            payload: state.message
                        })
                        break
                    }
                    default: {
                        break
                    }
                }
                dispatch(notifSend({
                    message: state.message,
                    kind: 'danger',
                    dismissAfter: 20000
                }))
            })
    }
}

export const signInAction = ({ email, password }, history) => {
    return async (dispatch) => {
        post('/signin', { email, password })
        .then(state => {
            alert(JSON.stringify(state))
            switch(state.name) {
                case FetchCode.SUCCESS: {
                    setUserAndToken(state.data.user, state.data.token)
                    dispatch({ type: AUTHENTICATED })
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
                    dispatch(notifSend({
                        message: state.message,
                        kind: 'danger',
                        dismissAfter: 20000
                    }))
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