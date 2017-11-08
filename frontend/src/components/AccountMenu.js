import React from 'react'
import {
    Avatar,
    FontIcon,
    AccessibleFakeButton,
    IconSeparator,
    DropdownMenu
} from 'react-md'
import { connect } from 'react-redux'
import NavLink from './NavLink'

class AccountMenu extends React.Component {
    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.record !== this.state.proximityProfile) {
            this.setState({proximityProfile: nextProps.record})
        }
    }

    render() {
        const { simplifiedMenu } = this.props
        return (
            <DropdownMenu
                id={`${!simplifiedMenu ? 'smart-' : ''}avatar-dropdown-menu`}
                //menuItems={['Preferences', 'About', { divider: true }, 'Log out']}
                menuItems={
                    [<NavLink
                        label='Settings'
                        to='/account-settings'
                        icon='account_box'
                    />,
                    <NavLink
                        label='About'
                        to='/about'
                        icon='info'
                    />, {divider: true},
                    <NavLink
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
                        <IconSeparator label="some.email@example.com">
                            <FontIcon>arrow_drop_down</FontIcon>
                        </IconSeparator>
                    }
                >
                    <Avatar suffix="pink">S</Avatar>
                </AccessibleFakeButton>
            </DropdownMenu>
        )
    }
}


function mapStateToProps(state) {
    return {
        authenticated: state.auth.authenticated
    }
}

export default connect(mapStateToProps)(AccountMenu)