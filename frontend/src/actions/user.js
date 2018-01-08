import { FetchCode, getAuth, putAuth, post, removeAuthRequestToken } from '../utils/http_request'
import { actions as notifActions } from 'redux-notifications'
import { setUserAndToken } from '../utils/session_storage'
import { push } from 'redux-little-router'

const { notifSend } = notifActions

export const USERS_LOADED = 'users_loaded'
export const USER_LOADED = 'user_loaded'
export const USER_UPDATED = 'user_updated'
export const CURRENT_USER_LOADED = 'current_user_loaded'
export const CURRENT_USER_UPDATED = 'current_user_updated'

export const loadUsersAction = (skip, limit) => {
    return async (dispatch) => {
        getAuth('/users?skip=' + skip + '&limit=' + limit)
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        dispatch({ type: USERS_LOADED, users: state.data.users})
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

export const loadUserAction = (userId) => {
    return async (dispatch) => {
        getAuth('/users/' + userId)
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        dispatch({ type: USER_LOADED, selectedUser: state.data.user})
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

export const editUserAction = (user) => {
    return async (dispatch) => {
        dispatch({ type: USER_LOADED, selectedUser: user })
    }
}

export const updateUserAction = (user) => {
    return async (dispatch) => {
        putAuth('/users', user)
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        dispatch({ type: USER_UPDATED, selectedUser: state.data.user})
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

export const loadCurrentUserAction = () => {
    return async (dispatch) => {
        console.log('loadCurrentUserAction')
        getAuth('/users/current')
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        dispatch({ type: CURRENT_USER_LOADED, currentUser: state.data.user})
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

export const updateCurrentUserAction = ({ firstName, lastName, email, password, confirmPassword, address }) => {
    return async (dispatch) => {
        console.log('updateCurrentUserAction')
        putAuth('/users/current', { firstName, lastName, email, password, confirmPassword, address })
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        setUserAndToken(state.data.user, state.data.token)
                        dispatch({ type: CURRENT_USER_UPDATED, currentUser: state.data.user})
                        dispatch(notifSend({
                            message: 'Current user update completed',
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

export const signUpAction = ({ firstName, lastName, email, password, confirmPassword, address }) => {
    return (dispatch) => {
        post('/signup', { firstName, lastName, email, password, confirmPassword, address })
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        setUserAndToken(state.data.user, state.data.token)
                        dispatch({ type: CURRENT_USER_LOADED, currentUser: state.data.user })
                        dispatch(push('/'))
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

export const signInAction = ({ email, password }) => {
    return (dispatch) => {
        console.log('signInAction')
        post('/signin', { email, password })
        .then(state => {
            switch(state.name) {
                case FetchCode.SUCCESS: {
                    setUserAndToken(state.data.user, state.data.token)
                    dispatch({ type: CURRENT_USER_LOADED, currentUser: state.data.user })
                    dispatch(push('/'))
                    return
                }
                case FetchCode.AUTH_FAILED: {
                    dispatch(notifSend({
                        message: state.message,
                        kind: 'warning',
                        dismissAfter: 20000
                    }))
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
    return (dispatch) => {
        setUserAndToken(null, null)
        removeAuthRequestToken()
        dispatch({ type: CURRENT_USER_LOADED, currentUser: null })
        dispatch(notifSend({
            message: 'User signed out',
            kind: 'info',
            dismissAfter: 20000
        }))
        dispatch(push('/'))
    }
}