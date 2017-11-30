import { ROUTE_BINDINGS_LOADED } from '../actions/route'

const initialState = {
    routeBindings: []
}

export default function(state = initialState, action) {
    switch (action.type) {
        case ROUTE_BINDINGS_LOADED: {
            return {...state, routeBindings: action.routeBindings}
        }

        default:
            break
    }
    return state
}