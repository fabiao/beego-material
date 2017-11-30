import { FetchCode, getAuth, putAuth } from '../utils/http_request'
import { actions as notifActions } from 'redux-notifications'
import { setUserAndToken } from '../utils/session_storage'
import { signOutAction } from '../actions/auth'

const { notifSend } = notifActions

export const USER_LOADED = 'user_loaded'
export const USER_UPDATED = 'user_updated'

export const loadUserAction = () => {
    return async (dispatch) => {
        getAuth('/user')
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        dispatch({ type: USER_LOADED, currentUser: state.data.user})
                        return
                    }
                    case FetchCode.AUTH_FAILED: {
                        dispatch(notifSend({
                            message: state.message,
                            kind: 'warning',
                            dismissAfter: 20000
                        }))
                        dispatch(signOutAction())
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

export const updateUserAction = ({ firstName, lastName, email, password, confirmPassword, address }) => {
    return async (dispatch) => {
        putAuth('/user', { firstName, lastName, email, password, confirmPassword, address })
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        setUserAndToken(state.data.user, state.data.token)
                        dispatch({ type: USER_UPDATED, currentUser: state.data.user})
                        dispatch(notifSend({
                            message: 'User update completed',
                            kind: 'success',
                            dismissAfter: 20000
                        }))
                        return
                    }
                    case FetchCode.AUTH_FAILED: {
                        dispatch(notifSend({
                            message: state.message,
                            kind: 'warning',
                            dismissAfter: 20000
                        }))
                        dispatch(signOutAction())
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