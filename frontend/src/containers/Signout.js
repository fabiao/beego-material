import React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import {signOutAction} from "../actions/auth"

class Signout extends React.Component {
    componentWillMount() {
        signOutAction(this.props.dispatch)
    }

    render() {
        return (<Redirect to="/" />)
    }
}

export default connect()(Signout)