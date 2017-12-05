import React from 'react'
import PropTypes from 'prop-types'
import { MenuButtonColumn, FontIcon } from 'react-md'

export default class ActionsMenu extends React.PureComponent {
    static propTypes = {
        onInspectRecord: PropTypes.func.isRequired,
        onEditRecord: PropTypes.func.isRequired,
        onDeleteRecord: PropTypes.func.isRequired
    }

    menuItems = () => {
        const { record, onEditRecord, onDeleteRecord, onInspectRecord } = this.props
        return [{
            leftIcon: <FontIcon>info</FontIcon>,
            primaryText: 'More info',
            onClick: e => { onInspectRecord(record) }
        }, {
            leftIcon: <FontIcon>create</FontIcon>,
            primaryText: 'Edit',
            onClick: e => { onEditRecord(record) }
        }, {
            divider: true
        }, {
            leftIcon: <FontIcon>delete</FontIcon>,
            primaryText: <span className="md-text--error">Delete</span>,
            onClick: e => { onDeleteRecord(record) }
        }]
    }

    render() {
        return (
            <MenuButtonColumn {...this.props} icon menuItems={this.menuItems()} className="pull-button-right">
                <FontIcon>more_vert</FontIcon>
            </MenuButtonColumn>
        )
    }
}