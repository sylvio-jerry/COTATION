import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { VilleFilter,ButtonComponent,AlertToast ,AlertConfirm , LoadingComponent} from '../../components';
import AddVille from './AddVille';
import EditVille from './EditVille';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {ReactComponent  as Edit}  from '../../assets/images/edit.svg'
import {ReactComponent  as Delete}  from '../../assets/images/delete.svg'
import { DataGrid  , GridToolbarContainer , GridToolbarQuickFilter} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IconButton ,Stack} from '@mui/material';
import filterFunction from "../../filterFunction";
import { exportExcelVille } from '../../export/exportExcel';
import { useStateContext } from '../../contexts/ContextProvider';
import { super_admin_only } from '../../data/constant';

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const ListVille = () => {
  const {currentUser} = useStateContext();
  
  useEffect(()=>{
    getVille()
  },[])

  const [villeData,setVilleData] = useState([])
  const [villeDataFiltered,setVilleDataFiltered] = useState([])
  const [showAddVille, setShowAddVille] = useState(false);
  const [showEditVille, setShowEditVille] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading,setIsLoading] = useState(true);
  
  const getListFiltered = (province)=>{
    const handleProvince = (item) => (!province || item.province_id===province)

    const checking = [handleProvince];
    const newArray = filterFunction(villeData, checking);
    setVilleDataFiltered(newArray)
  }

   //export 
   const handleExportPdf = ()=>{
    // console.log("EXPORT PDF LISTENER inside the component listVille : ");
  }

  const handleExportExcel = ()=>{
    // console.log("EXPORT EXCEL LISTENER inside the component listVille : ");
    exportExcelVille(villeDataFiltered)
  }

  const getVille = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/ville`)
      if(data){
        setVilleData(data.data)
        setVilleDataFiltered(data.data)
        setIsLoading(false)
      }
     } catch (error) {
       console.log("error while getVilleRequest:",error);
     }
  }

  const addVille_ = ()=>{
    setShowAddVille(!showAddVille)
  }

  const deleteVille = async ({id})=>{
    if(currentUser.is_admin){
      AlertToast("info",super_admin_only)
    }else{
      AlertConfirm("warning","Suppression").then(async (res)=>{
       if(res.isConfirmed){
         try {
           const data_ = await axios.delete(`${API_URL}/api/ville/${id}`)
           let {status,message} = data_.data
           if(status==="success"){
             AlertToast("success",message)
             await getVille()
         }
        } catch ({response}) {
           console.log("error while deleteVilleRequest:", response);
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
    
  }

  const editVille = (data)=>{
    setEditData(data)
    setShowEditVille(!showEditVille)
  }

  //table ville design
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

  //table ville
  const TableVille = ({data})=> {
   
    const getProvince = (params)=>{
      let service = params?.row?.province?.nom_province
      return service;
    }

    const getNombreClient= (params)=>{
      let nombre = params?.row?.client?.length
      return nombre;
    }

    const columns = [
      { field: 'id', headerName: 'ID', minWidth: 100, flex: 1 , hide:true},
      {
        field: 'province',
        headerName: 'PROVINCE',
        minWidth: 90,
        flex: 1,
        editable: false,
        valueGetter: getProvince
      },
      {
        field: 'nom_ville',
        headerName: 'VILLE',
        minWidth: 110,
        flex: 1,
        editable: false,
      },
      {
        field: 'client',
        headerName: 'NOMBRE CLIENT',
        minWidth: 90,
        flex: 1,
        editable: false,
        headerAlign: "center",
        align: "center",
        renderCell: getNombreClient
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
                <IconButton onClick={ ()=> editVille(data)} >
                  <Edit style={{width:40, height:50}} fill="#5D6061" />
                </IconButton>
            </Box>
            <Box>
              <IconButton onClick={()=>deleteVille(data)} >
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
      {showAddVille && <AddVille openModal={showAddVille} closeModal={setShowAddVille} refresh={getVille}/>}
      {showEditVille && <EditVille openModal={showEditVille} closeModal={setShowEditVille} refresh={getVille} data={editData} />}
      <VilleFilter 
      filterOption = {getListFiltered}
      exportPdf={handleExportPdf}
      exportExcel={handleExportExcel}/>
      <div style={{paddingTop:50}}>
        <ButtonComponent color='root' function={addVille_} name_of_btn="NOUVEAU" icon={<PersonAddAltIcon />} />
      </div>
      <div>
        <TableVille data={villeDataFiltered}/>
      </div>
    </div>
  );
};

export default ListVille;
