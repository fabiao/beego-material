import { FetchCode, getAuth, postAuth, putAuth } from '../utils/http_request'
import { actions as notifActions } from 'redux-notifications'
import { signOutAction } from '../actions/auth'

const { notifSend } = notifActions

export const ORGS_LOADED = 'orgs_loaded'
export const ORG_LOADED = 'org_loaded'
export const ORG_UPDATED = 'org_updated'

export const loadOrgsAction = (skip, limit) => {
    return async (dispatch) => {
        //alert('/orgs?skip=' + skip + '&limit=' + limit)
        getAuth('/orgs?skip=' + skip + '&limit=' + limit)
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        dispatch({ type: ORGS_LOADED, orgs: state.data.orgs, pagination: state.data.pagination })
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

export const loadOrgAction = (orgId) => {
    return async (dispatch) => {
        getAuth('/orgs/' + orgId)
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        dispatch({ type: ORG_LOADED, org: state.data.org})
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

export const editOrgAction = (org) => {
    return async (dispatch) => {
        dispatch({ type: ORG_LOADED, org: org})
    }
}

export const updateOrgAction = (org) => {
    return async (dispatch) => {
        const method = (org.id != null) ? putAuth : postAuth
        method('/orgs/', org)
        .then(state => {
            switch(state.name) {
                case FetchCode.SUCCESS: {
                    dispatch({ type: ORG_UPDATED, org: state.data.org})
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