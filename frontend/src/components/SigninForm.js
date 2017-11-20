import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { Button, CardActions, FontIcon } from 'react-md'
import { renderMdTextField } from '../utils/md_form_input_renderers'

const SigninForm = ({ handleSubmit, onCancel }) => (
    <form className="md-grid" onSubmit={handleSubmit}>
        <Field
            id="email"
            name="email"
            type="text"
            placeholder="Email"
            className="md-cell md-cell--12"
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
            className="md-cell md-cell--12"
            component={renderMdTextField}
            leftIcon={<FontIcon>lock</FontIcon>}
            required
            minlen={5}
            maxlen={255}
        />
        <CardActions className="md-cell md-cell--12 no-padding">
            <Button type="button" raised className="md-cell--left" onClick={e => onCancel()}>Forgot your password?</Button>
            <Button type="submit" raised primary className="md-cell--right">Sign In</Button>
        </CardActions>
    </form>
)
export default reduxForm({ form: 'SigninForm' })(SigninForm)
