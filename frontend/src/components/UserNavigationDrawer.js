import React from 'react'
import {connect} from 'react-redux'
import { NavigationDrawer } from 'react-md'
import NavLink from '../components/NavLink'
import AccountMenu from '../components/AccountMenu'
import { Notifs } from 'redux-notifications'
import {loadCurrentNavItemsAction} from '../actions/route'
import 'redux-notifications/lib/styles.css'

class UserNavigationDrawer extends React.PureComponent {
    componentDidMount() {
        if (this.props.authenticated) {
            this.props.loadCurrentNavItemsAction(this.props.router.route)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.router.route !== nextProps.router.route && nextProps.authenticated) {
            this.props.loadCurrentNavItemsAction(nextProps.router.route)
            //const checkedRoutes = this.routeBindingsToNavItems(nextProps.routeBindings, nextProps.router.route)
            //this.setState({ navItems: checkedRoutes })
        }
    }

    render() {
        const { currentNavItems } = this.props
        return (
            <NavigationDrawer
                defaultVisible={true}
                drawerTitle="Beego Material"
                mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
                tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
                desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT}
                navItems={currentNavItems.map(props => <NavLink {...props} key={props.to} />)}
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
    return { authenticated: state.user.currentUser != null, router: state.router, currentNavItems: state.route.navItems, debugState: state.router }
}

export default connect(mapStateToProps, {loadCurrentNavItemsAction})(UserNavigationDrawer)