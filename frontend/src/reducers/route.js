import { ROUTE_BINDINGS_LOADED, CURRENT_NAV_ITEMS_LOADED } from '../actions/route'

const initialState = {
    routeBindings: [],
    navItems: [{
        label: 'Home',
        to: '/',
        icon: 'home'
    }]
}

export default function (state = initialState, action) {
    switch (action.type) {
        case ROUTE_BINDINGS_LOADED: {
            return { ...state, routeBindings: action.routeBindings }
        }

        case CURRENT_NAV_ITEMS_LOADED: {
            return { ...state, navItems: action.navItems }
        }

        default:
            break
    }
    return state
}