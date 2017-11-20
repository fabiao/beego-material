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

    componentWillReceiveProps(nextProps) {
        if (nextProps.user !== this.state.user) {
            this.setState({user: nextProps.user})
        }
    }

    renderPubMenu = () => {
        return (
            <Link className="md-fake-btn md-pointer--hover md-fake-btn--no-outline md-list-tile md-list-tile--icon md-text md-text--inherit" style={{margin: '12px 0'}} to="/signin">
                <div className="md-ink-container"></div>
                <div className="md-tile-addon md-tile-addon--icon">
                    <FontIcon>input</FontIcon>
                </div>
                <div className="md-tile-content" style={{paddingLeft: '8px', fontSize: '20px'}}>
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
                    <Avatar suffix="blue">{firstNameFirstChar}</Avatar>
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