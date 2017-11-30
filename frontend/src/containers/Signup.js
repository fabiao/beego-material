import React from 'react'
import { connect } from 'react-redux'
import { Card, CardTitle } from 'react-md'
import SignupForm from '../components/SignupForm'
import { signUpAction } from '../actions/auth'
import { NoAuth } from '../components/Authentication'

class Signup extends NoAuth {
    submit = (values) => {
        this.props.signUpAction(values)
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
                <CardTitle title="Sign Up" subtitle="Please enter your anagraphycs info" />
                <SignupForm onSubmit={values => this.submit(values)}/>
            </Card>
        )
    }
}

export default connect(null, {signUpAction})(Signup)

