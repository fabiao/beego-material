import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { Button, CardActions, FontIcon } from 'react-md'
import { renderMdTextField } from '../utils/md_form_input_renderers'

const SignupForm = ({ handleSubmit, initialValues }) => (
    <form className="md-grid" onSubmit={handleSubmit}>
        <Field
            id="firstName"
            name="firstName"
            type="text"
            placeholder="First name"
            className="md-cell md-cell--6"
            component={renderMdTextField}
            required
            maxlen={255}
        />
        <Field
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Last name"
            className="md-cell md-cell--6"
            component={renderMdTextField}
            required
            maxlen={255}
        />
        <Field
            id="email"
            name="email"
            type="text"
            placeholder="Email"
            className="md-cell md-cell--4"
            component={renderMdTextField}
            leftIcon={<FontIcon>mail_outline</FontIcon>}
            required
            minlen={5}
            maxlen={255}
        />
        <Field
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            className="md-cell md-cell--4"
            component={renderMdTextField}
            leftIcon={<FontIcon>lock</FontIcon>}
            required
            minlen={8}
            maxlen={255}
        />
        <Field
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            className="md-cell md-cell--4"
            component={renderMdTextField}
            leftIcon={<FontIcon>lock</FontIcon>}
            required
            minlen={8}
            maxlen={255}
        />
        <Field
            id="street"
            name="address.street"
            type="text"
            placeholder="Street"
            className="md-cell md-cell--4"
            component={renderMdTextField}
            maxlen={255}
        />
        <Field
            id="city"
            name="address.city"
            type="text"
            placeholder="City"
            className="md-cell md-cell--4"
            component={renderMdTextField}
            maxlen={255}
        />
        <Field
            id="zipCode"
            name="address.zipCode"
            type="text"
            placeholder="Zip code"
            className="md-cell md-cell--4"
            component={renderMdTextField}
            maxlen={255}
        />
        <CardActions className="md-cell md-cell--12" style={{padding: 0}}>
            <Button type="submit" raised primary className="md-cell--right">Sign Up</Button>
        </CardActions>
            <pre>{JSON.stringify(initialValues)}</pre>
    </form>
)
export default reduxForm({ form: 'SignupForm' })(SignupForm)
