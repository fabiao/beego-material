import { USER_LOADED } from '../actions/user'

const initialState = {
    user: {
        firstName: 'Pippo'
    }
}

export default function(state = initialState, action) {
    switch (action.type) {
        case USER_LOADED: {
            return {...state, user: action.user}
        }

        default:
            break
    }
    return state
}