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
import TableActions from '../components/TableActions'
import ActionsMenu from '../components/ActionsMenu'
import {Auth} from '../components/Authentication'
import EditUserForm from '../components/EditUserForm'
import {loadUsersAction, editUserAction, updateUserAction} from '../actions/user'

class Users extends Auth {
    state = {
        selectedRows: [],
        count: 0,
    }

    componentDidMount() {
        this.props.loadUsersAction(this.props.pagination.skip, this.props.pagination.limit)
    }

    handlePagination = (start, rowsPerPage, currentPage) => {
        //alert('start:' + start + ', rowsPerPage:' + rowsPerPage + ', currentPage:' + currentPage)
        this.props.loadUsersAction(start, rowsPerPage)
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
        this.props.loadUsersAction(this.props.pagination.skip, this.props.pagination.limit)
    }

    onInspectRecord = (record) => {
        alert('onInspectRecord: ' + JSON.stringify(record, null, 4))
    }

    onCreateRecord = () => {
        const record = { firstName: null, lastName: null, email: null, address: { street: null, zipCode: null, city: null }}
        alert('onEditRecord: ' + JSON.stringify(record, null, 4))
        this.props.editUserAction(record)
    }

    onEditRecord = (record) => {
        alert('onEditRecord: ' + JSON.stringify(record, null, 4))
        this.props.editUserAction(record)
    }

    onDeleteRecord = (record) => {
        alert('onDeleteRecord: ' + JSON.stringify(record, null, 4))
    }

    onHideEditRecordDialog = () => {
        this.props.editUserAction(null)
    }

    onFormChange = (values, dispatch, props) => {
        //alert(JSON.stringify(values, null, 4))
        //alert(JSON.stringify(dispatch, null, 4))
        //alert(JSON.stringify(props, null, 4))
    }

    render() {
        const { selectedUser, users, pagination, updateUserAction } = this.props
        const { count } = this.state
        return (
            <Card className="md-block-centered">
                <TableActions
                    title="Users"
                    count={count}
                    onAddClick={this.onCreateRecord}
                    onRemoveClick={this.removeSelected}
                    onResetClick={this.reset}
                />
                <DataTable baseId={1} onRowToggle={this.handleRowToggle}>
                    <TableHeader>
                        <TableRow>
                            <TableColumn key={1}>First name</TableColumn>
                            <TableColumn key={2}>Last name</TableColumn>
                            <TableColumn key={3}>Email</TableColumn>
                            <TableColumn key={4}>Street</TableColumn>
                            <TableColumn key={5}>Zip code</TableColumn>
                            <TableColumn key={6}>City</TableColumn>
                            <TableColumn/>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={index}>
                                <TableColumn>{user.firstName}</TableColumn>
                                <TableColumn>{user.lastName}</TableColumn>
                                <TableColumn>{user.email}</TableColumn>
                                <TableColumn>{user.address.street}</TableColumn>
                                <TableColumn>{user.address.zipCode}</TableColumn>
                                <TableColumn>{user.address.city}</TableColumn>
                                <ActionsMenu record={user} onInspectRecord={this.onInspectRecord} onEditRecord={this.onEditRecord} onDeleteRecord={this.onDeleteRecord} />
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
                    id="edit-user-dialog"
                    aria-labelledby="edit-user-dialog-title"
                    visible={selectedUser != null}
                    onHide={this.onHideEditRecordDialog}
                    fullPage
                >
                    <EditUserForm initialValues={selectedUser} onSubmit={values => updateUserAction(values)} onHide={this.onHideEditRecordDialog} />
                </DialogContainer>
            </Card>
        )
    }
}

const mapStateToProps = (state) => {
    //alert(JSON.stringify(state.user))
    return { selectedUser: state.user.selectedUser, users: state.user.users, pagination: state.user.pagination }
}

export default connect(mapStateToProps, {loadUsersAction, editUserAction, updateUserAction})(Users)