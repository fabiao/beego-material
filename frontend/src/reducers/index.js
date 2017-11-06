import { combineReducers } from 'redux'
import { auth } from './auth'

// We combine the reducers here so that they
// can be left split apart above
function otherReducers(state = {
}, action) {
    return state
}

export default combineReducers({
    auth,
    otherReducers
})
