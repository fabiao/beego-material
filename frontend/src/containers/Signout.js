import React from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import {signOutAction} from "../actions/auth"

class Signout extends React.Component {
    static propTypes = {
        dispatch: PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.dispatch(signOutAction())
    }

    render() {
        return (<Redirect to="/" />)
    }
}

export default connect()(Signout)