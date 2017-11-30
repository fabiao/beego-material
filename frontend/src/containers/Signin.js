import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'redux-little-router'
import { Card, CardTitle } from 'react-md'
import SigninForm from '../components/SigninForm'
import { signInAction } from '../actions/auth'
import { NoAuth } from '../components/Authentication'

class Signin extends NoAuth {
    submit = (values) => {
        this.props.signInAction(values)
    }

    errorMessage() {
        if (this.props.errorMessage) {
            return (
                <div className="info-red">
                    {this.props.errorMessage}
                </div>
            )
        }
    }

    render() {
        return (
            <Card className="md-block-centered">
                <CardTitle title="Login" subtitle={<span>Don't have an account? <Link href="/signup">Sign Up</Link></span>} />
                <SigninForm onSubmit={values => this.submit(values)}/>
            </Card>
        )
    }
}

export default connect(null, {signInAction})(Signin)