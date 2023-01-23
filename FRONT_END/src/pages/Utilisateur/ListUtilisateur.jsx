import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { ButtonComponent,HeaderLabel,AlertToast ,AlertConfirm,LoadingComponent} from '../../components';
import AddUtilisateur from './AddUtilisateur';
import EditUtilisateur from './EditUtilisateur';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {ReactComponent  as Edit}  from '../../assets/images/edit.svg'
import {ReactComponent  as Delete}  from '../../assets/images/delete.svg'
import { DataGrid , GridToolbarContainer , GridToolbarQuickFilter} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IconButton,Stack } from '@mui/material';
import { useStateContext } from '../../contexts/ContextProvider';
import { admin_only } from '../../data/constant';

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const ListUtilisateur = () => {
  const {currentUser} = useStateContext();
  useEffect(()=>{
    getUtilisateur()
  },[])

  const [utilisateurData,setUtilisateurData] = useState([])
  const [showAddUtilisateur, setShowAddUtilisateur] = useState(false);
  const [showEditUtilisateur, setShowEditUtilisateur] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isLoading,setIsLoading] = useState(true);
  
  const getUtilisateur = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/utilisateur`)
      if(data){
        setUtilisateurData(data.data)
        setIsLoading(false)
      }
     } catch (error) {
       console.log("error while getUtilisateurRequest:",error);
     }
  }

  const addUtilisateur_ = ()=>{
    if(!currentUser.is_admin){
      AlertToast("info",admin_only)
    }else{
      setShowAddUtilisateur(!showAddUtilisateur)
    }
  }

  const deleteUtilisateur = async ({id})=>{

    if(!currentUser.is_admin){
      AlertToast("info",admin_only)
    }else{
      AlertConfirm("warning","Suppression").then(async (res)=>{
       if(res.isConfirmed){
         try {
           const data_ = await axios.delete(`${API_URL}/api/utilisateur/${id}`)
           let {status,message} = data_.data
           if(status==="success"){
             AlertToast("success",message)
             await getUtilisateur()
         }
        } catch ({response}) {
           console.log("error while getUtilisateurRequest:", response);
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

  const editUtilisateur = (data)=>{
    if(!currentUser.is_admin){
      AlertToast("info",admin_only)
    }else{
      setEditData(data)
      setShowEditUtilisateur(!showEditUtilisateur)
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

  //table client
  const TableUtilisateur = ({data})=> {
   
    const getTel = (params)=>{
      let tel = params?.row?.tel ?  params?.row?.tel : "Pas de numero"
      return tel;
    }

    const getRole = (params)=>{
      let role = params?.row?.is_admin ? "Admin" : "Client"
      return role;
    }

    const columns = [
      { field: 'id', headerName: 'ID', minWidth: 100, flex: 1 , hide:true},
      {
        field: 'nom',
        headerName: 'NOM',
        minWidth: 100,
        flex: 1,
        editable: false,
      },
      {
        field: 'pseudo',
        headerName: 'PSEUDO',
        minWidth: 90,
        flex: 1,
        editable: false,
      },
      {
        field: 'email',
        headerName: 'EMAIL',
        minWidth: 90,
        flex: 1,
        editable: false
      },
      {
        field: 'tel',
        headerName: 'TEL',
        minWidth: 90,
        flex: 1,
        editable: false,
        headerAlign: "center",
        align: "center",
        valueGetter: getTel
      },
      {
        field: 'is_admin',
        headerName: 'ROLE',
        minWidth: 90,
        flex: 1,
        editable: false,
        headerAlign: "center",
        align: "center",
        valueGetter: getRole
      },
      {
        field: 'ACTION',
        minWidth: 200,
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
                <IconButton onClick={ ()=> editUtilisateur(data)} >
                  <Edit style={{width:40, height:50}} fill="#5D6061" />
                </IconButton>
            </Box>
            <Box>
              <IconButton onClick={()=>deleteUtilisateur(data)} >
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
      {showAddUtilisateur && <AddUtilisateur openModal={showAddUtilisateur} closeModal={setShowAddUtilisateur} refresh={getUtilisateur}/>}
      {showEditUtilisateur && <EditUtilisateur openModal={showEditUtilisateur} closeModal={setShowEditUtilisateur} refresh={getUtilisateur} data={editData} />}
      <div style={{paddingTop:50}}>
      <HeaderLabel title="UTILISATEUR"/>
        <ButtonComponent color='root' function={addUtilisateur_} name_of_btn="NOUVEAU" icon={<PersonAddAltIcon />} />
      </div>
      <div>
        <TableUtilisateur data={utilisateurData}/>
      </div>
    </div>
  );
};

export default ListUtilisateur;
