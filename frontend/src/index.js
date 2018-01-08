import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { initializeCurrentLocation } from 'redux-little-router'
import App from './App'
import WebFontLoader from 'webfontloader'
import { checkUserAuthenticated, getToken, getUser } from './utils/session_storage'
import { updateAuthRequestToken } from './utils/http_request'
import configureStore from './store.js'
import register from './registerServiceWorker'

import './index.css'
import { CURRENT_USER_LOADED } from './actions/user';

WebFontLoader.load({
    google: {
        families: ['Roboto:300,400,500,700', 'Material Icons'],
    },
})

const store = configureStore()
const storeState = store.getState()
const initialLocation = storeState ? storeState.router : null
if (initialLocation) {
    store.dispatch(initializeCurrentLocation(initialLocation))
}

if (checkUserAuthenticated()) {
    updateAuthRequestToken(getToken())
    if (!store.getState().user.currentUser) {
        store.dispatch({ type: CURRENT_USER_LOADED, currentUser: getUser() })
    }
} else {
    store.dispatch({ type: CURRENT_USER_LOADED, currentUser: null })
}

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

register()