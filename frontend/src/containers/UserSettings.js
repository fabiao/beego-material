import React from 'react'
import { connect } from 'react-redux'
import { Card, CardTitle } from 'react-md'
import UserSettingsForm from '../components/UserSettingsForm'
import { USER_UPDATE_ERROR, updateUserAction } from '../actions/user'
import {FetchCode, getAuth} from "../utils/http_request"
import { actions as notifActions } from 'redux-notifications'

const { notifSend } = notifActions

class UserSettings extends React.PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            user: null
        }
    }

    componentDidMount() {
        const { dispatch } = this.props
        getAuth('/user')
            .then(state => {
                switch(state.name) {
                    case FetchCode.SUCCESS: {
                        this.setState({
                            user: state.data.user
                        })
                        return
                    }
                    case FetchCode.AUTH_FAILED: {
                        dispatch({
                            type: USER_UPDATE_ERROR,
                            payload: state.message
                        })
                        break
                    }
                    default: {
                        break
                    }
                }
                dispatch(notifSend({
                    message: state.message,
                    kind: 'danger',
                    dismissAfter: 20000
                }))
            })
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
        const { user } = this.state
        return (
            <Card className="md-block-centered">
                <CardTitle title="Update" subtitle="Modify your info" />
                <UserSettingsForm initialValues={user} onSubmit={values => this.submit(values)}/>
            </Card>
        )
    }
}

export default connect(null, {updateUserAction})(UserSettings)

