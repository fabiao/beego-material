import { combineReducers } from 'redux'
import { reducer as formReducer } from 'redux-form'
import { reducer as notifReducer } from 'redux-notifications'
import authReducer from './auth'

const rootReducer = combineReducers({
    notifs: notifReducer,
    form: formReducer,
    auth: authReducer
})

export default rootReducer