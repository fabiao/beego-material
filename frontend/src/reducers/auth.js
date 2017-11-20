import { AUTHENTICATED, UNAUTHENTICATED } from '../actions/auth'

const initialState = {
    authenticated: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case AUTHENTICATED:
            return { ...state, authenticated: true }
        case UNAUTHENTICATED:
            return { ...state, authenticated: false }
        default:
            break
    }
    return state
}