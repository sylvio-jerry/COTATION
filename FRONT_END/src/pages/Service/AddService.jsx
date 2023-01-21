import React, {useEffect, useState} from 'react';
import axios from 'axios'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { HeaderLabel,AlertToast ,AlertConfirm} from '../../components';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonComponent } from '../../components';
import Slide from '@mui/material/Slide';
import globalStyle from '../../Style/globalStyle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography , Divider ,TextField,Box, Alert} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

var moment = require('moment');
moment.locale('fr')
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const AddService = ({openModal,closeModal,refresh})=> {

  const classes = globalStyle();
  const onClose = () => {
    closeModal(false);
  };

  const skip = ()=>{
    AlertToast("info","Operation annulé")
    onClose()
  }
  const defaultService = ()=>({
    nom_service: '',
    description: '',
})

const defaultError = ()=>({
  nom_service: null,
  description: null
})
  const handleChange = (event) => {
    setService({...service,[event.target.name]:event.target.value});
  };
  const [service, setService] = useState(defaultService())
  const [error,setError]=useState(defaultError())

  useEffect(()=>{
    console.log("dialog add service mounted",service);
  },[])

  const add = async()=>{
    if(service.nom_service.trim() !== ''){
      if(error.nom_service === null  && error.description === null){
        try {
          const data_ = await axios.post(`${API_URL}/api/service`,service)
          let {status,message} = data_.data
          if(status==="success"){
            AlertToast("success",message)
            setService(defaultService())
            await refresh()
          }
         } catch ({response}) {
          console.log("error while postServiceRequest:", response);
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
  const verifyServiceName = (event) => {
    let error_message = null
    if(service.nom_service.trim().length<2){
      error_message="Au moins 2 caractères"
      setError({...error,nom_service: error_message})
      AlertToast("warning",error_message)
    }
  };
  
  const verifyServiceDescription = (event) => {
    let error_message = null
    if(service.description.trim().length>255){
      error_message="Description trop long"
      setError({...error,description: error_message})
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
              <Typography variant="div"><strong>NOUVEAU SERVICE </strong></Typography>
          </div>
        </DialogTitle>
          <DialogContent
          >
            <ThemeProvider theme={theme}>
              <div style={ficheContainer}>
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
                      error={error.nom_service? (true) : (false)}
                      helperText={error.nom_service ? (error.nom_service) : ''}
                      onBlur={verifyServiceName}
                      onFocus={resetError}
                      onChange={handleChange}
                      variant="filled"
                      required={true}
                      name="nom_service"
                      value={service.nom_service}
                      placeholder="ex : Nom Service"
                      type="name"
                      label="NOM SERVICE"
                    />
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
                      onBlur={verifyServiceDescription}
                      onFocus={resetError}
                      error={error.description? (true) : (false)}
                      helperText={error.description ? (error.description) : ''}
                      multiline rows={3} variant="filled"
                      required={false}
                      name="description"
                      value={service.description}
                      onChange={handleChange}
                      placeholder="ex : Description"
                      type="name"
                      label="DESCRIPTION" 
                    />
                  </Box>
                </div>
              </div>
            </ThemeProvider>
        </DialogContent>
        <DialogActions>
          <div style={action}>
            <div style={actionItem}>
              <ButtonComponent color='error' function={skip} name_of_btn="ANNULER" icon={<CloseIcon />} />
            </div>
            <div style={actionItem}>
              <ButtonComponent color='root' function={add} name_of_btn="ENREGISTRER" icon={<SaveIcon />} />
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddService;