import React from 'react'
import { reduxForm, Field } from 'redux-form'
import { Toolbar, Button } from 'react-md'
import { renderMdTextField } from '../utils/md_form_input_renderers'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'

const validate = values => {
    const errors = { address: {} }
    if (!values.name) {
        errors.name = 'Required'
    } else if (values.name.length > 255) {
        errors.name = 'Must be 255 characters or less'
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

const EditOrgForm = (props) => { 
    const { handleSubmit, dirty, invalid, pristine, reset, submitting, onHide } = props
    return (
        <CSSTransitionGroup
            id="edit-org-form"
            component="form"
            onSubmit={handleSubmit}
            className="md-text-container md-toolbar--relative"
            transitionName="md-cross-fade"
            transitionEnterTimeout={300}
            transitionLeave={false}
        >
            <Toolbar
                nav={<Button icon onClick={onHide}>arrow_back</Button>}
                title={"Edit org"}
                titleId="edit-org-dialog-title"
                fixed
                colored
                actions={[
                    <Button type="button" flat onClick={reset} disabled={submitting}>Reset</Button>,
                    <Button type="submit" flat disabled={invalid || pristine || submitting}>Submit</Button>
                ]}
            />
            <div className="md-grid md-text-container margin-top-56" onSubmit={handleSubmit}>
                <Field
                    id="name"
                    name="name"
                    type="text"
                    label="Name"
                    className="md-cell md-cell--12"
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

export default reduxForm({ form: 'EditOrgForm', validate })(EditOrgForm)