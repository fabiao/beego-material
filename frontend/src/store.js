import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { routerForBrowser } from 'redux-little-router'
import rootReducers from './reducers'

const routes = {
    '/': {
        title: 'Home',
        '/orgs': {
            title: 'Organizations',
            '/:orgId': {
                title: 'Settings',
                '/users': {
                    title: 'Users',
                    '/:userId': {
                        title: 'User'
                    }
                },
                '/activities': {
                    title: 'Activities',
                    '/:activityId': {
                        title: 'Activity'
                    }
                },
                '/reports': {
                    title: 'Reports',
                    '/:reportId': {
                        title: 'Report'
                    }
                }
            }
        },
        '/users': {
            title: 'Users',
            '/:userId': {
                title: 'User'
            }
        },
        '/activities': {
            title: 'Activities',
            '/:activityId': {
                title: 'Activity'
            }
        },
        '/reports': {
            title: 'Reports',
            '/:reportId': {
                title: 'Report'
            }
        },
        '/signup': {title: 'Signup'},
        '/signin': {title: 'Signin'},
        '/signout': {title: 'Signout'},
        '/user-settings': {title: 'My settings'}
    }
}

const { reducer, middleware, enhancer } = routerForBrowser({
    routes, // The configured routes. Required.
    //basename: '/api' // The basename for all routes. Optional.
})

const composedMiddleware = [
    applyMiddleware(thunk, middleware)
]

export default function configureStore(initialState) {
    return createStore(
        combineReducers({ router: reducer, ...rootReducers}),
        initialState,
        compose(enhancer, ...composedMiddleware)
    )
}