import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { Toolbar, Button } from 'react-md'
import { renderMdTextField } from '../utils/md_form_input_renderers'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

const validate = values => {
    const errors = { address: {} }
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
    } else if (values.email.length > 255) {
        errors.email = 'Must be 255 characters or less'
    }
    if (values.address != null) {
        if (values.address.street && values.address.street.length > 255) {
            errors.address.street = 'Must be 255 characters or less'
        }
        if (values.address.city && values.address.city.length > 255) {
            errors.address.city = 'Must be 255 characters or less'
        }
        if (values.address.zipCode && values.address.zipCode.length > 255) {
            errors.address.zipCode = 'Must be 255 characters or less'
        }
    }
    return errors
}

const EditUserForm = (props) => { 
    const { handleSubmit, dirty, invalid, pristine, reset, submitting, onHide } = props
    return (
        <CSSTransitionGroup
            id="edit-user-form"
            component="form"
            onSubmit={handleSubmit}
            className="md-text-container md-toolbar--relative"
            transitionName="md-cross-fade"
            transitionEnterTimeout={300}
            transitionLeave={false}
        >
            <Toolbar
                nav={<Button icon onClick={onHide}>arrow_back</Button>}
                title={"Edit user"}
                titleId="edit-user-dialog-title"
                fixed
                colored
                actions={[
                    <Button type="button" flat onClick={reset} disabled={submitting}>Reset</Button>,
                    <Button type="submit" flat disabled={invalid || pristine || submitting}>Submit</Button>
                ]}
            />
            <div className="md-grid md-text-container margin-top-56" onSubmit={handleSubmit}>
                <Field
                    id="firstName"
                    name="firstName"
                    type="text"
                    label="First name"
                    className="md-cell md-cell--4"
                    component={renderMdTextField}
                    required
                />
                <Field
                    id="lastName"
                    name="lastName"
                    type="text"
                    label="Last name"
                    className="md-cell md-cell--4"
                    component={renderMdTextField}
                    required
                />
                <Field
                    id="email"
                    name="email"
                    type="text"
                    label="Email"
                    className="md-cell md-cell--4"
                    component={renderMdTextField}
                    required
                />
                <Field
                    id="street"
                    name="address.street"
                    type="text"
                    label="Street"
                    className="md-cell md-cell--6"
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
                    className="md-cell md-cell--2"
                    component={renderMdTextField}
                />
            </div>
            <pre>pristine:{pristine ? 'true' : 'false'} submitting:{submitting ? 'true' : 'false'} dirty:{dirty ? 'true' : 'false'} invalid:{invalid ? 'true' : 'false'}</pre>
        </CSSTransitionGroup>
    )
}

export default reduxForm({ form: 'EditUserForm', validate })(EditUserForm)