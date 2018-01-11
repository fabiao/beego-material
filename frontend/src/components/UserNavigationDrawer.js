import React from 'react'
import {connect} from 'react-redux'
import { NavigationDrawer } from 'react-md'
import NavLink from '../components/NavLink'
import AccountMenu from '../components/AccountMenu'
import { Notifs } from 'redux-notifications'
import {loadCurrentNavItemsAction} from '../actions/route'
import 'redux-notifications/lib/styles.css'

class UserNavigationDrawer extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            navLinks: []
        }
    }

    componentDidMount() {
        if (this.props.authenticated) {
            this.props.loadCurrentNavItemsAction(this.props.router.route, this.props.router.pathname)
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.authenticated && this.props.router.pathname !== nextProps.router.pathname) {
            this.props.loadCurrentNavItemsAction(nextProps.router.route, nextProps.router.pathname)
        }
        if (this.props.currentNavItems !== nextProps.currentNavItems) {
            this.setState({
                navLinks: this.toNavLinks(nextProps.currentNavItems)
            })
        }
    }

    toNavLinks = navItems => {
        const navLinks = []
        navItems.forEach(props => {
            navLinks.push(<NavLink {...props} key={props.to} />)
            if (props.isBackward) {
                navLinks.push({divider: true})
            }
        })
        return navLinks
    }

    render() {
        const { children, debugState } = this.props
        const { navLinks } = this.state
        return (
            <NavigationDrawer
                defaultVisible={true}
                drawerTitle="Beego Material"
                mobileDrawerType={NavigationDrawer.DrawerTypes.TEMPORARY_MINI}
                tabletDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT_MINI}
                desktopDrawerType={NavigationDrawer.DrawerTypes.PERSISTENT}
                navItems={navLinks}
                toolbarActions={<AccountMenu />}
            >
                {children}
                <pre>{JSON.stringify(debugState, null, 4)}</pre>
                <Notifs />
            </NavigationDrawer>
        )
    }
}

const mapStateToProps = (state) => {
    return { authenticated: state.user.currentUser != null, router: state.router, currentNavItems: state.route.navItems, debugState: state.router }
}

export default connect(mapStateToProps, {loadCurrentNavItemsAction})(UserNavigationDrawer)