import React from 'react'
import {
    Avatar,
    FontIcon,
    AccessibleFakeButton,
    IconSeparator,
    DropdownMenu
} from 'react-md'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import NavLink from './NavLink'

import './AccountMenu.css'

class AccountMenu extends React.Component {
    renderUnauthMenu = () => {
        return (
            <Link className="md-fake-btn md-pointer--hover md-fake-btn--no-outline md-list-tile md-list-tile--icon md-text md-text--inherit v-margin-12" to="/signin">
                <div className="md-ink-container"></div>
                <div className="md-tile-addon md-tile-addon--icon">
                    <FontIcon>input</FontIcon>
                </div>
                <div className="md-tile-content lpad8-font20">
                    Signin
                </div>
            </Link>
        )
    }

    renderAuthMenu = (user) => {
        const { simplifiedMenu } = this.props
        const firstNameFirstChar = user.firstName.length > 0 ? user.firstName[0].toUpperCase() : 'U'
        return (
            <DropdownMenu
                id={`${!simplifiedMenu ? 'smart-' : ''}avatar-dropdown-menu`}
                menuItems={
                    [<NavLink
                        key='/user-settings'
                        label='Settings'
                        to='/user-settings'
                        icon='account_box'
                    />,
                    {divider: true},
                    <NavLink
                        key='/signout'
                        label='Logout'
                        to='/signout'
                        icon='exit_to_app'
                    />]
                }
                anchor={{
                    x: DropdownMenu.HorizontalAnchors.INNER_RIGHT,
                    y: DropdownMenu.VerticalAnchors.BOTTOM
                }}
                position={DropdownMenu.Positions.BELOW}
                animationPosition="below"
                sameWidth
                simplifiedMenu={simplifiedMenu}
                className="v-padding-12"
            >
                <AccessibleFakeButton
                    component={IconSeparator}
                    iconBefore
                    label={
                        <IconSeparator label={user.email}>
                            <FontIcon>arrow_drop_down</FontIcon>
                        </IconSeparator>
                    }
                >
                    <Avatar suffix="blue">{firstNameFirstChar}</Avatar>
                </AccessibleFakeButton>
            </DropdownMenu>
        )
    }

    render() {
        const {user} = this.props
        return user != null ? this.renderAuthMenu(user) : this.renderUnauthMenu()
    }
}


function mapStateToProps(state) {
    return  { user: state.user.currentUser }
}

export default connect(mapStateToProps)(AccountMenu)