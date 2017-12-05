import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { initializeCurrentLocation } from 'redux-little-router'
import App from './App'
import WebFontLoader from 'webfontloader'
import {AUTHENTICATED, UNAUTHENTICATED} from './actions/auth'
import { checkUserAuthenticated, getToken } from './utils/session_storage'
import { updateAuthRequestToken } from './utils/http_request'
import configureStore from './store.js'
import register from './registerServiceWorker'

import './index.css'

WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
    },
})

const store = configureStore()

const initialLocation = store.getState().router;
if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation));
}

store.dispatch({ type: checkUserAuthenticated() ? AUTHENTICATED : UNAUTHENTICATED })
if (checkUserAuthenticated()) {
    updateAuthRequestToken(getToken())
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

register()