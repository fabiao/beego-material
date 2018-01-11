import React from 'react'
import {connect} from 'react-redux'
import { Fragment } from 'redux-little-router'
import UserNavigationDrawer from './components/UserNavigationDrawer'
import Home from './containers/Home'
import Signin from './containers/Signin'
import Signup from './containers/Signup'
import Signout from './containers/Signout'
import UserSettings from './containers/UserSettings'
import Organizations from './containers/Organizations'
import OrgUsers from './containers/Organization/Users'
import OrgActivities from './containers/Organization/Activities'
import OrgReports from './containers/Organization/Reports'
import Users from './containers/Users'
import Activities from './containers/Activities'
import Reports from './containers/Reports'

let NoMatch = ({ router }) => (
    <div>
        <h1>404 No match for route <code>{router.pathname}</code></h1>
    </div>
)

const mapStateToProps = (state) => {
    return { router: state.router }
}

NoMatch = connect(mapStateToProps)(NoMatch)

export default class App extends React.PureComponent {
    render() {
        return (
            <Fragment forRoute='/'>
                <UserNavigationDrawer>
                    <Fragment forRoute='/'><Home/></Fragment>
                    <Fragment forRoute='/signup'><Signup/></Fragment>
                    <Fragment forRoute='/signin'><Signin/></Fragment>
                    <Fragment forRoute='/signout'><Signout/></Fragment>
                    <Fragment forRoute='/user-settings'><UserSettings/></Fragment>
                    <Fragment forRoute='/users'><Users/></Fragment>
                    <Fragment forRoute='/activities'><Activities/></Fragment>
                    <Fragment forRoute='/reports'><Reports/></Fragment>
                    <Fragment forRoute='/orgs'><Organizations/></Fragment>
                    <Fragment forRoute='/orgs/:orgId/users'><OrgUsers/></Fragment>
                    <Fragment forRoute='/orgs/:orgId/activities'><OrgActivities/></Fragment>
                    <Fragment forRoute='/orgs/:orgId/reports'><OrgReports/></Fragment>
                    <Fragment forNoMatch><NoMatch/></Fragment>
                </UserNavigationDrawer>
            </Fragment>
        )
    }
}