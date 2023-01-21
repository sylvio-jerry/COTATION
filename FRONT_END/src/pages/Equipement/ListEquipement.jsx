import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { EquipementFilter, ButtonComponent,AlertToast ,AlertConfirm, LoadingComponent } from '../../components';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useNavigate } from 'react-router-dom';
import {ReactComponent  as Edit}  from '../../assets/images/edit.svg'
import {ReactComponent  as Delete}  from '../../assets/images/delete.svg'
import {ReactComponent  as Info}  from '../../assets/images/info.svg'
import globalStyle from '../../Style/globalStyle';
import { DataGrid , GridToolbar , GridToolbarContainer , GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IconButton,Stack } from '@mui/material';
import filterFunction from "../../filterFunction";
import { exportExcelEquipement} from '../../export/exportExcel';

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const ListEquipement = () => {

  const defaultFilter = ()=>({
    service:0,
    famille:0,
    garantie:0,
    disposition:0
})
  const TOUS = 0
  const [filter, setFilter]= useState(defaultFilter())
  const [equipementData,setEquipementData] = useState([])
  const [equipementDataFiltered,setEquipementDataFiltered] = useState([])
  const [isLoading,setIsLoading] = useState(true);

  useEffect(()=>{
    getEquipement()
  },[])

  const classes = globalStyle()
  const navigate= useNavigate()

  const getListFiltered = (filter) => {
    setFilter(filter)
    getEquipement(filter);
  };
  
  const getEquipement = async (filter) => {
    if (!filter) {
      filter = defaultFilter();
    }

    const handleService= (item) => {
        if (filter.service == 0) return true;
        if (item.famille.service_id === filter.service) {
          return true;
        }
        return false;
      };
    const handleFamille= (item) => {
        if (filter.famille == 0) return true;
        if (item.famille.id === filter.famille) {
          return true;
        }
        return false;
      };

    const handleGarantie= (item) => {
        if (filter.garantie == 0) return true;
        if (filter.garantie == 1) {
          if (item.duree_garantie !== null) {
            return true;
          }
          return false
        }
        if (filter.garantie == 2) {
          if (item.duree_garantie === null) {
            return true;
          }
          return false
        }
    };
    const handleDisposition= (item) => {
        if (filter.disposition == 0) return true;
        if (filter.disposition == 1) {
          if (item.is_locale) {
            return true;
          }
          return false
        }
        if (filter.disposition == 2) {
          if (!item.is_locale) {
            return true;
          }
          return false
        }
    };
    const checking = [handleGarantie,handleService,handleFamille,handleDisposition];

    try {
      const {data} = await axios.get(`${API_URL}/api/equipement`)
      if (data.status==="success") {
        const newArray = filterFunction(data.data, checking);
        setEquipementData(data.data)
        setEquipementDataFiltered(newArray);
        setIsLoading(false)
      }
    } catch (error) {
      console.log("error while getEquipementRequest:", error);
    }
  };
  const addEquipement = ()=>{
    navigate('/equipement/ajout');
  }

  const deleteEquipement = async ({id})=>{
     AlertConfirm("warning","Suppression").then(async (res)=>{
      if(res.isConfirmed){
        try {
          const data_ = await axios.delete(`${API_URL}/api/equipement/${id}`)
          let {status,message} = data_.data
          if(status==="success"){
            AlertToast("success",message)
            await getEquipement()
        }
       } catch ({response}) {
          console.log("error while deleteEquipementRequest:", response);
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

  const editEquipement = (data)=>{
    navigate(`edit/${data.id}`, {state: data})
  }

  const infoEquipement = (data)=>{
    navigate(`detail/${data.id}`, {state: data})
  }

  //table equipement design TableEquipement
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

  //TableEquipement
  const TableEquipement = ({data})=> {
    const rows = data || []

    const getDisposition = (params)=>{
      let dispo = params.row.is_locale ? "Interne" : "Externe"
      return dispo;
    }
    const getFamille_ = (params)=>{
      let dispo = params.row.famille.nom_famille 
      return dispo;
    }
    const getService_ = (params)=>{
      let dispo = params.row.famille.service.nom_service 
      return dispo;
    }
    const getDureeGarantie = (params)=>{
      let garantie = params.row.duree_garantie ? `${params.row.duree_garantie} Mois` : "Pas de garantie"
      return garantie;
    }

    const columns = [
      { field: 'id', headerName: 'ID', minWidth: 100, flex: 1 , hide:true},
      {
        field: 'num_serie',
        headerName: 'N° SERIE',
        minWidth: 110,
        flex: 1,
        editable: false,
        sortable: false,
      },
      {
        field: 'marque',
        headerName: 'MARQUE',
        minWidth: 110,
        headerAlign: "center",
        flex: 1,
        editable: false,
        align:'center'
      },
      {
        field: 'modele',
        headerName: 'MODELE',
        type: 'number',
        headerAlign: "center",
        minWidth: 90,
        flex: 1,
        editable: false,
        align:'center',
      },
      // {
      //   field: 'famille',
      //   headerName: 'FAMILLE',
      //   minWidth: 150,
      //   flex: 1,
      //   editable: false,
      //   valueGetter: getFamille_
      // },
      // {
      //   field: 'service',
      //   headerName: 'SERVICE',
      //   minWidth: 150,
      //   flex: 1,
      //   editable: false,
      //   valueGetter: getService_
      // },
      {
        field: 'duree_garantie',
        headerName: 'GARANTIE',
        minWidth: 150,
        flex: 1,
        editable: false,
        valueGetter: getDureeGarantie
      },
      {
        field: 'is_locale',
        headerName: 'DISPOSITION',
        minWidth: 110,
        flex: 1,
        headerAlign: "center",
        align:'center',
        valueGetter: getDisposition
      },
      {
        field: 'ACTION',
        minWidth: 200,
        flex: 1,
        textAlign: "center",
        headerAlign: "center",
        renderCell: (cellValue)=><ActionButton data={cellValue.row}/> 
      }
    ];
    
    const  ActionButton = ({data}) => {
      const actionStyle = {
        display:"flex",
        justifyContent:"space-evenly",
        flex:1
      }
      return (
          <Box style={actionStyle}>
            <Box>
                <IconButton onClick={ ()=> infoEquipement(data)} >
                  <Info style={{width:40, height:50}} />
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={ ()=> editEquipement(data)} >
                  <Edit style={{width:40, height:50}} fill="#5D6061" />
                </IconButton>
            </Box>
            <Box>
            <IconButton onClick={()=>deleteEquipement(data)} >
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
      <Box sx={{  width: '100%',marginTop:0 }}>
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

  //export 
  const handleExportPdf = ()=>{
    // console.log("EXPORT PDF LISTENER inside the component listEquipement : ");
  }

  const handleExportExcel = ()=>{
    exportExcelEquipement(equipementDataFiltered)
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <EquipementFilter
         filterOption={getListFiltered}
         filterData = {filter}
        exportPdf={handleExportPdf}
        exportExcel={handleExportExcel}/>
      <div style={{paddingTop:50}}>
        <ButtonComponent color='root' function={addEquipement} name_of_btn="NOUVEAU" icon={<PersonAddAltIcon />}/>
      </div>
      <div>
        <TableEquipement data={equipementDataFiltered} />
      </div>
    </div>
  );
};

export default ListEquipement;
