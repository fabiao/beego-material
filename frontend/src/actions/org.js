import { FetchCode, getAuth, postAuth, putAuth } from '../utils/http_request'
import { actions as notifActions } from 'redux-notifications'
import { signOutAction } from '../actions/user'

const { notifSend } = notifActions

export const ORGS_LOADED = 'orgs_loaded'
export const ORG_LOADED = 'org_loaded'
export const ORG_UPDATED = 'org_updated'

let createOrgs = () => {
    orgs = []
    for (let i = 1; i <= 100; ++i) {
        orgs.push({
            id: i.toString(),
            createdAt: "2017-12-19T16:23:43.647+01:00",
            updatedAt: "2017-12-20T14:31:07.596+01:00",
            name: "Org n " + i,
            address: {
                street: "Via di Qua",
                zipCode: "1" + i,
                city: "Oristano"
            }
        })
    }
    return orgs
}
let orgs = createOrgs()

export const loadOrgsAction = (skip, limit) => {
    return async (dispatch) => {
        /*
        const currentPage = skip + 1
        const startIndex = skip
        const endIndex = Math.min(startIndex + limit, orgs.length)
        const pagedRecords = orgs.slice(startIndex, endIndex)
        const numPages = orgs.length / limit
        let numLastPageRecords = orgs.length % limit
        if (numLastPageRecords === 0) {
            numLastPageRecords = limit
        }
        const pagination = {
            first: "/orgs?skip=0&limit=" + limit,
            last: "/orgs?skip=" + numPages + "&limit=" + numLastPageRecords,
            previous: "",
            next: "",
            limit: currentPage < numPages ? limit : numLastPageRecords,
            numRecords: orgs.length,
            currentPage: currentPage
        }
        if (currentPage > 1) {
            pagination.previous = "/orgs?skip=" + (currentPage - 1) + "&limit=" + limit
        }
        if (currentPage < numPages) {
            pagination.next = "/orgs?skip=" + (currentPage + 1) + "&limit=" + limit
        }
 
        dispatch({ type: ORGS_LOADED, orgs: pagedRecords, pagination: pagination})*/

        getAuth('/orgs?skip=' + skip + '&limit=' + limit)
            .then(state => {
                switch (state.name) {
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
                switch (state.name) {
                    case FetchCode.SUCCESS: {
                        dispatch({ type: ORG_LOADED, org: state.data.org })
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
        dispatch({ type: ORG_LOADED, org: org })
    }
}

export const updateOrgAction = (org) => {
    return async (dispatch) => {
        const method = (org.id != null) ? putAuth : postAuth
        method('/orgs/', org)
            .then(state => {
                switch (state.name) {
                    case FetchCode.SUCCESS: {
                        dispatch({ type: ORG_UPDATED, org: state.data.org })
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