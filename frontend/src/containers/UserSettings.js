import React from 'react'
import { connect } from 'react-redux'
import { Card, CardTitle } from 'react-md'
import UserSettingsForm from '../components/UserSettingsForm'
import { loadUserAction, updateUserAction } from '../actions/user'
import { Auth } from '../components/Authentication'


class UserSettings extends Auth {
    componentDidMount() {
        this.props.loadUserAction()
    }

    submit = (values) => {
        this.props.updateUserAction(values)
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
                <UserSettingsForm initialValues={user} onSubmit={values => this.submit(values)}/>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    return { user: state.user.currentUser }
}

export default connect(mapStateToProps, {loadUserAction, updateUserAction})(UserSettings)

