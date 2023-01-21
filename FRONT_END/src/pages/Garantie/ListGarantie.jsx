import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { ContratFilter, ButtonComponent,AlertToast ,AlertConfirm ,LoadingComponent } from '../../components';
import {Accordion,AccordionSummary,AccordionDetails,Typography} from '@mui/material';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useNavigate } from 'react-router-dom';
import {ReactComponent  as Edit}  from '../../assets/images/edit.svg'
import {ReactComponent  as Delete}  from '../../assets/images/delete.svg'
import {ReactComponent  as Info}  from '../../assets/images/info.svg'
import garantieStyle from './garantieStyle';
import { DataGrid , GridToolbar , GridToolbarContainer , GridToolbarExport, GridToolbarQuickFilter} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { IconButton,Stack } from '@mui/material';
import filterFunction from "../../filterFunction";
import { exportExcelGarantie} from '../../export/exportExcel';

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
var moment = require('moment');
moment.locale('fr');

const ListGarantie = () => {
  useEffect(()=>{
    getGarantie()
  },[])

  const defaultFilter = ()=>({
    province:0,
    service:0,
    famille:0,
    statut:0,
    client:0,
    date_debut_contrat:moment().startOf('year'),
    date_fin_contrat:moment().endOf('year'),
  })

  const TOUS = 0
  const [filter, setFilter]= useState(defaultFilter())
  const [contratData, setContratData] = useState([]);
  const [contratDataFiltered, setContratDataFiltered] = useState([]);
  const [isLoading,setIsLoading] = useState(true);
  const classes = garantieStyle()
  const navigate= useNavigate()

  const getListFiltered = (filter) => {
    setFilter(filter)
    getGarantie(filter);
  };

  const getGarantie = async (filter) => {
    if (!filter) {
      filter = defaultFilter();
    }

    const handleProvince = (item) =>
    !filter.province || item?.livraison?.client?.ville?.province?.id==filter.province

    const handleFamille= (item) => {
      return !!item.contrat_garantie_detail.find((detail) => {
        if (filter.famille == 0) return true;
        if (detail.equipement.famille.id === filter.famille) {
          item.contrat_garantie_detail =
            item.contrat_garantie_detail.filter(
              (det) => det.equipement.famille.id === filter.famille
            );
          return true;
        }
        return false;
      });
    };
    const handleStatut= (item) => {
      return !!item.contrat_garantie_detail.find((detail) => {
        if (filter.statut == 0) return true;
        if (detail.statut=== filter.statut) {
          item.contrat_garantie_detail =
            item.contrat_garantie_detail.filter(
              (det) => det.statut === filter.statut
            );
          return true;
        }
        return false;
      });
    };
    const handleService= (item) => {
      return !!item.contrat_garantie_detail.find((detail) => {
        if (filter.service == 0) return true;
        if (detail.equipement.famille.service_id === filter.service) {
          item.contrat_garantie_detail =
            item.contrat_garantie_detail.filter(
              (det) => det.equipement.famille.service_id === filter.service
            );
          return true;
        }
        return false;
      });
    };

    let isDateBefore = (dateBefore,dateAfter)=> moment(dateBefore).isSameOrBefore(moment(dateAfter),"day") ? true : false
    let isDateAfter = (dateAfter,dateBefore)=> moment(dateAfter).isSameOrAfter(moment(dateBefore),"day") ? true : false
    
    const handleDate = (item) => {
      // let date_livraison = moment(item?.livraison?.date_livraison,'YYYY-MM-DD').format('L')
      const check_it =  !!item.contrat_garantie_detail.find((detail) => {
          let checkBefore = isDateBefore(moment(filter.date_debut_contrat,'L').format('YYYY-MM-DD'),detail?.date_debut)
          let checkAfter = isDateAfter(moment(filter.date_fin_contrat,'L').format('YYYY-MM-DD'),detail?.date_fin)

          if (checkBefore && checkAfter) {
            item.contrat_garantie_detail =
              item.contrat_garantie_detail.filter(
                (de) => (
                    isDateBefore(moment(filter.date_debut_contrat,'L').format('YYYY-MM-DD'),de?.date_debut) &&
                    isDateAfter(moment(filter.date_fin_contrat,'L').format('YYYY-MM-DD'),de?.date_fin)
                  )
              );
            return true;
          }
          return false
        }
      )
      return check_it
    }

    const handleClient = (item) => !filter.client || item?.livraison?.client_id===filter.client
    const checking = [handleProvince,handleFamille,handleService,handleStatut,handleDate,handleClient];

    try {
      const {data} = await axios.get(`${API_URL}/api/contrat_garantie`)
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
    navigate('/contrat_de_garantie/ajout');
  }
  const deleteGarantie = async ({id})=>{
     AlertConfirm("warning","Suppression").then(async (res)=>{
      if(res.isConfirmed){
        try {
          const data_ = await axios.delete(`${API_URL}/api/contrat_garantie/${id}`)
          let {status,message} = data_.data
          if(status==="success"){
            AlertToast("success",message)
            await getGarantie()
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
    function getDayLeft(date_fin_) {
      let date_today = moment()
      let date_fin = moment(new Date(date_fin_))
      let dayLeft = date_fin.diff(date_today,'days')
      if (dayLeft > 0 && dayLeft < 60){
        dayLeft = "dans "+dayLeft + " Jour"
      }
      else{
        dayLeft = date_today.to(date_fin)
      }
      return dayLeft
    }

    function getNumLivraison(params) {
      const num_bon_livraison = params.row?.livraison?.num_bon_livraison
      return num_bon_livraison
    }
    function getNomClient(params) {
      const nom_client = params.row?.livraison?.client?.nom_client
      return nom_client
    }
    function getAdresseClient(params) {
      const nom_client = params.row?.livraison?.client?.adresse
      return nom_client
    }
    function getVilleClient(params) {
      const ville = params.row?.livraison?.client?.ville?.nom_ville
      return ville
    }
    function getProvinceClient(params) {
      const province = params.row?.livraison?.client?.ville?.province?.nom_province
      return province
    }

    const RenderStatut = ( {statut} ) => {
      let colorStatut = statut === "Valide" ? "#006635" : "#992600"
      const statutStyle = {
        color: colorStatut
      };
  
      return (
        <Box>
            <Typography style={statutStyle}>
               {statut}
            </Typography>
        </Box>
      );
    };
    
    function getEquipement(params) {
          let contrat_detail = params.row?.contrat_garantie_detail?.filter(el=>params.row.id === el.contrat_garantie_id)
          return (
            <div>
              <Accordion TransitionProps={{ unmountOnExit: true }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                   <Typography>{`Nombre : ${contrat_detail?.length}`}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <div>
                      <table className={` ${classes.TableContent}`}>
                        <thead  className={` ${classes.tableHeader}`}>
                          <tr>
                            {/* <th className={` ${classes.TableContentThTd}`}>N° </th> */}
                            <th className={` ${classes.TableContentThTd}`}>N° SERIE </th>
                            {/* <th className={` ${classes.TableContentThTd}`}>MARQUE</th> */}
                            {/* <th className={` ${classes.TableContentThTd}`}>MODELE</th> */}
                            <th className={` ${classes.TableContentThTd}`}>DEBUT</th>
                            <th className={` ${classes.TableContentThTd}`}>FIN</th>
                            <th className={` ${classes.TableContentThTd}`}>JOUR RESTANT</th>
                            <th className={` ${classes.TableContentThTd}`}>STATUT</th>
                            {/* <th className={` ${classes.TableContentThTd}`}>FAMILE</th>
                            <th className={` ${classes.TableContentThTd}`}>SERVICE</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {contrat_detail && contrat_detail?.map((contrat,index) =>{
                            return <tr key={index}>
                                      {/* <td className={` ${classes.TableContentThTd}`}>{index+1}</td> */}
                                      <td className={` ${classes.TableContentThTd}`}>{contrat.equipement.num_serie}</td>
                                      {/* <td className={` ${classes.TableContentThTd}`}>{contrat.equipement.marque}</td> */}
                                      {/* <td className={` ${classes.TableContentThTd}`}>{contrat.equipement.modele}</td> */}
                                      <td className={` ${classes.TableContentThTd}`}>{moment(contrat.date_debut).format('L')}</td>
                                      <td className={` ${classes.TableContentThTd}`}>{moment(contrat.date_fin).format('L')}</td>
                                      <td className={` ${classes.TableContentThTd}`}>{getDayLeft(contrat.date_fin)}</td>
                                      <td className={` ${classes.TableContentThTd}`}><RenderStatut statut={contrat?.statut} /></td>
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
        field: 'num_contrat',
        headerName: 'N° CONTRAT',
        minWidth: 110,
        flex: 1,
        editable: false,
        sortable: true,
      },
      {
        field: 'num_bon_livraison',
        headerName: 'N° BN LIV',
        minWidth: 120,
        flex: 1,
        editable: false,
        sortable: true,
        valueGetter: getNumLivraison
      },
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
        field: 'province',
        headerName: 'PROVINCE',
        minWidth: 100,
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
        field: 'adresse',
        headerName: 'ADRESSE',
        minWidth: 130,
        flex: 1,
        editable: false,
        sortable: true,
        valueGetter : getAdresseClient
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
        field: 'equipement',
        headerName: 'EQUIPEMENT',
        minWidth: 520,
        flex: 1,
        editable: false,
        renderCell: getEquipement
      },
      

      {
        field: 'ACTION',
        minWidth: 250,
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
    // console.log("EXPORT PDF LISTENER inside the component ListGarantie : ");

  }

  const handleExportExcel = ()=>{
    // console.log("EXPORT EXCEL LISTENER inside the component ListGarantie : ");
    exportExcelGarantie(contratDataFiltered,filter.date_debut_contrat,filter.date_fin_contrat)
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <ContratFilter 
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

export default ListGarantie;
