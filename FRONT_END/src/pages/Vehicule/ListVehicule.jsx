import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { LivraisonFilter, ButtonComponent,AlertToast ,AlertConfirm,LoadingComponent  } from '../../components';
import {Accordion,AccordionSummary,AccordionDetails,Typography} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import globalStyle from '../../Style/globalStyle';
import {ReactComponent  as Edit}  from '../../assets/images/edit.svg'
import {ReactComponent  as Delete}  from '../../assets/images/delete.svg'
import {ReactComponent  as Info}  from '../../assets/images/info.svg'
import { DataGrid , GridToolbarContainer, GridToolbarQuickFilter} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IconButton,Stack } from '@mui/material';
import filterFunction from "../../filterFunction";
import { exportExcelLivraison} from '../../export/exportExcel';

var moment = require('moment');
moment.locale('fr');
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const ListVehicule = () => {

  const classes = globalStyle();
  const navigate = useNavigate()

  useEffect(()=>{
    getVehicule()
  },[])

  const defaultFilter = ()=>({
    province:0,
    service:0,
    famille:0,
    garantie:0,
    date_debut_livraison:moment().startOf('year'),
    date_fin_livraison:moment().endOf('year'),
})

  const [filter, setFilter]= useState(defaultFilter())
  const [carsData,setcarsData] = useState([])
  const [carsDataFiltered,setcarsDataFiltered] = useState([])
  const [isLoading,setIsLoading] = useState(true);
  
  const getListFiltered = (filter) => {
    setFilter(filter)
    getVehicule(filter);
  };
  
  const getVehicule = async () => {
    try {
      const {data} = await axios.get(`${API_URL}/api/car/findAll`)
      console.warn("dataaaa:", data.data);
        setcarsData(data.data)
        setIsLoading(false)

      // if (data.status==="success") {
      //   const newArray = filterFunction(data.data, checking);
      //   setcarsData(data.data)
      //   setIsLoading(false)
      //   setcarsDataFiltered(newArray);
      // }

    } catch (error) {
      console.log("error while getVehiculeRequest:", error);
    }
    
  };
  // const getVehicule = async (filter) => {
  //   if (!filter) {
  //     filter = defaultFilter();
  //   }

  //   const handleProvince = (item) =>
  //   !filter.province || item?.client?.ville?.province?.id===filter.province

  //   const handleFamille= (item) => {
  //     return !!item.equipement.find((equipement) => {
  //       if (filter.famille === 0) return true;
  //       if (equipement.famille.id === filter.famille) {
  //         item.equipement =
  //           item.equipement.filter(
  //             (equip) => equip.famille.id === filter.famille
  //           );
  //         return true;
  //       }
  //       return false;
  //     });
  //   };

  //   const handleService= (item) => {
  //     return !!item.equipement.find((equipement) => {
  //       if (filter.service === 0) return true;
  //       if (equipement.famille.service_id === filter.service) {
  //         item.equipement =
  //           item.equipement.filter(
  //             (equip) => equip.famille.service_id  === filter.service
  //           );
  //         return true;
  //       }
  //       return false;
  //     });
  //   };

  //   const handleGarantie= (item) => {
  //     return !!item.equipement.find((equipement) => {
  //       if (filter.garantie === 0) return true;
  //       if (filter.garantie === 1) {
  //         if (equipement.duree_garantie !== null) {
  //           item.equipement =
  //           item.equipement.filter(
  //             (equip) => equip.duree_garantie !== null
  //           );
  //           return true;
  //         }
  //         return false
  //       }
  //       if (filter.garantie === 2) {
  //         if (equipement.duree_garantie === null) {
  //           item.equipement =
  //           item.equipement.filter(
  //             (equip) => equip.duree_garantie === null
  //           );
  //           return true;
  //         }
  //         return false
  //       }
  //      return false;
  //     });
  //   };

  //   let isDateBefore = (dateBefore,dateAfter)=> moment(dateBefore).isSameOrBefore(moment(dateAfter),"day") ? true : false
  //   let isDateAfter = (dateAfter,dateBefore)=> moment(dateAfter).isSameOrAfter(moment(dateBefore),"day") ? true : false
    
  //   const handleDate = (item) => {
  //     let checkBefore = isDateBefore(moment(filter.date_debut_livraison,'L').format('YYYY-MM-DD'),item?.date_livraison)
  //     let checkAfter = isDateAfter(moment(filter.date_fin_livraison,'L').format('YYYY-MM-DD'),item?.date_livraison)
  //     return checkBefore && checkAfter
  //   }

  //   const checking = [handleProvince,handleFamille,handleService,handleGarantie,handleDate];

  //   try {
  //     const {data} = await axios.get(`${API_URL}/vehicule`)
  //     if (data.status==="success") {
  //       const newArray = filterFunction(data.data, checking);
  //       setcarsData(data.data)
  //       setcarsDataFiltered(newArray);
  //       setIsLoading(false)
  //     }
  //   } catch (error) {
  //     console.log("error while getVehiculeRequest:", error);
  //   }

  // };

  const AddVehicule = ()=>{
    navigate('/vehicule/ajout');
  }

  const deleteVehicule = async ({IdVehicule})=>{
     AlertConfirm("warning","Suppression").then(async (res)=>{
      if(res.isConfirmed){
        try {
          const data_ = await axios.delete(`${API_URL}/api/car/delete/${IdVehicule}`)
          let {status,message} = data_.data
          if(status==="success"){
            AlertToast("success",message)
            await getVehicule()
        }
       } catch ({response}) {
          console.log("error while deleteVehiculeRequest:", response);
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

  const editVehicule = (data)=>{
    navigate(`edit/${data.IdVehicule}`, {state: data})
  }

  const detailVehicule = (data)=>{
    navigate(`detail/${data.IdVehicule}`, {state: data})
  }

  // design Table Livraison
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

  const date_format = (date,stringFormat="DD/MM/YYYY")=>{
    let date_formatted = moment(new Date(date), stringFormat).format(stringFormat)
    return date_formatted;
  }

  //table Vehicule
  const TableVehicule = ({data})=> {

    // const TableContent = {
    //   fontFamily: "Arial, Helvetica, sans-serif",
    //   borderCollapse: "collapse",
    //   width: "100%"
    // }
  
    // const TableContentThTd = {
    //   border: "1px solid #ddd",
    //   padding: 8,
    //   textAlign: "left",
    // }


    function getDateArrivee(params) {
      // return ""
      const DateArriveeAuPort =  params.row.DateArriveeAuPort
      return date_format(DateArriveeAuPort);
    }

    const columns = [
      { field: 'IdVehicule', headerName: 'ID', minWidth: 100, flex: 1 , hide:true},
      {
        field: 'Matricule',
        headerName: 'MATRICULE',
        minWidth: 130,
        flex: 1,
        editable: false,
        sortable: true,
      },
      {
        field: 'Marque',
        headerName: 'MARQUE',
        minWidth: 140,
        // headerAlign: "center",
        flex: 1,
        editable: false,
        // textAlign:"center",
      },
      {
        field: 'Version',
        headerName: 'VERSION',
        minWidth: 110,
        flex: 1,
        editable: false,
        sortable: true
      },
      {
        field: 'EtatVehicule',
        headerName: 'ETAT',
        minWidth: 120,
        flex: 1,
        editable: false,
        sortable: true
      },
      {
        field: 'PoidsVehicule',
        headerName: 'POIDS VEHICULE',
        minWidth: 140,
        flex: 1,
        editable: false,
        sortable: true,
        headerAlign: "center",
        align: "center",
      },
      {
        field: 'PoidsColis',
        headerName: 'POIDS COLIS',
        minWidth: 130,
        flex: 1,
        editable: false,
        sortable: true,
        headerAlign: "center",
        align: "center",
      },
      {
        field: 'Amorcage',
        headerName: 'AMORCAGE',
        minWidth: 100,
        flex: 1,
        editable: false,
        sortable: true
      },
      {
        field: 'DateArriveeAuPort',
        headerName: 'DATE ARRIVEE',
        minWidth: 130,
        flex: 1,
        editable: false,
        sortable: true,
        valueGetter: getDateArrivee
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
                <IconButton onClick={ ()=> detailVehicule(data)} >
                  <Info style={{width:40, height:50}} />
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={ ()=> editVehicule(data)} >
                  <Edit style={{width:40, height:50}} fill="#5D6061" />
                </IconButton>
            </Box>
            <Box>
            <IconButton onClick={()=>deleteVehicule(data)} >
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
          getRowHeight={() => 'auto'}
          loading={isLoading}
          getRowId={(row)=>(row.IdVehicule)}
        />
      </Box>
    );
  }

  //export 
  const handleExportPdf = ()=>{
    // console.log("EXPORT PDF LISTENER inside the component ListVehicule : ");
  }

  const handleExportExcel = ()=>{
    // console.log("EXPORT EXCEL LISTENER inside the component ListVehicule : ");
    exportExcelLivraison(carsDataFiltered,filter.date_debut_livraison,filter.date_fin_livraison)
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <LivraisonFilter 
        filterOption={getListFiltered}
        filterData = {filter}
        exportPdf={handleExportPdf}
        exportExcel={handleExportExcel}
      />
      <div style={{paddingTop:50}}>
        <ButtonComponent color='root' function={AddVehicule} name_of_btn="NOUVEAU" icon={<PersonAddAltIcon/>}/>
      </div>
      <div>
        <TableVehicule data={carsData}/>
      </div>
    </div>
  );
};

export default ListVehicule;
