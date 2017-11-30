import { reducer as formReducer } from 'redux-form'
import { reducer as notifReducer } from 'redux-notifications'
import authReducer from './auth'
import routeReducer from './route'
import userReducer from './user'

export default {
    notifs: notifReducer,
    form: formReducer,
    auth: authReducer,
    route: routeReducer,
    user: userReducer
}