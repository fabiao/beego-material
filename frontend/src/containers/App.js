import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { NavigationDrawer } from 'react-md'
import requireAuth from '../components/Authentication'
import noRequireAuth from '../components/NoRequireAuthentication'
import NavLink from '../components/NavLink'
import AccountMenu from '../components/AccountMenu'
import Home from './Home'
import Signin from './Signin'
import Signup from './Signup'
import Signout from './Signout'
import Page1 from './Page1'

const navItems = [{
    exact: true,
    label: 'Home',
    to: '/',
    icon: 'home',
}, {
    label: 'Page 1',
    to: '/page-1',
    icon: 'bookmark',
}, {
    label: 'Page 2',
    to: '/page-2',
    icon: 'donut_large',
}, {
    label: 'Page 3',
    to: '/page-3',
    icon: 'flight_land',
}]

const NoMatch = ({ location }) => (
    <div>
        <h1>404 No match for route <code>{location.pathname}</code></h1>
    </div>
)

class App extends Component {
    render() {
        return (
            <NavigationDrawer
                drawerTitle="Beego Material"
                toolbarTitle="Beego Material"
                mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
                tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
                desktopDrawerType={NavigationDrawer.DrawerTypes.FULL_HEIGHT}
                navItems={navItems.map(props => <NavLink {...props} key={props.to} />)}
                toolbarActions={<AccountMenu onClick={this.onClick}/>}
            >
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/signin" component={noRequireAuth(Signin)} />
                    <Route exact path="/signup" component={noRequireAuth(Signup)} />
                    <Route exact path="/signout" component={requireAuth(Signout)} />
                    <Route exact path="/page-1" component={requireAuth(Page1)} />
                    <Route component={NoMatch}/>
                </Switch>
            </NavigationDrawer>
        )
    }
}

export default App