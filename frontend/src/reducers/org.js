import { ORGS_LOADED } from '../actions/org'

const initialState = {
    orgs: [], pagination: {
        first: null,
        last: null,
        previous: "",
        next: "",
        totalRecords: 1,
        limit: 0,
        pages: 1,
        currentPage: 0
    }
}

export default function(state = initialState, action) {
    switch (action.type) {
        case ORGS_LOADED: {
            return {...state, orgs: action.orgs, pagination: action.pagination}
        }

        default:
            break
    }
    return state
}