import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { MaintenanceGabFilter, ButtonComponent,AlertToast ,AlertConfirm ,LoadingComponent } from '../../components';
import {Accordion,AccordionSummary,AccordionDetails,Typography} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import {ReactComponent  as Edit}  from '../../assets/images/edit.svg'
import {ReactComponent  as Delete}  from '../../assets/images/delete.svg'
import {ReactComponent  as Info}  from '../../assets/images/info.svg'
import maintenanceGabStyle from './maintenanceGabStyle';
import { DataGrid , GridToolbar , GridToolbarContainer , GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IconButton,Stack } from '@mui/material';
import filterFunction from "../../filterFunction";
import { ReactComponent as Renew } from "../../assets/images/renew.svg";
import { exportExcelMaintenanceGab} from '../../export/exportExcel';

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
var moment = require('moment');
moment.locale('fr');

const ListMaintenanceGab = () => {
  useEffect(()=>{
    getMaintenanceGab()
  },[])

  const defaultFilter = ()=>({
    province:0,
    ville:0,
    client:0,
    statut:0,
    date_range : 0,
    quarter: 0,
    num_facture: 0,
    redevance:0,
    annee_contrat: moment().format('YYYY'), // return string
    date_debut:moment().startOf('year'),
    date_fin:moment().endOf('year')
})

  const TOUS = 0
  const [filter, setFilter]= useState(defaultFilter())
  const [contratData, setContratData] = useState([]);
  const [contratDataFiltered, setContratDataFiltered] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const classes = maintenanceGabStyle()
  const navigate= useNavigate()

  const getListFiltered = (filter) => {
    setFilter(filter)
    getMaintenanceGab(filter);
  };

  const getMaintenanceGab = async (filter) => {
    if (!filter) {
      filter = defaultFilter();
    }

    const handleProvince = (item) =>
    !filter.province || item?.client?.ville?.province?.id==filter.province

    const handleVille = (item) => !filter.ville || item?.client?.ville_id===filter.ville

    const handleClient = (item) => !filter.client || item?.client_id===filter.client

    const handleStatut = (item) =>
    !filter.statut || filter.statut== item.statut

    let isDateBefore = (dateBefore,dateAfter)=> moment(dateBefore).isSameOrBefore(moment(dateAfter),"day") ? true : false
    let isDateAfter = (dateAfter,dateBefore)=> moment(dateAfter).isSameOrAfter(moment(dateBefore),"day") ? true : false
    
    const handleDate = (item) => { 
      let checkBefore = isDateBefore(moment(filter.date_debut,'L').format('YYYY-MM-DD'),item.date_debut)
      let checkAfter = isDateAfter(moment(filter.date_fin,'L').format('YYYY-MM-DD'),item.date_debut)
      return checkBefore && checkAfter
    }
    
    const handleQuarter = (item) => {
      return !!item.redevance_gab.find((redevance) => {
        if (filter.quarter == 0) return true;
        if (redevance.type === filter.quarter) {
          item.redevance_gab =
            item.redevance_gab.filter(
              (red) => red.type === filter.quarter
            );
          return true;
        }
        return false;
      });
    };

    const handleNumFacture= (item) => {
      return !!item.redevance_gab.find((redevance) => {
        if (filter.num_facture == 0) return true;
        if (filter.num_facture == 1) {
          if (redevance.num_facture !== null) {
            item.redevance_gab =
            item.redevance_gab.filter(
              (red) => red?.num_facture !== null
            );
            return true;
          }
          return false
        }
        if (filter.num_facture == 2) {
          if (redevance.num_facture === null) {
            item.redevance_gab =
            item.redevance_gab.filter(
              (red) => red.num_facture === null
            );
            return true;
          }
          return false
        }
       return false;
      });
    };
    const handleRedevanceStatut= (item) => {
      return !!item.redevance_gab.find((redevance) => {
        if (filter.redevance == 0) return true;
        if (filter.redevance == 1) {
          if (redevance.isPaid !== false) {
            item.redevance_gab =
            item.redevance_gab.filter(
              (red) => red?.isPaid !== false
            );
            return true;
          }
          return false
        }
        if (filter.redevance == 2) {
          if (redevance.isPaid === false) {
            item.redevance_gab =
            item.redevance_gab.filter(
              (red) => red.isPaid === false
            );
            return true;
          }
          return false
        }
       return false;
      });
    };

    // const checking = [handleProvince,handleVille,handleStatut,handleClient,handleDate,handleQuarter];
    const checking = [handleProvince,handleVille,handleStatut,handleClient,handleDate,handleQuarter,handleNumFacture,handleRedevanceStatut];

    try {
      const {data} = await axios.get(`${API_URL}/api/contrat_maintenance_gab`)
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

  const addMaintenanceGab = ()=>{
    navigate('/contrat_de_maintenance_gab/ajout');
  }
  const deleteMaintenanceGab = async ({id})=>{
     AlertConfirm("warning","Suppression").then(async (res)=>{
      if(res.isConfirmed){
        try {
          const data_ = await axios.delete(`${API_URL}/api/contrat_maintenance_gab/${id}`)
          let {status,message} = data_.data
          if(status==="success"){
            await getMaintenanceGab()
            AlertToast("success",message)
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

  const editMaintenanceGab = (data)=>{
    navigate(`edit/${data.id}`, {state: data})
  }

  const info = (data)=>{
    navigate(`detail/${data.id}`, {state: data})
  }

  const renewMaintenance = (data) => {
    navigate(`renew/${data.id}`, { state: data });
  };

  //table MAINTENANCE GAB design TableGarantie
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
    
    function getNomClient(params) {
      const nom_client = params.row?.client?.nom_client
      return nom_client
    }
    function getVilleClient(params) {
      const nom_client = params.row?.client?.ville?.nom_ville
      return nom_client
    }
    // function getStatut(params) {
    //   const statut = params.row?.statut
    //   return statut
    // }
    const RenderStatut = ( params ) => {
      let colorStatut = params.data?.statut === "Valide" ? "#006635" : "#992600"
      const statutStyle = {
        color: colorStatut
      };
    
      return (
        <Box>
            <Typography style={statutStyle}>
               {params.data?.statut}
            </Typography>
        </Box>
      );
    };

    function getProvinceClient(params) {
      const province = params.row?.client?.ville?.province?.nom_province
      return province
    }
    function getDateDebutContrat(params) {
      const date_debut = params.row?.date_debut
      return date_format(date_debut)
    }
    function getDateFin(params) {
      const date_fin = params.row?.date_fin
      return date_format(date_fin)
    }
    function getInformation(params) {
          return (
            <Box component='div'>
              <p >{`${params?.row?.equipement?.num_serie} | ${params?.row?.equipement?.marque} | ${params?.row?.equipement?.modele}`}</p>
            </Box>
          )
    }

    function getInformationRedevance(params) {
      let redevance_ = params.row?.redevance_gab
      return (
        <div>
          <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
               <Typography>{`TRIMESTRE : ${redevance_?.length}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div>
                  <table className={` ${classes.TableContent}`}>
                    <thead  className={` ${classes.tableHeader}`}>
                      <tr>
                        <th className={` ${classes.TableContentThTd}`}>N° </th>
                        <th className={` ${classes.TableContentThTd}`}>QUARTER </th>
                        <th className={` ${classes.TableContentThTd}`}>MONTANT</th>
                        <th className={` ${classes.TableContentThTd}`}>NUM_FACTURE</th>
                        <th className={` ${classes.TableContentThTd}`}>DATE_FACTURE</th>
                        <th className={` ${classes.TableContentThTd}`}>STATUT</th>
                        {/* <th className={` ${classes.TableContentThTd}`}>FAMILE</th>
                        <th className={` ${classes.TableContentThTd}`}>SERVICE</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {redevance_ && redevance_?.map((redevance,index) =>{
                        return <tr key={index}>
                                  <td className={` ${classes.TableContentThTd}`}>{index+1}</td>
                                  <td className={` ${classes.TableContentThTd}`}>{redevance?.type}</td>
                                  <td className={` ${classes.TableContentThTd}`}>{redevance?.montant}</td>
                                  <td className={` ${classes.TableContentThTd}`}>{redevance.num_facture ? redevance.num_facture : "Non Facturé"}</td>
                                  <td className={` ${classes.TableContentThTd}`}>{redevance.date_facture ? moment(redevance.date_facture).format('L') : "Non precisé"}</td>
                                  <td className={` ${classes.TableContentThTd}`}>{redevance.isPaid ? "Payé" : "Non Payé"}</td>
                                  {/* <td className={` ${classes.TableContentThTd}`}>{contrat.equipement.famille.nom_famille}</td>
                                  <td className={` ${classes.TableContentThTd}`}>{contrat.equipement.famille.service.nom_service}</td> */}
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
        field: 'nom_client',
        headerName: 'CLIENT',
        minWidth: 110,
        flex: 1,
        editable: false,
        sortable: true,
        valueGetter : getNomClient
      },
      {
        field: 'date_debut',
        headerName: 'DEBUT',
        minWidth: 170,
        flex: 1,
        editable: false,
        sortable: true,
        align:'center',
        headerAlign: "center",
        valueGetter: getDateDebutContrat
      },
      {
        field: 'date_fin',
        headerName: 'FIN',
        minWidth: 120,
        flex: 1,
        editable: false,
        sortable: true,
        align:'center',
        headerAlign: "center",
        valueGetter: getDateFin
      },
      {
        field: 'statut',
        headerName: 'STATUT',
        minWidth: 80,
        flex: 1,
        editable: false,
        align:'center',
        headerAlign: "center",
        renderCell: (cellValue) => <RenderStatut data={cellValue.row} />
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
        field: 'information_redevance',
        headerName: 'REDEVANCE',
        minWidth: 600,
        flex: 1,
        editable: false,
        align:'center',
        headerAlign: "center",
        renderCell: getInformationRedevance
      },
      // {
      //   field: 'redevance_totale',
      //   headerName: 'REDEVANCE',
      //   minWidth: 150,
      //   flex: 1,
      //   editable: false,
      //   sortable: true,
      //   align:'center',
      //   headerAlign: "center",
      //   // renderCell : getDureeGarantie
      // },
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
              <IconButton onClick={() => renewMaintenance(data)}>
                <Renew style={{ width: 45, height: 50 }} />
              </IconButton>
            </Box>
            <Box>
                <IconButton onClick={ ()=> info(data)} >
                  <Info style={{width:40, height:50}} />
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={ ()=> editMaintenanceGab(data)} >
                  <Edit style={{width:40, height:50}} fill="#5D6061" />
                </IconButton>
            </Box>
            <Box>
            <IconButton onClick={()=>deleteMaintenanceGab(data)} >
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
          sx={datagridSx}
          autoHeight={true}  
          getRowHeight={() => 'auto'}
          loading={isLoading}
          components={{ 
            Toolbar: Search,
            NoRowsOverlay: NoRowsOverlay,
            LoadingOverlay: LoadingComponent
          }}
        />
      </Box>
    );
  }

  //export 
  const handleExportPdf = ()=>{
    // console.log("EXPORT PDF LISTENER inside the component ListMaintenanceGab : ");
  }

  const handleExportExcel = ()=>{
    // console.log("EXPORT EXCEL LISTENER inside the component ListMaintenanceGab : ");
    exportExcelMaintenanceGab(contratDataFiltered)
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <MaintenanceGabFilter 
        filterOption={getListFiltered}
        filterData = {filter}
        exportPdf={handleExportPdf}
        exportExcel={handleExportExcel}/>

      <div style={{paddingTop:50}}>
        <ButtonComponent color='root' function={addMaintenanceGab} name_of_btn="NOUVEAU" icon={<PersonAddAltIcon/>}/>
      </div>
      <div>
        {/* <TableGarantie data={contratData}/> */}
        <TableGarantie data={contratDataFiltered}/>
      </div>
    </div>
  );
};

export default ListMaintenanceGab;
