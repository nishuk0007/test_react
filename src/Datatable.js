import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableSelectRow,
  TableSelectAll,
  TableContainer,
  TableToolbar,
  TableBatchActions,
  TableBatchAction,
  TableToolbarContent,
  TableToolbarSearch,
  ModalWrapper,
  ModalBody,
  TextInput,
  Checkbox
} from "carbon-components-react";
import { Checkmark32, PauseOutline32, TrashCan32 } from "@carbon/icons-react";
import { useEffect, useState } from "react";
import {useHistory} from 'react-router-dom';
import axios from 'axios';


const headers = [
  {
    key: "name",
    header: "Name",
  },
  {
    key: "username",
    header: "Username",
  },
  {
    key: "is_superuser",
    header: "Superuser",
  },
  {
    key: "is_staff",
    header: "Staff",
  },
  {
    key: "is_active",
    header: "Active",
  },
];

function Datatable() {
  const [name, setName] = useState('');
  const [username, setusername] = useState('');
  const [is_active, setIsActive] = useState(false);
  const [is_staff, setIsStaff] = useState(false);
  const [is_superuser, setIsSuperuser] = useState(false);
  const [rows, setRows] = useState([]);

  const history = useHistory();

  const fetchRows = async() => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API}/users/`);
      const resData = res.data;
      setRows(resData);
    }
    catch(e){
      console.log(e)
    }
  }

  const handleDelete = async (selected) => {
    const ids = selected.map(sel => sel.id).join(',');
    try{
      const res = await axios.delete(`${process.env.REACT_APP_API}/delete_multiple_users`, {data: {ids}});
      console.log(res);
      await fetchRows();
    } catch(e) {
      console.log(e);
    }
  };

  const handleActivate = async (selected = []) => {
    const ids = selected.map(sel => sel.id).join(',');
    try{
      await axios.patch(`${process.env.REACT_APP_API}/update_multiple_users_status`, {ids, is_active: 'active'})
      fetchRows();
    } catch(e) {
      console.log(e.message);
    }
  };

  const handleDeActivate = async (selected) => {
    const ids = selected.map(sel => sel.id).join(',');
    try{
      await axios.patch(`${process.env.REACT_APP_API}/update_multiple_users_status`, {ids, is_active: 'in_active'})
      await fetchRows();
    } catch(e) {
      console.log(e);
    }
  };

  const handleAddNew = async () => {
    try{
      await axios.post(`${process.env.REACT_APP_API}/users/`, {
        name, username, is_active, is_staff, is_superuser
      });
      await fetchRows();
      clearState();
    } catch(e) {
      console.log(e)
    }
  };

  const clearState = () => {
    setName('');
    setusername('');
    setIsActive(false);
    setIsStaff(false);
    setIsSuperuser(false);
  }

  const handleRowClick  = (id) => {
    history.push(`/${id}`);
  }

  useEffect(() =>{
    fetchRows()
  }, [])

  return (
    <div className="App">
      <div className="flex content-space-between">
        <div className="fs-6">Users</div>
        <ModalWrapper
          buttonTriggerText="Add new"
          modalHeading="Add New"
          size="sm"
          handleSubmit={handleAddNew}
        >
          <ModalBody>
            <TextInput
              invalidText="A valid value is required"
              placeholder="name"
              value={name}
              onChange={e  => setName(e.target.value)}
            />
            <TextInput
              invalidText="A valid value is required"
              placeholder="username"
              className="mt-2"
              value={username}
              onChange={e => setusername(e.target.value)}
            />
            <Checkbox labelText="Is Active" id="checked-1" checked={is_active} onClick={() => setIsActive(!is_active)} />
            <Checkbox labelText="Is Staff" id="checked-2" checked={is_staff} onClick={() => setIsStaff(!is_staff)}/>
            <Checkbox labelText="Is Superuser" id="checked-3" checked={is_superuser} onClick={() => setIsSuperuser(!is_superuser)} />
          </ModalBody>
        </ModalWrapper>
      </div>
      <DataTable rows={rows} headers={headers} isSortable>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getSelectionProps,
          getToolbarProps,
          getBatchActionProps,
          onInputChange,
          selectedRows,
          getTableProps,
          getTableContainerProps,
        }) => (
          <TableContainer {...getTableContainerProps()}>
            <TableToolbar {...getToolbarProps()}>
              <TableBatchActions {...getBatchActionProps()}>
                <TableBatchAction
                  tabIndex={
                    getBatchActionProps().shouldShowBatchActions ? 0 : -1
                  }
                  renderIcon={TrashCan32}
                  onClick={() => handleDelete(selectedRows)}
                >
                  Delete
                </TableBatchAction>
                <TableBatchAction
                  tabIndex={
                    getBatchActionProps().shouldShowBatchActions ? 0 : -1
                  }
                  renderIcon={Checkmark32}
                  onClick={() => handleActivate(selectedRows)}
                >
                  Activate
                </TableBatchAction>
                <TableBatchAction
                  tabIndex={
                    getBatchActionProps().shouldShowBatchActions ? 0 : -1
                  }
                  renderIcon={PauseOutline32}
                  onClick={() => handleDeActivate(selectedRows)}
                >
                  Deactivate
                </TableBatchAction>
              </TableBatchActions>
              <TableToolbarContent>
                <TableToolbarSearch
                  persistent="true"
                  tabIndex={
                    getBatchActionProps().shouldShowBatchActions ? -1 : 0
                  }
                  onChange={onInputChange}
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  <TableSelectAll {...getSelectionProps()} />
                  {headers.map((header, i) => (
                    <TableHeader key={i} {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row, i) => (
                  <TableRow key={i} {...getRowProps({ row })}>
                    <TableSelectRow {...getSelectionProps({ row })} />
                    {row.cells.map((cell) => (
                      <TableCell className="pointer" key={cell.id} onClick={() => handleRowClick(row.id)}>
                        {['is_active', 'is_staff', 'is_superuser'].includes(cell.info.header) ? cell.value ? <Checkmark32 /> : 'X' : cell.value}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
}

export default Datatable;
