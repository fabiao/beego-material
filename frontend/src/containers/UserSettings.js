import React from 'react'
import { connect } from 'react-redux'
import { Card, CardTitle } from 'react-md'
import SignupForm from '../components/SignupForm'
import { loadUserAction, updateUserAction } from '../actions/user'


class UserSettings extends React.Component {
    componentDidMount() {
        this.props.loadUserAction()
    }

    submit = (values) => {
        this.props.updateUserAction(values, this.props.history)
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
        const { user } = this.props
        return (
            <Card className="md-block-centered">
                <CardTitle title="Update" subtitle="Modify your info" />
                <SignupForm initialValues={user} onSubmit={values => this.submit(values)}/>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return { user: state.user.currentUser }
}

export default connect(mapStateToProps, {loadUserAction, updateUserAction})(UserSettings)

