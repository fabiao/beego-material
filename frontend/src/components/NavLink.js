import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'redux-little-router'
import { FontIcon, ListItem } from 'react-md'

const NavLink = ({ label, to, icon, router }) => {
    let leftIcon = null
    if (icon) {
        leftIcon = <FontIcon>{icon}</FontIcon>;
    }
    return (
        <ListItem
            component={Link}
            href={to}
            primaryText={label}
            active={to === router.route} // router.pathname
            leftIcon={leftIcon}
        />
    )
}

const mapStateToProps = state => ({ router: state.router })
export default connect(mapStateToProps)(NavLink)