import React from 'react'
import { TextField, Checkbox, SelectionControlGroup, SelectField, Switch } from 'react-md'

export const renderMdTextField = ({ input, meta: { touched, error }, ...others }) => (
    <TextField {...input} {...others} error={touched && !!error} errorText={error} />
)
/*export const renderMdTextField = ({ input, label, type, meta: { touched, error, warning }, ...custom }) => (
    <TextField
        id={input.name}
        type={type}
        label={label}
        value={input.value}
        {...custom}
        error={error}
        errorText={error}
        onChange={input.onChange}
    />
)*/

export const renderMdCheckBox = ({ input, label, meta: { touched, error }, ...custom }) => (
    <Checkbox
        id={input.name}
        name={input.name}
        value={input.value}
        onChange={input.onChange}
        label={label}
        {...custom}
    />
)

export const renderMdSelectionControl = ({ input, label, meta: { touched, error }, ...custom }) => (
    <SelectionControlGroup
        id={input.name}
        name={input.name}
        value={
            Array.isArray(input.value) ?
                input.value.join(',') :
                input.value
        }
        label={label}
        onChange={input.onChange}
        {...custom}
    />
)

export const renderMdSelectField = ({ input, label, meta: { touched, error }, ...custom}) => (
    <SelectField
        id={input.name}
        label={label}
        onChange={input.onChange}
        {...custom}
    />
)

export const renderMdSwitch = ({ input, label, meta: { touched, error }, ...custom }) => (
    <Switch
        id={input.name}
        name={input.name}
        label={label}
        onChange={input.onChange}
        {...custom}
    />
)