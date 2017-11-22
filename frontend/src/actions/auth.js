import { FetchCode, post } from '../utils/http_request'
import { actions as notifActions } from 'redux-notifications'
import { setUserAndToken } from '../utils/session_storage'

const { notifSend } = notifActions

export const AUTHENTICATED = 'authenticated_user'
export const UNAUTHENTICATED = 'unauthenticated_user'
export const AUTHENTICATION_FAILED = 'authentication_failed'

export const signUpAction = ({ firstName, lastName, email, password, confirmPassword, address }, history) => {
    return (dispatch) => {
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
                        dispatch({type: AUTHENTICATION_FAILED, message: state.message })
                        dispatch(notifSend({
                            message: state.message,
                            kind: 'warning',
                            dismissAfter: 20000
                        }))
                        signOutAction(dispatch)
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

export const signInAction = ({ email, password }, history) => {
    return (dispatch) => {
        post('/signin', { email, password })
        .then(state => {
            switch(state.name) {
                case FetchCode.SUCCESS: {
                    setUserAndToken(state.data.user, state.data.token)
                    dispatch({ type: AUTHENTICATED })
                    history.push('/')
                    return
                }
                case FetchCode.AUTH_FAILED: {
                    dispatch(notifSend({
                        message: state.message,
                        kind: 'warning',
                        dismissAfter: 20000
                    }))
                    signOutAction(dispatch)
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

export const signOutAction = (dispatch) => {
    setUserAndToken(null, null)
    dispatch({type: UNAUTHENTICATED})
    dispatch(notifSend({
        message: 'User signed out',
        kind: 'info',
        dismissAfter: 20000
    }))
}