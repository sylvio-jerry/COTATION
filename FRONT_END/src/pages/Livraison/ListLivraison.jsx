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

const ListLivraison = () => {

  const classes = globalStyle();
  const navigate = useNavigate()

  useEffect(()=>{
    getLivraison()
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
  const [livraisonData,setLivraisonData] = useState([])
  const [livraisonDataFiltered,setLivraisonDataFiltered] = useState([])
  const [isLoading,setIsLoading] = useState(true);
  
  const getListFiltered = (filter) => {
    setFilter(filter)
    getLivraison(filter);
  };
  
  const getLivraison = async (filter) => {
    if (!filter) {
      filter = defaultFilter();
    }

    const handleProvince = (item) =>
    !filter.province || item?.client?.ville?.province?.id===filter.province

    const handleFamille= (item) => {
      return !!item.equipement.find((equipement) => {
        if (filter.famille === 0) return true;
        if (equipement.famille.id === filter.famille) {
          item.equipement =
            item.equipement.filter(
              (equip) => equip.famille.id === filter.famille
            );
          return true;
        }
        return false;
      });
    };

    const handleService= (item) => {
      return !!item.equipement.find((equipement) => {
        if (filter.service === 0) return true;
        if (equipement.famille.service_id === filter.service) {
          item.equipement =
            item.equipement.filter(
              (equip) => equip.famille.service_id  === filter.service
            );
          return true;
        }
        return false;
      });
    };

    const handleGarantie= (item) => {
      return !!item.equipement.find((equipement) => {
        if (filter.garantie === 0) return true;
        if (filter.garantie === 1) {
          if (equipement.duree_garantie !== null) {
            item.equipement =
            item.equipement.filter(
              (equip) => equip.duree_garantie !== null
            );
            return true;
          }
          return false
        }
        if (filter.garantie === 2) {
          if (equipement.duree_garantie === null) {
            item.equipement =
            item.equipement.filter(
              (equip) => equip.duree_garantie === null
            );
            return true;
          }
          return false
        }
       return false;
      });
    };



    let isDateBefore = (dateBefore,dateAfter)=> moment(dateBefore).isSameOrBefore(moment(dateAfter),"day") ? true : false
    let isDateAfter = (dateAfter,dateBefore)=> moment(dateAfter).isSameOrAfter(moment(dateBefore),"day") ? true : false
    
    const handleDate = (item) => {
      let checkBefore = isDateBefore(moment(filter.date_debut_livraison,'L').format('YYYY-MM-DD'),item?.date_livraison)
      let checkAfter = isDateAfter(moment(filter.date_fin_livraison,'L').format('YYYY-MM-DD'),item?.date_livraison)
      return checkBefore && checkAfter
    }

    const checking = [handleProvince,handleFamille,handleService,handleGarantie,handleDate];

    try {
      const {data} = await axios.get(`${API_URL}/api/livraison`)
      if (data.status==="success") {
        const newArray = filterFunction(data.data, checking);
        setLivraisonData(data.data)
        setLivraisonDataFiltered(newArray);
        setIsLoading(false)
      }
    } catch (error) {
      console.log("error while getGarantieRequest:", error);
    }
  };

  const AddLivraison = ()=>{
    navigate('/livraison/ajout');
  }
  const deleteLivraison = async ({id})=>{
     AlertConfirm("warning","Suppression").then(async (res)=>{
      if(res.isConfirmed){
        try {
          const data_ = await axios.delete(`${API_URL}/api/livraison/${id}`)
          let {status,message} = data_.data
          if(status==="success"){
            AlertToast("success",message)
            await getLivraison()
        }
       } catch ({response}) {
          console.log("error while deleteLivraisonRequest:", response);
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

  const editLivraison = (data)=>{
    navigate(`edit/${data.id}`, {state: data})
  }

  const DetailLivraison = (data)=>{
    navigate(`detail/${data.id}`, {state: data})
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

  //table Livraison
  const TableLivraison = ({data})=> {

    const TableContent = {
      fontFamily: "Arial, Helvetica, sans-serif",
      borderCollapse: "collapse",
      width: "100%"
    }
  
    const TableContentThTd = {
      border: "1px solid #ddd",
      padding: 8,
      textAlign: "left",
    }


    function getNomClient(params) {
      const nom_client = params.row.client.nom_client
      return nom_client;
    }

    // function getAdresseClient(params) {
    //   const adresse =  params.row.client.adresse
    //   return adresse;
    // }

    function getProvinceClient(params) {
      const province =  params.row?.client?.ville?.province?.nom_province
      return province;
    }

    function getVilleClient(params) {
      const ville =  params.row?.client?.ville?.nom_ville
      return ville;
    }

    function getDateLivraison(params) {
      const date_livraison =  params.row.date_livraison
      return date_format(date_livraison);
    }

    function getInformation(params) {
      let equipement = params.row.equipement
      return (
        <div>
          
          <Accordion TransitionProps={{ unmountOnExit: true }} style={{display: "flex",flexDirection: "column",alignItems: "start", width: "100%"}}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
               <Typography>{`Nombre : ${equipement.length}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <div>
                  <table  style={TableContent}>
                    <thead  className={` ${classes.tableHeader}`}>
                      <tr>
                        {/* <th  style={TableContentThTd}>N° </th> */}
                        <th style={TableContentThTd}>N° SERIE </th>
                        <th style={TableContentThTd}>MARQUE</th>
                        <th style={TableContentThTd}>MODELE</th>
                        <th style={TableContentThTd}>GARANTIE</th>
                        {/* <th style={TableContentThTd}>FAMILLE</th>
                        <th style={TableContentThTd}>SERVICE</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      { equipement.map((equip,index) =>{
                        return <tr key={index}>
                                  {/* <td style={TableContentThTd}>{index+1}</td> */}
                                  <td style={TableContentThTd}>{equip.num_serie}</td>
                                  <td style={TableContentThTd}>{equip.marque}</td>
                                  <td style={TableContentThTd}>{equip.modele}</td>
                                  <td style={TableContentThTd}>{equip.duree_garantie ? `${equip.duree_garantie} Mois` : "Pas de garantie"}</td>
                                  {/* <td style={TableContentThTd}>{equip.famille.nom_famille}</td>
                                  <td style={TableContentThTd}>{equip.famille.service.nom_service}</td> */}
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
        field: 'num_bon_livraison',
        headerName: 'N° BN LIV',
        minWidth: 130,
        flex: 1,
        editable: false,
        sortable: true,
      },
      {
        field: 'date_livraison',
        headerName: 'DATE LIVRAISON',
        minWidth: 140,
        // headerAlign: "center",
        flex: 1,
        editable: false,
        // textAlign:"center",
        valueGetter: getDateLivraison
      },
      {
        field: 'client',
        headerName: 'CLIENT',
        minWidth: 110,
        flex: 1,
        editable: false,
        sortable: true,
        valueGetter: getNomClient
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
      
      // {
      //   field: 'province',
      //   headerName: 'PROVINCE',
      //   minWidth: 130,
      //   flex: 1,
      //   editable: false,
      //   sortable: true,
      //   valueGetter : getProvinceClient
      // },
      {
        field: 'equipement',
        headerName: 'EQUIPEMENT',
        minWidth: 430,
        flex: 1,
        editable: false,
        renderCell: getInformation
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
                <IconButton onClick={ ()=> DetailLivraison(data)} >
                  <Info style={{width:40, height:50}} />
                </IconButton>
            </Box>
            <Box>
                <IconButton onClick={ ()=> editLivraison(data)} >
                  <Edit style={{width:40, height:50}} fill="#5D6061" />
                </IconButton>
            </Box>
            <Box>
            <IconButton onClick={()=>deleteLivraison(data)} >
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
    // console.log("EXPORT PDF LISTENER inside the component ListLivraison : ");
  }

  const handleExportExcel = ()=>{
    // console.log("EXPORT EXCEL LISTENER inside the component ListLivraison : ");
    exportExcelLivraison(livraisonDataFiltered,filter.date_debut_livraison,filter.date_fin_livraison)
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
        <ButtonComponent color='root' function={AddLivraison} name_of_btn="NOUVEAU" icon={<PersonAddAltIcon/>}/>
      </div>
      <div>
        <TableLivraison data={livraisonDataFiltered}/>
      </div>
    </div>
  );
};

export default ListLivraison;
