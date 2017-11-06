import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { NavigationDrawer } from 'react-md'
import NavLink from './NavLink'
import AccountMenu from './AccountMenu'
import Home from './Home'
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

class App extends Component {
    render() {
        return (
            <Route
                render={({ location }) => (
                    <NavigationDrawer
                        drawerTitle="Beego Material"
                        toolbarTitle="Beego Material"
                        mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
                        tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
                        desktopDrawerType={NavigationDrawer.DrawerTypes.FULL_HEIGHT}
                        navItems={navItems.map(props => <NavLink {...props} key={props.to} />)}
                        toolbarActions={<AccountMenu />}
                    >
                        <Switch key={location.key}>
                            <Route exact path="/" location={location} component={Home} />
                            <Route path="/page-1" location={location} component={Page1} />
                            <Route path="/page-2" location={location} component={Page1} />
                            <Route path="/page-3" location={location} component={Page1} />
                        </Switch>
                    </NavigationDrawer>
                )}
            />
        )
    }
}

export default App