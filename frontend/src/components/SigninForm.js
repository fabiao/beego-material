import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { Link } from 'redux-little-router'
import { Button, CardActions, FontIcon } from 'react-md'
import { renderMdTextField } from '../utils/md_form_input_renderers'

const validate = values => {
    const errors = {}
    if (!values.email) {
        errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    } else if (values.email.length < 5 || values.email.length > 255) {
        errors.email = 'Must be more then 5 characters and less then 255 characters'
    }
    if (!values.password) {
        errors.password = 'Required'
    } else if (values.password.length < 8 || values.password.length > 255) {
        errors.password = 'Must be more then 8 characters and less then 255 characters'
    }
    return errors
}

const SigninForm = ({ handleSubmit }) => (
    <form className="md-grid" onSubmit={handleSubmit}>
        <Field
            id="email"
            name="email"
            type="text"
            placeholder="Email"
            className="md-cell md-cell--12"
            component={renderMdTextField}
            leftIcon={<FontIcon>mail_outline</FontIcon>}
        />
        <Field
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="md-cell md-cell--12"
            component={renderMdTextField}
            leftIcon={<FontIcon>lock</FontIcon>}
        />
        <CardActions className="md-cell md-cell--12 no-padding">
            <Link className="md-btn md-btn--raised md-btn--text md-pointer--hover md-text md-inline-block md-cell--left" href="/recover-password">Forgot your password?</Link>
            <Button type="submit" raised primary className="md-cell--right">Sign In</Button>
        </CardActions>
    </form>
)
export default reduxForm({ form: 'SigninForm', validate })(SigninForm)
