import React from 'react'
import { connect } from 'react-redux'
import { push } from 'redux-little-router'
import PropTypes from 'prop-types'

class Authentication extends React.PureComponent {
    componentWillMount() {
        if (!this.props.authenticated) {
            this.props.dispatch(push('/signin'))
        }
    }

    componentWillUpdate(nextProps) {
        if (!nextProps.authenticated) {
            this.props.dispatch(push('/signin'))
        }
    }

    PropTypes = {
        router: PropTypes.object,
    }
}

const mapStateToProps = (state) => {
    return { authenticated: state.auth.authenticated }
}

export const Auth = connect(mapStateToProps)(Authentication)

class NoRequireAuthentication extends React.PureComponent {
    componentWillMount() {
        if (this.props.authenticated) {
            this.props.dispatch(push('/'))
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.authenticated) {
            this.props.dispatch(push('/'))
        }
    }

    PropTypes = {
        router: PropTypes.object,
    }
}

export const NoAuth = connect(mapStateToProps)(NoRequireAuthentication)