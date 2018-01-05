import { ORGS_LOADED, ORG_LOADED, ORG_UPDATED } from '../actions/org'

const initialState = {
    currentOrg: null,
    orgs: [],
    pagination: {
        first: null,
        last: null,
        previous: "",
        next: "",
        totalRecords: 0,
        limit: 10,
        pages: 0,
        currentPage: 0
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ORGS_LOADED: {
            return { ...state, orgs: action.orgs, pagination: action.pagination }
        }
        case ORG_LOADED: {
            return { ...state, currentOrg: action.org }
        }
        case ORG_UPDATED: {
            const orgs = state.orgs
            const org = orgs.find(r => r.id === action.org.id)
            if (org == null) {
                orgs.push(action.org)
            } else {
                org.name = action.org.name
                org.address = action.org.address
            }
            return { ...state, orgs: orgs, currentOrg: null }
        }

        default:
            break
    }
    return state
}