import { USERS_LOADED, USER_LOADED, USER_UPDATED, CURRENT_USER_LOADED, CURRENT_USER_UPDATED } from '../actions/user'

const initialState = {
    currentUser: null,
    selectedUser: null,
    users: [],
    pagination: {
        skip: 0,
        limit: 10,
        rows: 0
    }
}

export default function (state = initialState, action) {
    switch (action.type) {
        case USERS_LOADED: {
            return { ...state, users: action.users }
        }
        case USER_LOADED: {
            return { ...state, selectedUser: action.selectedUser }
        }
        case USER_UPDATED: {
            const users = state.users
            const user = users.find(r => r.id === action.selectedUser.id)
            if (user == null) {
                users.push(action.selectedUser)
            } else {
                user.firstName = action.selectedUser.firstName
                user.lastName = action.selectedUser.lastName
                user.email = action.selectedUser.email
                user.address = action.selectedUser.address
            }
            return { ...state, users: users, selectedUser: null }
        }
        case CURRENT_USER_LOADED: {
            console.trace("action.currentUser:" + JSON.stringify(action.currentUser))
            return { ...state, currentUser: action.currentUser }
        }
        case CURRENT_USER_UPDATED: {
            return { ...state, currentUser: action.currentUser }
        }

        default:
            break
    }
    return state
}