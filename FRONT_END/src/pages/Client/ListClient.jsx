import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { ClientFilter, ButtonComponent,AlertToast ,AlertConfirm ,LoadingComponent } from '../../components';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useNavigate } from 'react-router-dom';
import {ReactComponent  as Edit}  from '../../assets/images/edit.svg'
import {ReactComponent  as Delete}  from '../../assets/images/delete.svg'
import { DataGrid , GridToolbarContainer , GridToolbarQuickFilter} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IconButton,Stack } from '@mui/material';
import filterFunction from "../../filterFunction";
import { exportExcelClient } from '../../export/exportExcel';


const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const ListClient = () => {
  useEffect(()=>{
    getClient()
  },[])

  const [clientData,setClientData] = useState([])
  const [clientDataFiltered,setClientDataFiltered] = useState([])
  const [isLoading,setIsLoading] = useState(true);
  
  const navigate= useNavigate()
  
  //EXPORT 
  const handleExportPdf = ()=>{
    // console.log("EXPORT PDF LISTENER inside the component list client -------------: ", clientData.length);
    // console.log("EXPORT PDF LISTENER inside the component list client ++++++++++++++++: ", clientDataFiltered.length);

  }

  const handleExportExcel = ()=>{
    // console.log("EXPORT excel LISTENER inside the component list client ++++++++++++++++: ", clientDataFiltered);
    exportExcelClient(clientDataFiltered)
  }

  const getListFiltered = (filter)=>{
    // console.log("here the list",filter);
    const handleProvince = (item) => (!filter.province || item.ville.province_id===filter.province)
    const handleVille = (item) => !filter.ville || item.ville.id===filter.ville
      
    const checking = [handleProvince,handleVille];
    const newArray = filterFunction(clientData, checking);
    setClientDataFiltered(newArray)
  }

  const getClient = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/client`)
      if(data){
        setClientData(data.data)
        setClientDataFiltered(data.data)
        setIsLoading(false)
      }
     } catch (error) {
       console.log("error while getClientRequest:",error);
     }
  }

  const addClient = ()=>{
    navigate('/client/ajout');
  }

  const deleteClient = async ({id})=>{
     AlertConfirm("warning","Suppression").then(async (res)=>{
      if(res.isConfirmed){
        try {
          const data_ = await axios.delete(`${API_URL}/api/client/${id}`)
          let {status,message} = data_.data
          if(status==="success"){
            AlertToast("success",message)
            await getClient()
        }
       } catch ({response}) {
          console.log("error while getServiceRequest:", response);
          let {status,message} = response.data
          if(status==="failed"){
            AlertToast("error",message)
          }
       }
      }else if(res.isDenied){
        AlertToast("info","Operation annulé")
      }
    })
  }

  const editClient = (data)=>{
    navigate(`edit/${data.id}`, {state: data})
  }

  //table client design
  const datagridSx = {
    borderRadius: 2,
    border: 'none',
    "& .MuiDataGrid-main": { borderRadius: 2 },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#03C9D7",
      color: "white",
      fontSize: 16,
    },
    '& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within': {
      outline: 'none',
    },

    '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus': {
      outline: 'none',
    }
  };
  //table client
  const TableClient = ({data})=> {
    const getVille = (params)=>{
      let ville = params.row.ville.nom_ville
      return ville;
    }
    const getProvince = (params)=>{
      let province = params.row.ville.province.nom_province
      return province;
    }

    const getTel = (params)=>{
      let tel = params.row.tel ? params.row.tel : "-"
      return tel;
    }
    const getMail = (params)=>{
      let email = params.row.email ? params.row.email : "-"
      return email;
    }
    const columns = [
      { field: 'id', headerName: 'ID', minWidth: 100, flex: 1 , hide:true},
      {
        field: 'nom_client',
        headerName: 'NOM',
        minWidth: 110,
        flex: 1,
        editable: false,
      },
      {
        field: 'email',
        headerName: 'EMAIL',
        // type: 'number',
        headerAlign: "center",
        minWidth: 90,
        flex: 1,
        editable: false,
        valueGetter: getMail
      },
      {
        field: 'tel',
        headerName: 'TEL',
        sortable: false,
        minWidth: 150,
        flex: 1,
        valueGetter: getTel
      },
      {
        field: 'adresse',
        headerName: 'ADRESSE',
        minWidth: 110,
        flex: 1,
        editable: false,
      },
      {
        field: 'ville',
        headerName: 'VILLE',
        minWidth: 110,
        flex: 1,
        editable: false,
        valueGetter: getVille
      },
      {
        field: 'province',
        headerName: 'PROVINCE',
        minWidth: 110,
        flex: 1,
        editable: false,
        valueGetter: getProvince
      },
      {
        field: 'ACTION',
        minWidth: 120,
        flex: 1,
        textAlign: "center",
        sortable: false,
        headerAlign: "center",
        renderCell: (cellValue)=><ActionButton data={cellValue.row}/>
    }
    ];
    
    const rows = data || []
    
  
    const  ActionButton = ({data}) => {
      const actionStyle = {
        display:"flex",
        justifyContent:"space-evenly",
        flex:1
      }

      return (
          <Box style={actionStyle}>
            <Box>
                <IconButton onClick={ ()=> editClient(data)} >
                  <Edit style={{width:40, height:50}} fill="#5D6061" />
                </IconButton>
            </Box>
            <Box>
              <IconButton onClick={()=>deleteClient(data)} >
                <Delete style={{width:45, height:50}} fill="#C14949" />
              </IconButton>
            </Box>
          </Box>
      )
    }

    //search bar 
    function Search() {

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
    function NoRowsOverlay() {
      return (
        <Stack height="100%" alignItems="center" justifyContent="center">
          Aucune données
        </Stack>
      );
    }
    return (
      <Box sx={{ width: '100%', marginTop:0 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          components={{ 
            Toolbar: Search,
            NoRowsOverlay: NoRowsOverlay,
            LoadingOverlay: LoadingComponent
          }}
          sx={datagridSx}
          autoHeight={true} 
          loading={isLoading}
        />
      </Box>
    );
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <ClientFilter 
        exportPdf={handleExportPdf}
        exportExcel={handleExportExcel}
        filterOption = {getListFiltered}
      />
      <div style={{paddingTop:50}}>
        <ButtonComponent color='root' function={addClient} name_of_btn="NOUVEAU" icon={<PersonAddAltIcon />} />
      </div>
      <div>
        <TableClient data={clientDataFiltered}/>
      </div>
    </div>
  );
};

export default ListClient;
