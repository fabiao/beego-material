import React from 'react'
import {connect} from 'react-redux'
import { NavigationDrawer } from 'react-md'
import NavLink from '../components/NavLink'
import AccountMenu from '../components/AccountMenu'
import { Notifs } from 'redux-notifications'
import {loadRouteBindingsAction} from '../actions/route'
import 'redux-notifications/lib/styles.css'

class UserNavigationDrawer extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            navItems: [{
                label: 'Home',
                to: '/',
                icon: 'home'
            }]
        }
    }

    componentDidMount() {
        if (this.props.routeBindings.length === 0) {
            this.props.loadRouteBindingsAction()
        }
    }

    routeBindingsToNavItems = (routeBindings) => {
        if (routeBindings.length > 0) {
            //alert('A')
            for (let i in routeBindings) {
                const rb = routeBindings[i]
                for (let j in rb.keys) {
                    const key = rb.keys[j]
                    const regexp = new RegExp(key)
                    if (regexp.test(this.props.router.route)) {
                        return rb.values
                    }
                }
            }
        }

        return []
    }

    componentWillReceiveProps(nextProps) {
        //alert(JSON.stringify(nextProps.routeBindings, null, 4))
        if (this.props.router !== nextProps.router) {
            const checkedRoutes = this.routeBindingsToNavItems(nextProps.routeBindings)
            this.setState({ navItems: checkedRoutes })
        }
    }

    render() {
        const { navItems } = this.state
        return (
            <NavigationDrawer
                defaultVisible={true}
                drawerTitle="Beego Material"
                mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
                tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
                desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT}
                navItems={navItems.map(props => <NavLink {...props} key={props.to} />)}
                toolbarActions={<AccountMenu />}
            >
                {this.props.children}
                <pre>{JSON.stringify(this.props.debugState, null, 4)}</pre>
                <Notifs />
            </NavigationDrawer>
        )
    }
}

const mapStateToProps = (state) => {
    return { router: state.router, routeBindings: state.route.routeBindings, debugState: state.form }
}

export default connect(mapStateToProps, {loadRouteBindingsAction})(UserNavigationDrawer)