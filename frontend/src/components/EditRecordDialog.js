import React from 'react'
import PropTypes from 'prop-types'
import { DialogContainer } from 'react-md'

export default class EditRecordDialog extends React.PureComponent {
    static propTypes = {
        visible: PropTypes.bool.isRequired,
        onHide: PropTypes.func.isRequired
    }

    render() {
        const { visible, onHide, children } = this.props
        return (
            <DialogContainer
                id="edit-record-dialog"
                aria-labelledby="edit-record-dialog-title"
                visible={visible}
                onHide={onHide}
                fullPage
            >
               {children}
            </DialogContainer>
        )
    }
}