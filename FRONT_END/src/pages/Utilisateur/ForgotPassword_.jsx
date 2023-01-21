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

const ForgotPassword = ({openModal,closeModal})=> {

  const classes = globalStyle();
  const onClose = () => {
    closeModal(false);
  };

  const skip = ()=>{
    AlertToast("info","Operation annulé")
    onClose()
  }

const defaultError = ()=>({
  email: null
})
  const handleChange = (event) => {
    setUser({...user,[event.target.name]:event.target.value});
  };
  const [user, setUser] = useState({email: ''})
  const [error,setError]=useState(defaultError())

  useEffect(()=>{
    console.log("dialog forgot password user mounted",user);
  },[])

  const sendNewPassword = async()=>{
    if(user.email.trim() !== ''){
      if(error.email === null){
        try {
          console.log("yes",user.email);
          // const data_ = await axios.post(`${API_URL}/api/user`,user)
          // let {status,message} = data_.data
          // if(status==="success"){
          //   AlertToast("success",message)
          //   setUser(defaultService())
          // }
         } catch ({response}) {
          console.log("error while sending forgot application:", response);
          // let {status,message} = response.data
          // if(status==="failed"){
          //   AlertToast("error",message)
          // }
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
  
  const verifyUserEmail= () => {

    let error_message = null
    //verification email valide front end(regex)
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //regex.test return boolean if valid or not 
    let isMailValid = regex.test(user.email)
    if (!isMailValid) {
        error_message = "Adresse email invalide"
        setError({...error,email: error_message})
        AlertToast("warning",error_message)
    }
  };

  const resetError = (event) => {
    console.log("reset error de ",event.target.name);
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
              <Typography variant="div"><strong>GENERER UN NOUVEAU MOT DE PASSE</strong></Typography>
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
                      onBlur={verifyUserEmail}
                      onFocus={resetError}
                      onChange={handleChange}
                      variant="filled"
                      required={true}
                      name="email"
                      value={user.nom_service}
                      placeholder="ex : Mot de passe"
                      type="password"
                      label="NOM SERVICE"
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
              <ButtonComponent color='root' function={sendNewPassword} name_of_btn="ENREGISTRER" icon={<SaveIcon />} />
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ForgotPassword;