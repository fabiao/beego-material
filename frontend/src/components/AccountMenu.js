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
import { getUser } from '../utils/session_storage'

class AccountMenu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: this.props.user
        }
    }

    /*componentWillReceiveProps(nextProps) {
        if (nextProps.record !== this.state.proximityProfile) {
            this.setState({proximityProfile: nextProps.record})
        }
    }*/

    renderPubMenu = () => {
        return (
            <Link to="/signin">
                <IconSeparator label="Signin">
                    <FontIcon>login</FontIcon>
                </IconSeparator>
            </Link>
        )
    }

    renderAuthMenu = (user) => {
        const { simplifiedMenu } = this.props
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
                        <NavLink
                            key='/about'
                            label='About'
                            to='/about'
                            icon='info'
                        />, {divider: true},
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
                style={{padding: '12px 0'}}
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
                    <Avatar suffix="blue">{user.firstName[0].toUpperCase()}</Avatar>
                </AccessibleFakeButton>
            </DropdownMenu>
        )
    }

    render() {
        const { user } = this.state
        return user != null ? this.renderAuthMenu(user) : this.renderPubMenu()
    }
}


function mapStateToProps(state) {
    return  { user: getUser() }
}

export default connect(mapStateToProps)(AccountMenu)