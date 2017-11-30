import React from 'react'
import {connect} from 'react-redux'
import { Fragment } from 'redux-little-router'
import UserNavigationDrawer from './components/UserNavigationDrawer'
import Home from './containers/Home'
import Signin from './containers/Signin'
import Signup from './containers/Signup'
import Signout from './containers/Signout'
import UserSettings from './containers/UserSettings'

let NoMatch = ({ router }) => (
    <div>
        <h1>404 No match for route <code>{router.pathname}</code></h1>
    </div>
)

const mapStateToProps = (state) => {
    return { router: state.router }
}

NoMatch = connect(mapStateToProps)(NoMatch)

class App extends React.Component {
    routeBindingsToNavItems = (routeBindings) => {
        if (routeBindings.length > 0) {
            for (let i in routeBindings) {
                const rb = routeBindings[i]
                for (let j in rb.keys) {
                    const key = rb.keys[j]
                    const regexp = new RegExp(key)
                    if (regexp.test(this.props.match.url)) {
                        return rb.values
                    }
                }
            }
        }

        return []
    }

    componentWillReceiveProps(nextProps) {
        const navItems = this.routeBindingsToNavItems(nextProps.routeBindings)
        this.setState({ navItems: navItems })
    }

    render() {
        return (
            <Fragment forRoute='/'>
                <UserNavigationDrawer>
                    <Fragment forRoute='/'><Home/></Fragment>
                    <Fragment forRoute='/signup'><Signup/></Fragment>
                    <Fragment forRoute='/signin'><Signin/></Fragment>
                    <Fragment forRoute='/signout'><Signout/></Fragment>
                    <Fragment forRoute='/user-settings'><UserSettings/></Fragment>
                    <Fragment forNoMatch><NoMatch/></Fragment>
                </UserNavigationDrawer>
            </Fragment>
        )
    }
}

export default App