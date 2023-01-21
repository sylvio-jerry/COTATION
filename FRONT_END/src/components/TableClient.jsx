import * as React from 'react';
import Box from '@mui/material/Box';
import { IconButton } from '@mui/material';
import {ReactComponent  as Edit}  from '../assets/images/edit.svg'
import {ReactComponent  as Delete}  from '../assets/images/delete.svg'
import { DataGrid , GridToolbar , GridToolbarContainer , GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';

const datagridSx = {
  borderRadius: 2,
  border: 'none',
  "& .MuiDataGrid-main": { borderRadius: 2 },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#03C9D7",
    color: "white",
    fontSize: 16,
  }
};

function CustomToolbar() {

  return (
    <Box style={{
      marginBottom:15,
    }}>
      <GridToolbarContainer>
        <Box style={{ flex:1 }}>
          {/* <GridToolbarExport/> */}
        </Box>
        <GridToolbarQuickFilter/> 
      </GridToolbarContainer>
    </Box>
  );
}

const TableClient = ({deleteClient,editClient})=> {
  
  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 100, flex: 1 , hide:true},
    {
      field: 'firstName',
      headerName: 'FIRST NAME',
      minWidth: 110,
      flex: 1,
      editable: false,
    },
    {
      field: 'lastName',
      headerName: 'LAST NAME',
      minWidth: 110,
      flex: 1,
      editable: true,
    },
    {
      field: 'age',
      headerName: 'AGE',
      type: 'number',
      headerAlign: "center",
      minWidth: 90,
      flex: 1,
      editable: true,
      renderCell: (cellValues) => {
        return (
          <div
            style={{
              // color: "blue",
              // fontSize: 18,
              width: "100%",
              textAlign: "center"
            }}
          >
            {cellValues.value}
          </div>
        )
    }
    },
    {
      field: 'fullName',
      headerName: 'FULL NAME',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      minWidth: 150,
      flex: 1,
      valueGetter: (params) =>
        `${params.row.firstName || ''} ${params.row.lastName || ''}`,
    },
    {
      field: 'ACTION',
      minWidth: 90,
      flex: 1,
      textAlign: "center",
      sortable: false,
      headerAlign: "center",
      renderCell: (cellValue)=><ActionButton data={cellValue.row}/>
  }
  ];
  
  const rows = [
    { id: 1, lastName: 'Snow', firstName: 'Jon', age: 1 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 2 },
    { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 3 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 1 },
    { id: 4, lastName: 'Stark', firstName: 'Arya', age: 2},
    { id: 6, lastName: 'Melisandre', firstName: null, age: 2 },
    { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 3 },
    { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 1},
    { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 2 }
    
  ];

  const  ActionButton = ({data}) => {

    const handleEdit=()=>{
      editClient(data)
    }

    const handleDelete=()=>{
      deleteClient(data)
    }

    return (
        <Box style={{display:"flex", justifyContent:"space-evenly", flex:1}}>
          <Box>
              <IconButton onClick={handleEdit} >
                <Edit style={{width:40, height:50}} fill="#5D6061" />
              </IconButton>
          </Box>
          <Box>
          <IconButton onClick={handleDelete} >
              <Delete style={{width:45, height:50}} fill="#C14949" />
            </IconButton>
          </Box>
        </Box>
    )
  }

  return (
    <Box sx={{ height: 700, width: '100%', marginTop:0 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        components={{ Toolbar: CustomToolbar }}
        sx={datagridSx}
      />
    </Box>
  );
}
export default TableClient;