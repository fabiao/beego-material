import { reducer as formReducer } from 'redux-form'
import { reducer as notifReducer } from 'redux-notifications'
import routeReducer from './route'
import userReducer from './user'
import orgReducer from './org'

export default {
    notifs: notifReducer,
    form: formReducer,
    route: routeReducer,
    user: userReducer,
    org: orgReducer
}