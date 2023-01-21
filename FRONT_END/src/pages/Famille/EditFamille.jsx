import React, {useEffect, useState} from 'react';
import axios from 'axios'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AlertToast } from '../../components';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonComponent } from '../../components';
import Slide from '@mui/material/Slide';
import globalStyle from '../../Style/globalStyle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography ,TextField,Box,Autocomplete,FormControl} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
// import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
// import { IconButton } from '@mui/material';

var moment = require('moment');
moment.locale('fr')
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const EditService = ({openModal,closeModal,data,refresh})=> {

  const classes = globalStyle();
  const onClose = () => {
    closeModal(false);
  };

  const skip = ()=>{
    AlertToast("info","Operation annulé")
    onClose()
  }
  const defaultFamille = ()=>({
    nom_famille: '',
    service:null
  })

  const defaultError = ()=>({
    nom_famille: null,
    service:null
  })

  const [famille, setFamille] = useState(defaultFamille())
  const [serviceData,setServiceData] = useState([])
  const [error,setError]=useState(defaultError())

  const handleChangeService= (event,value) => {
    setFamille({...famille,service:value});
  };

  const handleChangeFamille= (event) => {
    setFamille({...famille,nom_famille:event.target.value});
  };

  useEffect(()=>{
    getService()
    getFamille()
  },[])

  const getFamille = ()=>{
    if(data){
      let famille_ = {
        id: data?.id,
        nom_famille: data?.nom_famille,
        service: data?.service
      }
      setFamille(famille_)
    }
  }

  const getService = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/service`)
      if(data){
        setServiceData(data.data)
      }
    } catch (error) {
      console.log("error while getClientRequest:",error);
    }
  }

  const edit = async ()=>{
    if(famille.nom_famille.trim() !== '' && famille.service !==null){
      if(error.nom_famille === null && error.service === null){
        try {
          let updatedFamille = {
            nom_famille: famille.nom_famille,
            service_id: famille.service.id
          }
          const data_ = await axios.put(`${API_URL}/api/famille/${famille.id}`,updatedFamille)
          let {status,message} = data_.data
          if(status==="success"){
            AlertToast("success",message)
            setFamille(defaultFamille())
            onClose()
            await refresh()
          }
       } catch ({response}) {
          console.log("error while editFamilleRequest:", response);
          let {status,message} = response.data
          if(status==="failed"){
            AlertToast("error",message)
          }
       }
      }
      else{
        AlertToast("warning","Veuillez remplir correctement le formulaire")
      }
    }else{
      AlertToast("warning","Veuillez remplir les champs obligatoires")
    }
  }

  //Handle error validation
  const verifyFamilleName = (event) => {
    let error_message = null
    if(famille.nom_famille.trim().length<2){
      error_message="Au moins 2 caractères"
      setError({...error,nom_famille: error_message})
      AlertToast("warning",error_message)
    }
  };
  const verifyFamilleService = () => {
    let error_message = null
    if(famille.service===null){
      error_message="Veuillez choisir le service de la famille"
      setError({...error,service: error_message})
      AlertToast("warning",error_message)
    }
  };
  const resetError = (event) => {
      setError({...error,[event.target.name]: null})
  };

  const theme = createTheme({
    typography: {
      fontFamily: [
        "titilliumlight",
        '"Helvetica Neue"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'Arial',
        'sans-serif',
        '"Segoe UI Emoji"',
        '"Apple Color Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      color:"black",
      h5: {
        fontSize: 20,
        letterSpacing: 7,
        fontWeight:200,
      },
      h6: {
        fontSize: 18,
        letterSpacing: 5,
        fontWeight:100,
        marginTop:15
      },
      
    },
  });

  const dialogContainer = {
    marginTop: 50
    // backgroundColor: "red",
  }

  const ficheContainer = {
    display: "flex",
    flexDirection: "column",
    // backgroundColor: "red",
    alignItems : "center"
  }

  const ficheItem = {
    // backgroundColor: "yellow",
    marginBottom: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems : "center"
  }

  const action = {
    // backgroundColor: "grey",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop:0,
    // padding: 20,
    
  }

  const actionItem = {
    margin: 25
  }

  return (
    <div>
      <Dialog
        open={openModal}
        onClose={onClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        style={dialogContainer}
      >
        <DialogTitle id="scroll-dialog-title"> 
          <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>MODIFICATION FAMILLE </strong></Typography>
          </div>
        </DialogTitle>
          <DialogContent
          >
            <ThemeProvider theme={theme}>
              <div style={ficheContainer}>
                <div style={ficheItem}>
                  <Box style={{minWidth: "35ch", marginTop:25}}>
                    <FormControl style={{minWidth: "100%"}}>
                      <Autocomplete
                        isOptionEqualToValue={(option, value) =>
                          value === undefined || value === "" || option.id === value.id
                        }
                        onChange={handleChangeService}
                        value={famille.service}
                        getOptionLabel={(option) => option.nom_service || ''}
                        disablePortal
                        id="combo-box-demo"
                        options={serviceData}
                        style={{ width: "35ch",minHeight: 50}}
                        ListboxProps={
                          {
                            style:{
                                maxHeight: '35ch',
                                border: '1px solid gray'
                            }
                          }
                        }
                        renderInput={(params) => <TextField 
                          onBlur={verifyFamilleService}
                          onFocus={resetError}
                          error={error.service? (true) : (false)}
                          helperText={error.service ? (error.service) : ''}
                          {...params} 
                          label="SERVICE" 
                          required={true}
                          name="service"
                           />}
                      />
                    </FormControl>
                  </Box>
                </div>
                <div style={ficheItem}>
                  <Box
                    component="form"
                    sx={{
                      '& > :not(style)': { m: 2, minWidth: "35ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                     <TextField 
                    onBlur={verifyFamilleName}
                    onFocus={resetError}
                    error={error.nom_famille? (true) : (false)}
                    helperText={error.nom_famille ? (error.nom_famille) : ''}
                    name="nom_famille" variant="filled" required={true} value={famille.nom_famille} onChange={handleChangeFamille} placeholder="ex : Famille" type="name" label="FAMILLE" />
                  </Box>
                </div>
                {/* <div style={ficheItem}>
                  <Box
                    component="form"
                    sx={{
                      '& > :not(style)': { m: 2, minWidth: "35ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                  <div>
                    <IconButton color="disabled" component="label">
                      <input type="file" accept="image/*" hidden />
                      <PhotoCameraIcon fontSize="medium" color="disabled"/>
                      Image
                    </IconButton>
                  </div>
                  </Box>
                </div> */}
              </div>
            </ThemeProvider>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={onClose}>FEMER</Button> */}
          <div style={action}>
            <div style={actionItem}>
              <ButtonComponent color='error' function={skip} name_of_btn="ANNULER" icon={<CloseIcon />} />
            </div>
            <div style={actionItem}>
              <ButtonComponent color='root' function={edit} name_of_btn="ENREGISTRER" icon={<SaveIcon />} />
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditService;