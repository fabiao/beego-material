import React from 'react'
import {connect} from 'react-redux'
import {
    Card,
    DataTable,
    DialogContainer,
    TableHeader,
    TableBody,
    TableRow,
    TableColumn,
    TablePagination } from 'react-md'
import TableActions from '../../components/TableActions'
import ActionsMenu from '../../components/ActionsMenu'
import {Auth} from '../../components/Authentication'
import EditOrgForm from '../../components/EditOrgForm'
import {loadOrgsAction, editOrgAction, updateOrgAction} from '../../actions/org'

class Organizations extends Auth {
    state = {
        selectedRows: [],
        count: 0
    }

    componentDidMount() {
        this.props.loadOrgsAction(this.props.pagination.skip, this.props.pagination.limit)
    }

    handlePagination = (start, rowsPerPage, currentPage) => {
        //alert('start:' + start + ', rowsPerPage:' + rowsPerPage + ', currentPage:' + currentPage)
        this.props.loadOrgsAction(start, rowsPerPage)
    }

    handleRowToggle = (row, selected, count) => {
        let selectedRows = this.state.selectedRows.slice()
        if (row === 0) {
            selectedRows = selectedRows.map(() => selected)
        } else {
            selectedRows[row - 1] = selected
        }

        this.setState({ selectedRows, count })
    }

    reset = () => {
        //alert('currentPage:' + this.props.pagination.currentPage + ', limit:' + this.props.pagination.limit)
        this.props.loadOrgsAction(this.props.pagination.skip, this.props.pagination.limit)
    }

    onInspectRecord = (record) => {
        alert('onInspectRecord: ' + JSON.stringify(record, null, 4))
    }

    onCreateRecord = () => {
        const record = { name: null, address: { street: null, zipCode: null, city: null }}
        alert('onCreateRecord: ' + JSON.stringify(record, null, 4))
        this.props.editOrgAction(record)
    }

    onEditRecord = (record) => {
        alert('onEditRecord: ' + JSON.stringify(record, null, 4))
        this.props.editOrgAction(record)
    }

    onDeleteRecord = (record) => {
        alert('onDeleteRecord: ' + JSON.stringify(record, null, 4))
    }

    onHideEditRecordDialog = () => {
        this.props.editOrgAction(null)
    }

    onFormChange = (values, dispatch, props) => {
        //alert(JSON.stringify(values, null, 4))
        //alert(JSON.stringify(dispatch, null, 4))
        //alert(JSON.stringify(props, null, 4))
    }

    render() {
        const { selectedOrg, orgs, pagination, updateOrgAction } = this.props
        const { count } = this.state
        return (
            <Card className="md-block-centered">
                <TableActions
                    title="Organizations"
                    count={count}
                    onAddClick={this.onCreateRecord}
                    onRemoveClick={this.removeSelected}
                    onResetClick={this.reset}
                />
                <DataTable baseId={1} onRowToggle={this.handleRowToggle}>
                    <TableHeader>
                        <TableRow>
                            <TableColumn key={1}>Name</TableColumn>
                            <TableColumn key={2}>Street</TableColumn>
                            <TableColumn key={3}>Zip code</TableColumn>
                            <TableColumn key={4}>City</TableColumn>
                            <TableColumn/>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orgs.map((org, index) => (
                            <TableRow key={index}>
                                <TableColumn>{org.name}</TableColumn>
                                <TableColumn>{org.address.street}</TableColumn>
                                <TableColumn>{org.address.zipCode}</TableColumn>
                                <TableColumn>{org.address.city}</TableColumn>
                                <ActionsMenu record={org} onInspectRecord={this.onInspectRecord} onEditRecord={this.onEditRecord} onDeleteRecord={this.onDeleteRecord} />
                            </TableRow>
                        ))}
                    </TableBody>
                    <TablePagination
                        rowsPerPageLabel='Rows per page'
                        rows={pagination.rows}
                        onPagination={this.handlePagination}
                    />
                </DataTable>
                <DialogContainer
                    id="edit-org-dialog"
                    aria-labelledby="edit-org-dialog-title"
                    visible={selectedOrg != null}
                    onHide={this.onHideEditRecordDialog}
                    fullPage
                >
                    <EditOrgForm initialValues={selectedOrg} onSubmit={values => updateOrgAction(values)} onHide={this.onHideEditRecordDialog} />
                </DialogContainer>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    //alert(JSON.stringify(state.org))
    return { selectedOrg: state.org.selectedOrg, orgs: state.org.orgs, pagination: state.org.pagination }
}

export default connect(mapStateToProps, {loadOrgsAction, editOrgAction, updateOrgAction})(Organizations)