import { FetchCode, putAuth } from '../utils/http_request'
import { actions as notifActions } from 'redux-notifications'
import { setUserAndToken } from '../utils/session_storage'

const { notifSend } = notifActions

export const USER_UPDATED = 'user_updated'
export const USER_UPDATE_ERROR = 'user_update_error'

export const updateUserAction = ({ firstName, lastName, email, password, confirmPassword, address }, history) => {
    return async (dispatch) => {
        putAuth('/update-user', { firstName, lastName, email, password, confirmPassword, address })
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        setUserAndToken(state.data.user, state.data.token)
                        dispatch({ type: USER_UPDATED })
                        history.push('/')
                        return
                    }
                    case FetchCode.AUTH_FAILED: {
                        dispatch({
                            type: USER_UPDATE_ERROR,
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