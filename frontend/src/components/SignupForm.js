import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { Button, CardActions, FontIcon } from 'react-md'
import { renderMdTextField } from '../utils/md_form_input_renderers'

const validate = values => {
    const errors = { address: {}}
    if (!values.firstName) {
        errors.firstName = 'Required'
    } else if (values.firstName.length > 255) {
        errors.firstName = 'Must be 255 characters or less'
    }
    if (!values.lastName) {
        errors.lastName = 'Required'
    } else if (values.lastName.length > 255) {
        errors.lastName = 'Must be 255 characters or less'
    }
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
    if (!values.confirmPassword) {
        errors.confirmPassword = 'Required'
    } else if (values.confirmPassword.length < 8 || values.confirmPassword.length > 255) {
        errors.confirmPassword = 'Must be more then 8 characters and less then 255 characters'
    } else if (values.confirmPassword !== values.password) {
        errors.confirmPassword = 'Password don\'t match'
    }
    if (values.address != null) {
        if (values.address.street != null && values.address.street.length > 255) {
            errors.address.street = 'Must be 255 characters or less'
        }
        if (values.address.city != null && values.address.city.length > 255) {
            errors.address.city = 'Must be 255 characters or less'
        }
        if (values.address.zipCode != null && values.address.zipCode.length > 255) {
            errors.address.zipCode = 'Must be 255 characters or less'
        }
    }
    return errors
}

const SignupForm = ({ handleSubmit, initialValues, pristine, reset, submitting }) => (
    <form className="md-grid" onSubmit={handleSubmit}>
        <Field
            id="firstName"
            name="firstName"
            type="text"
            label="First name"
            className="md-cell md-cell--6"
            component={renderMdTextField}
            required
        />
        <Field
            id="lastName"
            name="lastName"
            type="text"
            label="Last name"
            className="md-cell md-cell--6"
            component={renderMdTextField}
            required
        />
        <Field
            id="email"
            name="email"
            type="email"
            label="Email"
            className="md-cell md-cell--4"
            component={renderMdTextField}
            leftIcon={<FontIcon>mail_outline</FontIcon>}
            required
        />
        <Field
            id="password"
            name="password"
            type="password"
            label="Password"
            className="md-cell md-cell--4"
            component={renderMdTextField}
            leftIcon={<FontIcon>lock</FontIcon>}
            required
        />
        <Field
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm password"
            className="md-cell md-cell--4"
            component={renderMdTextField}
            leftIcon={<FontIcon>lock</FontIcon>}
            required
        />
        <Field
            id="street"
            name="address.street"
            type="text"
            label="Street"
            className="md-cell md-cell--4"
            component={renderMdTextField}
        />
        <Field
            id="city"
            name="address.city"
            type="text"
            label="City"
            className="md-cell md-cell--4"
            component={renderMdTextField}
        />
        <Field
            id="zipCode"
            name="address.zipCode"
            type="text"
            label="Zip code"
            className="md-cell md-cell--4"
            component={renderMdTextField}
        />
        <CardActions className="md-cell md-cell--12" style={{padding: 0}}>
            <Button type="submit" raised primary disabled={submitting} className="md-cell--right">Sign Up</Button>
        </CardActions>
    </form>
)
export default reduxForm({ form: 'SignupForm', validate })(SignupForm)
