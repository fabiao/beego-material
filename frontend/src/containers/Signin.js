import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Card, CardTitle } from 'react-md'
import SigninForm from '../components/SigninForm'
import { signInAction } from '../actions/auth'

class Signin extends React.PureComponent {
    submit = (values) => {
        this.props.signInAction(values, this.props.history)
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
        //const { values } = this.props
        return (
            <Card className="md-block-centered">
                <CardTitle title="Login" subtitle={<span>Don't have an account? <Link to="/signup">Sign Up</Link></span>} />
                <SigninForm onSubmit={values => this.submit(values)}/>
            </Card>
        )
    }
}

function mapStateToProps(state) {
    return { errorMessage: state.auth.error }
}

export default connect(mapStateToProps, {signInAction})(Signin)