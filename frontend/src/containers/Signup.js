import React from 'react'
import { connect } from 'react-redux'
import { Card, CardTitle } from 'react-md'
import SignupForm from '../components/SignupForm'
import { signUpAction } from '../actions/auth'

class Signup extends React.PureComponent {
    submit = (values) => {
        this.props.signUpAction(values, this.props.history)
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

function mapStateToProps(state) {
    return { errorMessage: state.auth.error }
}

export default connect(mapStateToProps, {signUpAction})(Signup)

