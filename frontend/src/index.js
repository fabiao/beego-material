import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import { createStore, applyMiddleware } from 'redux'
import reduxThunk from 'redux-thunk'
import { Notifs } from 'redux-notifications'
import rootReducer from './reducers'
import 'redux-notifications/lib/styles.css'
import './index.css'
import App from './containers/App'
import WebFontLoader from 'webfontloader'
import {AUTHENTICATED, UNAUTHENTICATED} from './actions/auth'
import { checkUserAuthenticated } from './utils/session_storage'

WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
    },
})

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore)
const store = createStoreWithMiddleware(rootReducer)
store.dispatch({ type: checkUserAuthenticated() ? AUTHENTICATED : UNAUTHENTICATED })

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