import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { Button, CardActions, FontIcon } from 'react-md'
import { renderMdTextField } from '../utils/md_form_input_renderers'

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
            required
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
        />
        <CardActions className="md-cell md-cell--12" style={{padding: 0}}>
            <Button type="submit" raised primary className="md-cell--right">Sign In</Button>
        </CardActions>
    </form>
)
export default reduxForm({ form: 'SigninForm' })(SigninForm)
