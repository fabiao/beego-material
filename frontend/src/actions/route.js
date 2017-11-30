import { FetchCode, get } from '../utils/http_request'
import { actions as notifActions } from 'redux-notifications'
import { signOutAction } from './auth'

const { notifSend } = notifActions

export const ROUTE_BINDINGS_LOADED = 'route_bindings_loaded'

export const loadRouteBindingsAction = () => {
    return async (dispatch) => {
        get('/routes')
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        dispatch({ type: ROUTE_BINDINGS_LOADED, routeBindings: state.data.routeBindings})
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