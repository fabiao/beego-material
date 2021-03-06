import React from 'react'
import { connect } from 'react-redux'
import { signOutAction } from '../actions/user'

class Signout extends React.PureComponent {
    componentWillMount() {
        this.props.signOutAction()
    }

    render() {
        return null
    }
}

export default connect(null, {signOutAction})(Signout)