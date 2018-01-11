import { FetchCode, get, getAuth } from '../utils/http_request'
import { push } from 'redux-little-router'
import { actions as notifActions } from 'redux-notifications'
import { signOutAction } from './user'

const { notifSend } = notifActions

export const ROUTE_BINDINGS_LOADED = 'route_bindings_loaded'
export const CURRENT_NAV_ITEMS_LOADED = 'current_nav_items'

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

export const loadCurrentNavItemsAction = (route, pathname) => {
    return async (dispatch) => {
        //alert('R:' + route + '\nP:' + pathname)
        getAuth('/users/nav-items', {route: encodeURIComponent(route), pathname: encodeURIComponent(pathname)})
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        dispatch({ type: CURRENT_NAV_ITEMS_LOADED, navItems: state.data.navItems})
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

export const redirectTo = (href) => dispatch => {
    dispatch(push(href))
}