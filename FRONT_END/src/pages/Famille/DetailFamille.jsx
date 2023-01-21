import React, { useState } from 'react';
import { ButtonComponent } from '../../components';
import { useNavigate ,useLocation} from 'react-router-dom';
import { Typography ,Box } from '@mui/material';
// import image from '../../assets/images/equipement/equipement.png'
import BackspaceIcon from '@mui/icons-material/Backspace';
import globalStyle from '../../Style/globalStyle';
import { DataGrid , GridToolbarContainer , GridToolbarQuickFilter} from '@mui/x-data-grid';
import Lottie from 'react-lottie';
import * as infoAnimation from '../../assets/lottie/info.json'

const DetailFamille = () => {
  const classes = globalStyle()
  const navigate= useNavigate()
  const {state} = useLocation()

  const defaultResume = ()=>({
    nom_famille:state?.nom_famille,
    service: state?.service?.nom_service,
    serviceDescription: state?.service?.description || "",
    equipement: state?.equipement || [],
    nombreEquipement: state?.equipement?.length || "Pas d'equipement associé à cette famille",
    // familleImage: '',
  })

  const [resume, setResume] = useState(defaultResume());

  const exit = ()=>{
    navigate(-1)
  }

  //lottie file
  const InfoComponent = ()=>{
    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: infoAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return <div>
                <Lottie options={defaultOptions}
                height={400}
                width={350}/>
            </div>
  }

  const familleImageContainer = {
    // backgroundColor: "black",
    display: "flex",
    justifyContent: "center",
    width:350,
    height: 400,
    padding:5
  }
  
  const imageStyle = {
    // backgroundColor: "pink",
    // height:"100%",
    // width:"100%",
    borderRadius: "25px",
  }

  return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  ${classes.mainContainer}`}>
      {/* <HeaderLabel title="NOUVEAU CONTRAT DE GARANTIE"/> */}
      <div className={classes.formContainer}>
        <div className={`${classes.formContainerItemLeft}`} >
          <div style={familleImageContainer}>
            {/* <img src={image} alt="Image de l'equipement" style={imageStyle}/> */}
            <InfoComponent/>
          </div>
        </div>
        <div className={` ${classes.formContainerItemRight}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFORMATION FAMILLE</strong></Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>FAMILLE : </strong> {resume.nom_famille}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>SERVICE : </strong> {resume.service}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DESCRIPTION DU SERVICE : </strong> {resume.serviceDescription}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>NOMBRE D'EQUIPEMENT ASSOCIÉ : </strong> {resume.nombreEquipement}</Typography>
            </div>
          </div>
        </div>
      </div>
      <div style={{width: "80%", marginTop: 25}}>
        <TableEquipement data={resume.equipement} />
      </div>
      <div className={classes.action}>
        <div className={classes.actionItem}>
          <ButtonComponent color='error' function={exit} name_of_btn="RETOUR" icon={<BackspaceIcon />} />
        </div>
      </div>
    </div>
  )
};


  //TableEquipement
  const TableEquipement = ({data})=> {
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

  const rows = data || []

  const getDisposition = (params)=>{
    let dispo = params.row.is_locale ? "Interne" : "Externe"
    return dispo;
  }

  const getDureeGarantie = (params)=>{
    let garantie = params.row.duree_garantie ? params.row.duree_garantie : "Pas de garantie"
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
      headerName: 'LOCALE',
      minWidth: 110,
      flex: 1,
      headerAlign: "center",
      align:'center',
      valueGetter: getDisposition
    }
  ];

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

  return (
    <Box sx={{  width: '100%',marginTop:0 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        components={{ Toolbar: Search }}
        sx={datagridSx}
        autoHeight={true}
        
      />
    </Box>
  );
}

export default DetailFamille;
