import { AUTHENTICATED, UNAUTHENTICATED, AUTHENTICATION_FAILED } from '../actions/auth'

const initialState = {
    authenticated: false, error: null
}

export default function(state = initialState, action) {
    switch(action.type) {
        case AUTHENTICATED:
            return { ...state, authenticated: true }
        case UNAUTHENTICATED:
            return { ...state, authenticated: false }
        case AUTHENTICATION_FAILED:
            return { ...state, error: action.message }
        default:
            break
    }
    return state
}