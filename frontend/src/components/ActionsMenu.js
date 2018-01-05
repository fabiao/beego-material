import React from 'react'
import PropTypes from 'prop-types'
import { MenuButtonColumn, FontIcon } from 'react-md'
import TableColumn from 'react-md/lib/DataTables/TableColumn';

export default class ActionsMenu extends TableColumn {
    static propTypes = {
        onInspectRecord: PropTypes.func.isRequired,
        onEditRecord: PropTypes.func.isRequired,
        onDeleteRecord: PropTypes.func.isRequired
    }

    constructor(props) {
        super(props)
        const { record, onEditRecord, onDeleteRecord, onInspectRecord } = this.props
        this.state = {menuItems: [{
            leftIcon: <FontIcon>info</FontIcon>,
            primaryText: 'More info',
            onClick: (e) => { onInspectRecord(record) }
        }, {
            leftIcon: <FontIcon>create</FontIcon>,
            primaryText: 'Edit',
            onClick: (e) => { onEditRecord(record) }
        }, {
            divider: true
        }, {
            leftIcon: <FontIcon>delete</FontIcon>,
            primaryText: <span className="md-text--error">Delete</span>,
            onClick: (e) => { onDeleteRecord(record) }
        }]}
    }

    render() {
        return (
            <MenuButtonColumn {...this.props} icon menuItems={this.state.menuItems} className="pull-button-right">
                <FontIcon>more_vert</FontIcon>
            </MenuButtonColumn>
        )
    }
}