import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { GarantieGabFilter, ButtonComponent,AlertToast ,AlertConfirm,LoadingComponent  } from '../../components';
import {Typography} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { useNavigate } from 'react-router-dom';
import {ReactComponent  as Edit}  from '../../assets/images/edit.svg'
import {ReactComponent  as Delete}  from '../../assets/images/delete.svg'
import {ReactComponent  as Info}  from '../../assets/images/info.svg'
import { DataGrid , GridToolbarContainer, GridToolbarQuickFilter} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IconButton,Stack } from '@mui/material';
import filterFunction from "../../filterFunction";
import { exportExcelGarantieGab} from '../../export/exportExcel';

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
var moment = require('moment');
moment.locale('fr');

const ListGarantieGab = () => {
  useEffect(()=>{
    getGarantieGab()
  },[])

  const defaultFilter = ()=>({
    province:0,
    ville:0,
    client:0,
    statut:0,
    date_installation:moment().startOf('year'),
    date_fin_installation:moment().endOf('year')
  })

  const [filter, setFilter]= useState(defaultFilter())
  const [contratData, setContratData] = useState([]);
  const [contratDataFiltered, setContratDataFiltered] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const navigate= useNavigate()

  const getListFiltered = (filter) => {
    setFilter(filter)
    getGarantieGab(filter);
  };

  const getGarantieGab = async (filter) => {
    if (!filter) {
      filter = defaultFilter();
    }

    const handleProvince = (item) =>
    !filter.province || item?.livraison?.client?.ville?.province?.id===filter.province

    const handleVille = (item) => !filter.ville || item?.livraison?.client?.ville_id===filter.ville

    const handleClient = (item) => !filter.client || item?.livraison?.client_id===filter.client
    
    const handleStatut = (item) =>
    !filter.statut || filter.statut === item.statut

    let isDateBefore = (dateBefore,dateAfter)=> moment(dateBefore).isSameOrBefore(moment(dateAfter),"day") ? true : false
    let isDateAfter = (dateAfter,dateBefore)=> moment(dateAfter).isSameOrAfter(moment(dateBefore),"day") ? true : false
    
    const handleDate = (item) => {

      let checkBefore = isDateBefore(moment(filter.date_installation,'L').format('YYYY-MM-DD'),item.date_installation)
      let checkAfter = isDateAfter(moment(filter.date_fin_installation,'L').format('YYYY-MM-DD'),item.date_installation)

       return checkBefore && checkAfter
    }

    const checking = [handleProvince,handleVille,handleStatut,handleClient,handleDate];

    try {
      const {data} = await axios.get(`${API_URL}/api/contrat_garantie_gab`)
      if (data.status==="success") {
        const newArray = filterFunction(data.data, checking);
        setContratData(data.data);
        setContratDataFiltered(newArray);
        setIsLoading(false)
      }
    } catch (error) {
      console.log("error while getGarantieRequest:", error);
    }
  };

  const addGarantie = ()=>{
    navigate('/contrat_de_garantie_gab/ajout');
  }
  const deleteGarantie = async ({id})=>{
     AlertConfirm("warning","Suppression").then(async (res)=>{
      if(res.isConfirmed){
        try {
          const data_ = await axios.delete(`${API_URL}/api/contrat_garantie_gab/${id}`)
          let {status,message} = data_.data
          if(status==="success"){
            AlertToast("success",message)
            await getGarantieGab()
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

  const editGarantie = (data)=>{
    navigate(`edit/${data.id}`, {state: data})
  }

  const infoGarantie = (data)=>{
    navigate(`detail/${data.id}`, {state: data})
  }

  //table GARANTIE design TableGarantie
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

  const date_format = (date, stringFormat = "DD/MM/YYYY") => {
    let date_formatted = moment(new Date(date), stringFormat).format(
      stringFormat
    );
    return date_formatted;
  };

  //table Garantie
  const TableGarantie = ({data})=> {
    
    // function getNumLivraison(params) {
    //   const num_bon_livraison = params.row?.livraison?.num_bon_livraison
    //   return num_bon_livraison
    // }

    function getDayLeft(params) {
      let date_today = moment()
      let date_fin = moment(new Date(params.row?.date_fin))
      let dayLeft = date_fin.diff(date_today,'days')
      if (dayLeft > 0 && dayLeft < 60){
        dayLeft = "dans "+dayLeft + " Jour"
      }
      else{
        dayLeft = date_today.to(date_fin)
      }
      return dayLeft
    }

    function getNomClient(params) {
      const nom_client = params.row?.livraison?.client?.nom_client
      return nom_client
    }
    function getVilleClient(params) {
      const nom_client = params.row?.livraison?.client?.ville?.nom_ville
      return nom_client
    }

    const RenderStatut = ( params ) => {
      let colorStatut = params.row?.statut === "Valide" ? "#006635" : "#992600"
      const statutStyle = {
        color: colorStatut
      };
    
      return (
        <Box>
            <Typography style={statutStyle}>
               {params.row?.statut}
            </Typography>
        </Box>
      );
    };


    function getProvinceClient(params) {
      const province = params.row?.livraison?.client?.ville?.province?.nom_province
      return province
    }
    function getDateInstallation(params) {
      const date_installation = params.row?.date_installation
      return date_format(date_installation)
    }
    function getDateFin(params) {
      const date_fin = params.row?.date_fin
      return date_format(date_fin)
    }
    function getInformation(params) {
          return (
            <Box component='div'>
              <p >{`${params?.row?.equipement?.num_serie} | ${params?.row?.equipement?.marque} | ${params?.row?.equipement?.modele}`}</p>
              {/* <Typography>{`${params?.row?.equipement?.marque}`}</Typography>
              <Typography>{`${params?.row?.equipement?.modele}`}</Typography>
              <Typography>{`${params?.row?.equipement?.duree_garantie}`}</Typography> */}
            </Box>
          )
    }
    function getDureeGarantie(params) {
          return (
            <Box component='div' className='' >
              <Typography>{`${params?.row?.equipement?.duree_garantie} Mois`}</Typography>
            </Box>
          )
    }

    const columns = [
      { field: 'id', headerName: 'ID', minWidth: 100, flex: 1 , hide:true},
      {
        field: 'nom_client',
        headerName: 'CLIENT',
        minWidth: 110,
        flex: 1,
        editable: false,
        sortable: true,
        valueGetter : getNomClient
      },
      {
        field: 'date_installation',
        headerName: 'DATE INSTALLATION',
        minWidth: 170,
        flex: 1,
        editable: false,
        sortable: true,
        align:'center',
        headerAlign: "center",
        valueGetter: getDateInstallation
      },
      {
        field: 'date_fin',
        headerName: 'DATE FIN',
        minWidth: 120,
        flex: 1,
        editable: false,
        sortable: true,
        align:'center',
        headerAlign: "center",
        valueGetter: getDateFin
      },
      {
        field: 'dayleft',
        headerName: 'JOUR RESTANT',
        minWidth: 130,
        flex: 1,
        editable: false,
        sortable: true,
        align:'center',
        headerAlign: "center",
        valueGetter: getDayLeft
      },
      {
        field: 'information',
        headerName: 'N° SERIE | MARQUE | MODELE',
        minWidth: 300,
        flex: 1,
        editable: false,
        align:'center',
        headerAlign: "center",
        renderCell: getInformation
      },
      {
        field: 'statut',
        headerName: 'STATUT',
        minWidth: 80,
        flex: 1,
        editable: false,
        // align:'center',
        // headerAlign: "center",
        renderCell: RenderStatut
      },
      {
        field: 'province',
        headerName: 'PROVINCE',
        minWidth: 120,
        flex: 1,
        editable: false,
        sortable: true,
        valueGetter : getProvinceClient
      },
      {
        field: 'ville',
        headerName: 'VILLE',
        minWidth: 100,
        flex: 1,
        editable: false,
        sortable: true,
        valueGetter : getVilleClient
      },
      {
        field: 'site_installation',
        headerName: 'SITE',
        minWidth: 100,
        flex: 1,
        editable: false,
        sortable: true,
        // valueGetter : getVilleClient
      },
      {
        field: 'duree_garantie_',
        headerName: 'GARANTIE',
        minWidth: 100,
        flex: 1,
        editable: false,
        sortable: true,
        align:'center',
        headerAlign: "center",
        renderCell : getDureeGarantie
      },
      // {
      //   field: 'observation',
      //   headerName: 'OBSERVATION',
      //   minWidth: 200,
      //   flex: 1,
      //   editable: false,
      //   sortable: true,
      // },
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
                <IconButton onClick={ ()=> infoGarantie(data)} >
                  <Info style={{width:40, height:50}} />
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={ ()=> editGarantie(data)} >
                  <Edit style={{width:40, height:50}} fill="#5D6061" />
                </IconButton>
            </Box>
            <Box>
            <IconButton onClick={()=>deleteGarantie(data)} >
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
        />
      </Box>
    );
  }

  //export 
  const handleExportPdf = ()=>{
    // console.log("EXPORT PDF LISTENER inside the component ListGarantieGab : ");
  }

  const handleExportExcel = ()=>{
    // console.log("EXPORT EXCEL LISTENER inside the component ListGarantieGab : ");
    exportExcelGarantieGab(contratDataFiltered,filter.date_installation,filter.date_fin_installation)
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <GarantieGabFilter 
        filterOption={getListFiltered}
        filterData = {filter}
        exportPdf={handleExportPdf}
        exportExcel={handleExportExcel}/>

      <div style={{paddingTop:50}}>
        <ButtonComponent color='root' function={addGarantie} name_of_btn="NOUVEAU" icon={<PersonAddAltIcon/>}/>
      </div>
      <div>
        <TableGarantie data={contratDataFiltered}/>
      </div>
    </div>
  );
};

export default ListGarantieGab;
