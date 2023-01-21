import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { ButtonComponent,HeaderLabel,AlertToast ,AlertConfirm ,LoadingComponent } from '../../components';
import AddService from './AddService';
import EditService from './EditService';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import {ReactComponent  as Edit}  from '../../assets/images/edit.svg'
import {ReactComponent  as Delete}  from '../../assets/images/delete.svg'
import { DataGrid  , GridToolbarContainer , GridToolbarQuickFilter} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IconButton,Accordion,AccordionSummary,AccordionDetails,Typography,Stack } from '@mui/material';
import serviceStyle from './serviceStyle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useStateContext } from '../../contexts/ContextProvider';
import { super_admin_only } from '../../data/constant';


const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const ListService = () => {
  const {currentUser} = useStateContext();

  useEffect(()=>{
    getService()
  },[])

  const [serviceData,setServiceData] = useState([])
  const [showAddService, setShowAddService] = useState(false);
  const [editData, setEditData] = useState(null);
  const [showEditService, setShowEditService] = useState(false);
  const [isLoading,setIsLoading] = useState(true);
  
  const classes = serviceStyle()

  const getService = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/service`)
      if(data){
        setServiceData(data.data)
        setIsLoading(false)
      }
     } catch (error) {
       console.log("error while getServiceRequest:",error);
     }
  }

  const addService = ()=>{
    if(currentUser.is_admin){
      AlertToast("info",super_admin_only)
    }else{
      setShowAddService(!showAddService)
    }
  }

  const deleteService = async ({id})=>{
    if(currentUser.is_admin){
      AlertToast("info",super_admin_only)
    }else{
     AlertConfirm("warning","Suppression").then(async (res)=>{
      if(res.isConfirmed){
        try {
          const data_ = await axios.delete(`${API_URL}/api/service/${id}`)
          let {status,message} = data_.data
          if(status==="success"){
            AlertToast("success",message)
            await getService()
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
    
  }


  const editService = (data)=>{
    if(currentUser.is_admin){
      AlertToast("info",super_admin_only)
    }else{
      setEditData(data)
      setShowEditService(!showEditService)
    }
  }

  //table service design
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
  const TableService = ({data})=> {

    function getFamille(params) {
      let famille_ = params.row?.famille
      return (
        <div>
          <Accordion TransitionProps={{ unmountOnExit: true }} >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
               <Typography>{`Nombre : ${famille_?.length}`}</Typography>
            </AccordionSummary>
             <AccordionDetails>
                <div>
                  <table className={` ${classes.TableContent}`}>
                    <thead  className={` ${classes.tableHeader}`}>
                      <tr>
                        <th className={` ${classes.TableContentThTd}`}>N°</th>
                        <th className={` ${classes.TableContentThTd}`}>FAMILLE </th>
                        <th className={` ${classes.TableContentThTd}`}>NOMBRE EQUIPEMENT </th>
                      </tr>
                    </thead>
                    <tbody>
                      {famille_ && famille_?.map((famille__,index) =>{
                        return <tr key={index}>
                                  <td className={` ${classes.TableContentThTd}`}>{index+1}</td>
                                  <td className={` ${classes.TableContentThTd}`}>{famille__?.nom_famille}</td>
                                  <td className={` ${classes.TableContentThTd}`}>{famille__?.equipement?.length}</td>
                              </tr>
                      })          
                      }
                    </tbody>
                  </table>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      )
}

    const columns = [
      { field: 'id', headerName: 'ID', minWidth: 100, flex: 1 , hide:true},
      {
        field: 'nom_service',
        headerName: 'SERVICE',
        minWidth: 110,
        flex: 1,
        editable: false,
      },
      {
        field: 'description',
        headerName: 'DESCRIPTION',
        // type: 'number',
        headerAlign: "center",
        minWidth: 90,
        flex: 1,
        editable: false
      },
      {
        field: 'famille',
        headerName: 'FAMILLE',
        sortable: false,
        minWidth: 400,
        flex: 1,
        renderCell: getFamille
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
                <IconButton onClick={ ()=> editService(data)} >
                  <Edit style={{width:40, height:50}} fill="#5D6061" />
                </IconButton>
            </Box>
            <Box>
              <IconButton onClick={()=>deleteService(data)} >
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
      <Box sx={{ height: 700, width: '100%', marginTop:0 }}>
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
          getRowHeight={() => 'auto'}
          loading={isLoading}
        />
      </Box>
    );
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      {showAddService && <AddService openModal={showAddService} closeModal={setShowAddService} refresh={getService}/>}
      {showEditService && <EditService openModal={showEditService} closeModal={setShowEditService} refresh={getService} data={editData} />}
      <div style={{paddingTop:50}}>
      <HeaderLabel title="SERVICE"/>
        <ButtonComponent color='root' function={addService} name_of_btn="NOUVEAU" icon={<PersonAddAltIcon />} />
      </div>
      <div>
        <TableService data={serviceData}/>
      </div>
    </div>
  );
};

export default ListService;
