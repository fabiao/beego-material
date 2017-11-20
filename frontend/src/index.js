import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Notifs } from 'redux-notifications'
import rootReducer from './reducers'
import App from './containers/App'
import WebFontLoader from 'webfontloader'
import {AUTHENTICATED, UNAUTHENTICATED} from './actions/auth'
import { checkUserAuthenticated, getToken } from './utils/session_storage'
import { updateAuthRequestToken } from './utils/http_request'
import 'redux-notifications/lib/styles.css'
import './index.css'

WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
    },
})

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore)
const store = createStoreWithMiddleware(rootReducer)
store.dispatch({ type: checkUserAuthenticated() ? AUTHENTICATED : UNAUTHENTICATED })
if (checkUserAuthenticated()) {
    updateAuthRequestToken(getToken())
}

ReactDOM.render(
    <Provider store={store}>
        <div>
            <Router>
                <App />
            </Router>
            <Notifs />
        </div>
    </Provider>,
    document.getElementById('root')
)