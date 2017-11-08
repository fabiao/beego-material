import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Card, CardTitle, CardText, CardActions, TextField, Button, FontIcon } from 'react-md'
import { reduxForm } from 'redux-form'
import { signInAction } from '../actions/auth'

class Signin extends Component {
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
        const { handleSubmit } = this.props
        return (
            <Card className="md-block-centered">
                <CardTitle title="Login" subtitle="Please enter your email and password" />
                <form className="md-grid" onSubmit={handleSubmit(this.submit)}>
                    <TextField name="email"
                           type="text"
                           placeholder="Email"
                           className="md-cell md-cell--12"
                    />
                    <TextField name="password"
                           type="password"
                           placeholder="Password"
                           className="md-cell md-cell--12"
                    />
                    <CardActions className="md-cell md-cell--12">
                        <Button raised primary type="submit" className="md-cell--right">Sign In</Button>
                    </CardActions>
                </form>
                {this.errorMessage()}
            </Card>
        )
    }
}

function mapStateToProps(state) {
    return { errorMessage: state.auth.error }
}


const reduxFormSignin = reduxForm({
    form: 'signin'
})(Signin)

export default connect(mapStateToProps, {signInAction})(reduxFormSignin)