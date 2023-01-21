import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { FamilleFilter,ButtonComponent,HeaderLabel,AlertToast ,AlertConfirm,LoadingComponent} from '../../components';
import AddFamille from './AddFamille';
import EditFamille from './EditFamille';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useNavigate } from 'react-router-dom';
import {ReactComponent  as Edit}  from '../../assets/images/edit.svg'
import {ReactComponent  as Delete}  from '../../assets/images/delete.svg'
import { DataGrid , GridToolbar , GridToolbarContainer , GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IconButton,Stack } from '@mui/material';
import globalStyle from '../../Style/globalStyle';
import {ReactComponent  as Info}  from '../../assets/images/info.svg'
import filterFunction from "../../filterFunction";
import { useStateContext } from '../../contexts/ContextProvider';
import { super_admin_only } from '../../data/constant';

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
const ListFamille = () => {
  const {currentUser} = useStateContext();
  useEffect(()=>{
    getFamille()
  },[])

  const [familleData,setFamilleData] = useState([])
  const [familleDataFiltered,setFamilleDataFiltered] = useState([])
  const [showAddFamille, setShowAddFamille] = useState(false);
  const [showEditFamille, setShowEditFamille] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading,setIsLoading] = useState(true);
  
  const classes = globalStyle()
  const navigate= useNavigate()
  
  const getListFiltered = (service)=>{
    const handleService= (item) => (!service || item.service_id===service)

    const checking = [handleService];
    const newArray = filterFunction(familleData, checking);
    setFamilleDataFiltered(newArray)
  }

  const getFamille = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/famille`)
      if(data){
        setFamilleData(data.data)
        setFamilleDataFiltered(data.data)
        setIsLoading(false)
      }
     } catch (error) {
       console.log("error while getFamilleRequest:",error);
     }
  }

  const addFamille_ = ()=>{
    if(currentUser.is_admin){
      AlertToast("info",super_admin_only)
    }else{
      setShowAddFamille(!showAddFamille)
    }
  }

  const deleteFamille = async ({id})=>{
    if(currentUser.is_admin){
      AlertToast("info",super_admin_only)
    }else{
      AlertConfirm("warning","Suppression").then(async (res)=>{
        if(res.isConfirmed){
          try {
            const data_ = await axios.delete(`${API_URL}/api/famille/${id}`)
            let {status,message} = data_.data
            if(status==="success"){
              AlertToast("success",message)
              await getFamille()
          }
         } catch ({response}) {
            console.log("error while getFamilleRequest:", response);
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

  const editFamille = (data)=>{
    if(currentUser.is_admin){
      AlertToast("info",super_admin_only)
    }else{
      setEditData(data)
      setShowEditFamille(!showEditFamille)
    }
  }

  //table famille design
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

  const infoFamille = (data)=>{
    navigate(`detail/${data.id}`, {state: data})
  }

  //table client
  const TableFamille = ({data})=> {
   
    const getService = (params)=>{
      let service = params?.row?.service?.nom_service
      return service;
    }

    const getNombreEquipement = (params)=>{
      let nombre = params?.row?.equipement?.length
      return nombre;
    }

    const columns = [
      { field: 'id', headerName: 'ID', minWidth: 100, flex: 1 , hide:true},
      {
        field: 'nom_famille',
        headerName: 'FAMILLE',
        minWidth: 110,
        flex: 1,
        editable: false,
      },
      {
        field: 'equipement',
        headerName: 'NOMBRE EQUIPEMENT',
        minWidth: 90,
        flex: 1,
        editable: false,
        headerAlign: "center",
        align: "center",
        renderCell: getNombreEquipement
      },
      {
        field: 'service',
        headerName: 'SERVICE',
        minWidth: 90,
        flex: 1,
        editable: false,
        valueGetter: getService
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
                <IconButton onClick={ ()=> infoFamille(data)} >
                  <Info style={{width:40, height:50}} />
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={ ()=> editFamille(data)} >
                  <Edit style={{width:40, height:50}} fill="#5D6061" />
                </IconButton>
            </Box>
            <Box>
              <IconButton onClick={()=>deleteFamille(data)} >
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
      <Box sx={{width: '100%', marginTop:0 }}>
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
      {showAddFamille && <AddFamille openModal={showAddFamille} closeModal={setShowAddFamille} refresh={getFamille}/>}
      {showEditFamille && <EditFamille openModal={showEditFamille} closeModal={setShowEditFamille} refresh={getFamille} data={editData} />}
      <FamilleFilter 
      filterOption = {getListFiltered}/>
      <div style={{paddingTop:50}}>
      {/* <HeaderLabel title="FAMILLE"/> */}
        <ButtonComponent color='root' function={addFamille_} name_of_btn="NOUVEAU" icon={<PersonAddAltIcon />} />
      </div>
      <div>
        <TableFamille data={familleDataFiltered}/>
      </div>
    </div>
  );
};

export default ListFamille;
