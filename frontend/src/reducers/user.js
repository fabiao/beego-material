import { USER_LOADED, USER_UPDATED } from '../actions/user'

const initialState = {
    currentUser: null
}

export default function(state = initialState, action) {
    switch (action.type) {
        case USER_LOADED: {
            return {...state, currentUser: action.currentUser}
        }
        case USER_UPDATED: {
            return {...state, currentUser: action.currentUser}
        }

        default:
            break
    }
    return state
}