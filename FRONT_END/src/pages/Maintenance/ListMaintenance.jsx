import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ContratFilter,
  ButtonComponent,
  AlertToast,
  AlertConfirm,
  LoadingComponent
} from "../../components";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate } from "react-router-dom";
import maintenanceStyle from "./maintenanceStyle";
import { ReactComponent as Edit } from "../../assets/images/edit.svg";
import { ReactComponent as Delete } from "../../assets/images/delete.svg";
import { ReactComponent as Info } from "../../assets/images/info.svg";
import { ReactComponent as Renew } from "../../assets/images/renew.svg";
import filterFunction from "../../filterFunction";
import { exportExcelMaintenance} from '../../export/exportExcel';

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { IconButton } from "@mui/material";
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/";
var moment = require("moment");
moment.locale("fr");

const ListMaintenance = () => {
  useEffect(() => {
    getMaintenance();
  }, []);


  const classes = maintenanceStyle();
  const navigate = useNavigate();

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
  
  const getListFiltered = (filter) => {
    setFilter(filter)
    getMaintenance(filter);
  };

  const getMaintenance = async (filter) => {
    if (!filter) {
      filter = defaultFilter();
    }
    
    const handleProvince = (item) =>
    !filter.province || item.client.ville.province_id===filter.province
    
    const handleStatut = (item) =>
    !filter.statut || filter.statut=== item.statut
    
    const handleFamille = (item) => {
      return !!item.contrat_maintenance_detail.find((detail) => {
        if (filter.famille === 0) return true;
        if (detail.equipement.famille.id === filter.famille) {
          item.contrat_maintenance_detail =
            item.contrat_maintenance_detail.filter(
              (det) => det.equipement.famille.id === filter.famille
            );
          return true;
        }
        return false;
      });
    };

    const handleService = (item) => {
      return !!item.contrat_maintenance_detail.find((detail) => {
        if (filter.service === 0) return true;
        if (detail.equipement.famille.service.id === filter.service) {
          item.contrat_maintenance_detail =
            item.contrat_maintenance_detail.filter(
              (de) => de.equipement.famille.service.id === filter.service
            );
          return true;
        }
        return false;
      });
    };


    let isDateBefore = (dateBefore,dateAfter)=> moment(dateBefore).isSameOrBefore(moment(dateAfter),"day") ? true : false
    let isDateAfter = (dateAfter,dateBefore)=> moment(dateAfter).isSameOrAfter(moment(dateBefore),"day") ? true : false
    
    const handleDate = (item) => {
      let checkBefore = isDateBefore(moment(filter.date_debut_contrat,'L').format('YYYY-MM-DD'),item.date_debut)
      let checkAfter = isDateAfter(moment(filter.date_fin_contrat,'L').format('YYYY-MM-DD'),item.date_fin)

       return checkBefore && checkAfter
    }

    const handleClient = (item) => !filter.client || +item?.client_id===+filter.client

    const checking = [handleService,handleProvince,handleStatut,handleFamille,handleDate,handleClient];
    try {
      const { data } = await axios.get(`${API_URL}/api/contrat_maintenance`);
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


  const addMaintenance = () => {
    navigate("/contrat_de_maintenance/ajout");
  };

  const deleteMaintenance = async ({ id }) => {
    AlertConfirm("warning", "Suppression").then(async (res) => {
      if (res.isConfirmed) {
        try {
          const data_ = await axios.delete(
            `${API_URL}/api/contrat_maintenance/${id}`
          );
          let { status, message } = data_.data;
          if (status === "success") {
            AlertToast("success", message);
            await getMaintenance();
          }
        } catch ({ response }) {
          console.log("error while deleteMaintenanceRequest:", response);
          let { status, message } = response.data;
          if (status === "failed") {
            AlertToast("error", message);
          }
        }
      } else if (res.isDenied) {
        AlertToast("info", "Operation annulé");
      }
    });
  };

  const editMaintenance = (data) => {
    navigate(`edit/${data.id}`, { state: data });
  };

  const infoMaintenance = (data) => {
    navigate(`detail/${data.id}`, { state: data });
  };

  const renewMaintenance = (data) => {
    navigate(`renew/${data.id}`, { state: data });
  };

  //table equipement design TableMaintenance
  const datagridSx = {
    borderRadius: 2,
    border: "none",
    "& .MuiDataGrid-main": { borderRadius: 2 },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "#03C9D7",
      color: "white",
      fontSize: 16,
    },
    "& .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-cell:focus-within":
      {
        outline: "none",
      },

    "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": {
      outline: "none",
    },
  };

  const date_format = (date, stringFormat = "DD/MM/YYYY") => {
    let date_formatted = moment(new Date(date), stringFormat).format(
      stringFormat
    );
    return date_formatted;
  };

  //table client
  const TableMaintenance = ({ data }) => {
    function getNomClient(params) {
      const nom_client = params.row.client.nom_client;
      return nom_client;
    }

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

    // function getAdresseClient(params) {
    //   const adresse = params.row.client.adresse;
    //   return adresse;
    // }
    function getVilleClient(params) {
      const province = params.row.client.ville.nom_ville;
      return province;
    }
    function getProvinceClient(params) {
      const province = params.row.client.ville.province.nom_province;
      return province;
    }

    function getDateDebut(params) {
      const date_debut = params.row.date_debut;
      return date_format(date_debut);
    }

    function getDateFin(params) {
      const date_fin = params.row.date_fin;
      return date_format(date_fin);
    }

    function getInformation(params) {
      let contrat_detail = params.row.contrat_maintenance_detail.filter(
        (el) => params.row.id === el.contrat_maintenance_id
      );
      return (
        <div>
          <Accordion TransitionProps={{ unmountOnExit: true }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>{`Nombre : ${contrat_detail.length}`}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div>
                <table className={` ${classes.TableContent}`}>
                  <thead className={` ${classes.tableHeader}`}>
                    <tr>
                      {/* <th className={` ${classes.TableContentThTd}`}>N° </th> */}
                      <th className={` ${classes.TableContentThTd}`}>
                        N° SERIE{" "}
                      </th>
                      <th className={` ${classes.TableContentThTd}`}>MARQUE</th>
                      <th className={` ${classes.TableContentThTd}`}>MODELE</th>
                      {/* <th className={` ${classes.TableContentThTd}`}>
                        FAMILLE
                      </th>
                      <th className={` ${classes.TableContentThTd}`}>
                        SERVICE
                      </th> */}
                    </tr>
                  </thead>
                  <tbody>
                    {contrat_detail.map((contrat, index) => {
                      return (
                        <tr key={index}>
                          {/* <td className={` ${classes.TableContentThTd}`}>
                            {index + 1}
                          </td> */}
                          <td className={` ${classes.TableContentThTd}`}>
                            {contrat.equipement.num_serie}
                          </td>
                          <td className={` ${classes.TableContentThTd}`}>
                            {contrat.equipement.marque}
                          </td>
                          <td className={` ${classes.TableContentThTd}`}>
                            {contrat.equipement.modele}
                          </td>
                          {/* <td className={` ${classes.TableContentThTd}`}>
                            {contrat.equipement.famille.nom_famille}
                          </td>
                          <td className={` ${classes.TableContentThTd}`}>
                            {contrat.equipement.famille.service.nom_service}
                          </td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </AccordionDetails>
          </Accordion>
        </div>
      );
    }

    const columns = [
      { field: "id", headerName: "ID", minWidth: 0, flex: 1, hide: true },
      {
        field: "num_contrat",
        headerName: "N° CONTRAT",
        minWidth: 130,
        flex: 1,
        editable: false,
        sortable: true,
      },
      {
        field: "date_debut",
        headerName: "DEBUT",
        minWidth: 120,
        headerAlign: "center",
        flex: 1,
        editable: false,
        textAlign: "center",
        valueGetter: getDateDebut,
      },
      {
        field: "date_fin",
        headerName: "FIN",
        headerAlign: "center",
        minWidth: 120,
        flex: 1,
        editable: false,
        valueGetter: getDateFin,
      },
      {
        field: 'dayleft',
        headerName: 'JOUR RESTANT',
        minWidth: 140,
        flex: 1,
        editable: false,
        sortable: true,
        align:'center',
        headerAlign: "center",
        valueGetter: getDayLeft
      },
      {
        field: "statut",
        headerName: "STATUT",
        minWidth: 90,
        flex: 1,
        renderCell: (cellValue) => <RenderStatut data={cellValue.row} />
      },
      {
        field: "client",
        headerName: "CLIENT",
        minWidth: 120,
        flex: 1,
        editable: false,
        sortable: true,
        valueGetter: getNomClient,
      },
      // {
      //   field: "adresse",
      //   headerName: "ADRESSE",
      //   minWidth: 110,
      //   flex: 1,
      //   editable: false,
      //   sortable: true,
      //   valueGetter: getAdresseClient,
      // },
      {
        field: "province",
        headerName: "PROVINCE",
        minWidth: 120,
        flex: 1,
        editable: false,
        sortable: true,
        valueGetter: getProvinceClient,
      },
      {
        field: "ville",
        headerName: "VILLE",
        minWidth: 120,
        flex: 1,
        editable: false,
        sortable: true,
        valueGetter: getVilleClient,
      },
      {
        field: "equipement",
        headerName: "EQUIPEMENT",
        minWidth: 350,
        flex: 1,
        editable: false,
        renderCell: getInformation,
      },
      // {
      //   field: "observation",
      //   headerName: "OBSERVATION",
      //   minWidth: 200,
      //   flex: 1,
      //   editable: false,
      //   sortable: true,
      // },

      {
        field: "ACTION",
        minWidth: 250,
        flex: 1,
        textAlign: "center",
        headerAlign: "center",
        renderCell: (cellValue) => <ActionButton data={cellValue.row} />,
      },
    ];
    const rows = data || [];
    const ActionButton = ({ data }) => {
      const actionStyle = {
        display: "flex",
        justifyContent: "space-evenly",
        flex: 1,
      };
      return (
        <Box style={actionStyle}>
          <Box>
            <IconButton onClick={() => renewMaintenance(data)}>
              <Renew style={{ width: 45, height: 50 }} />
            </IconButton>
          </Box>
          <Box>
            <IconButton onClick={() => infoMaintenance(data)}>
              <Info style={{ width: 40, height: 50 }} />
            </IconButton>
          </Box>
          <Box>
            <IconButton onClick={() => editMaintenance(data)}>
              <Edit style={{ width: 40, height: 50 }} fill="#5D6061" />
            </IconButton>
          </Box>
          <Box>
            <IconButton onClick={() => deleteMaintenance(data)}>
              <Delete style={{ width: 45, height: 50 }} fill="#C14949" />
            </IconButton>
          </Box>
        </Box>
      );
    };

    const RenderStatut = ({ data }) => {
      let colorStatut = data.statut === "Valide" ? "#006635" : "#992600"
      const statutStyle = {
        color: colorStatut
      };
    
      return (
        <Box>
            <Typography style={statutStyle}>
               {data.statut}
            </Typography>
        </Box>
      );
    };

    //search bar
    function Search() {
      return (
        <Box
          style={{
            marginBottom: 15,
          }}
        >
          <GridToolbarContainer>
            <Box style={{ flex: 1 }}>{/* <GridToolbarExport/> */}</Box>
            <GridToolbarQuickFilter />
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
      <Box sx={{ width: "100%", marginTop: 0 }}>
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
          getRowHeight={() => "auto"}
          loading={isLoading}
        />
      </Box>
    );
  };

  //export
  const handleExportPdf = (data_to_export) => {
    // console.log(
    //   "EXPORT PDF LISTENER inside the component listMaintenance : ",
    //   data_to_export
    // );
  };

  const handleExportExcel = () => {
    // console.log(
    //   "EXPORT EXCEL LISTENER inside the component listMaintenance : "
    // );
    exportExcelMaintenance(contratDataFiltered)
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <ContratFilter
        filterOption={getListFiltered}
        filterData = {filter}
        exportPdf={handleExportPdf}
        exportExcel={handleExportExcel}
      />
      <div style={{ paddingTop: 50 }}>
        <ButtonComponent
          color="root"
          function={addMaintenance}
          name_of_btn="NOUVEAU"
          icon={<PersonAddAltIcon />}
        />
      </div>
      <div>
        <TableMaintenance data={contratDataFiltered} />
      </div>
    </div>
  );
};

export default ListMaintenance;
