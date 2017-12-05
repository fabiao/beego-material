import React from 'react'
import {connect} from 'react-redux'
import {
    Card,
    DataTable,
    TableHeader,
    TableBody,
    TableRow,
    TableColumn,
    TablePagination,
    EditDialogColumn,
    Button } from 'react-md'
import TableActions from '../components/TableActions'
import ActionsMenu from '../components/ActionsMenu'
import {Auth} from '../components/Authentication'
import EditRecordDialog from '../components/EditRecordDialog'
import EditOrgForm from '../components/EditOrgForm'
import {loadOrgsAction, updateOrgAction} from '../actions/org'

class Organizations extends Auth {
    state = {
        selectedRows: [],
        count: 0,
        dialogVisible: false,
        currentOrg: null
    }

    componentDidMount() {
        this.props.loadOrgsAction(this.props.pagination.currentPage, this.props.pagination.limit)
    }

    handlePagination = (start, rowsPerPage) => {
        this.props.loadOrgsAction(start, start + rowsPerPage)
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
        this.props.loadOrgsAction(this.props.pagination.currentPage, this.props.pagination.limit)
    }

    showEditRecordDialog = () => {
        this.setState({ dialogVisible: true })
    }

    hideEditRecordDialog = () => {
        this.setState({ dialogVisible: false })
    }

    handleSubmit = () => {
        alert('Eccoci')
    }

    onInspectRecord = record => {
        alert('onInspectRecord: ' + JSON.stringify(record))
    }

    onEditRecord = record => {
        alert('onEditRecord: ' + JSON.stringify(record))
    }

    onDeleteRecord = record => {
        alert('onDeleteRecord: ' + JSON.stringify(record))
    }

    render() {
        const { orgs, pagination } = this.props
        const { count, dialogVisible, currentOrg } = this.state
        return (
            <Card className="md-block-centered">
                <TableActions
                    title="Organizations"
                    count={count}
                    onAddClick={this.showEditRecordDialog}
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
                                <ActionsMenu record={org}  onInspectRecord={this.onInspectRecord} onEditRecord={this.onEditRecord} onDeleteRecord={this.onDeleteRecord} />
                            </TableRow>
                        ))}
                    </TableBody>
                    <TablePagination
                        rowsPerPageLabel='Rows per page'
                        page={pagination.currentPage}
                        rows={pagination.totalRecords}
                        rowsPerPage={pagination.limit}
                        onPagination={this.handlePagination}
                    />
                </DataTable>
                <EditRecordDialog
                    onHide={this.hideEditRecordDialog}
                    visible={dialogVisible}
                >
                    <EditOrgForm initialValues={currentOrg} onSubmit={values => this.submit(values)} />
                </EditRecordDialog>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    //alert(JSON.stringify(state.org))
    return { orgs: state.org.orgs, pagination: state.org.pagination }
}

export default connect(mapStateToProps, {loadOrgsAction})(Organizations)