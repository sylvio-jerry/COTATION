import React, {useEffect, useState} from 'react';
import axios from 'axios'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonComponent,AlertToast } from '../../components';
import Slide from '@mui/material/Slide';
import globalStyle from '../../Style/globalStyle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography , RadioGroup,Radio ,TextField,Box,FormControl, FormControlLabel,FormLabel} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

var moment = require('moment');
moment.locale('fr')
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const EditUtilisateur = ({openModal,closeModal,data,refresh})=> {

  const classes = globalStyle();
  const onClose = () => {
    closeModal(false);
  };

  const skip = ()=>{
    AlertToast("info","Operation annulé")
    onClose()
  }

  const defaultUser = ()=>({
    nom: '',
    email:'',
    pseudo: '',
    tel: '',
    is_admin: false
  })

  const defaultError = ()=>({
    nom: null,
    email: null,
    pseudo: null,
    tel: null
  })

  const [user, setUser] = useState(defaultUser())
  const [error,setError]=useState(defaultError())

  const handleChange= (event) => {
    setUser({...user,[event.target.name]:event.target.value});
  };

  useEffect(()=>{
    getUtilisateur()
    },[])

    const getUtilisateur = async()=>{
      if(data){
        let user_ = {
          id: data?.id,
          nom: data?.nom,
          email:data?.email,
          pseudo: data?.pseudo,
          tel: data?.tel,
          is_admin: data?.is_admin,
        }
        setUser(user_)
      }
    }

  const edit = async()=>{
    if(user.nom.trim() !== ''  && user.email.trim() !== '' && user.pseudo.trim() !== '' ){
      if(error.nom === null && error.email === null && error.pseudo === null && error.tel === null){
        try {
          let updatedUser = {
            nom: user.nom,
            pseudo: user.pseudo,
            email: user.email,
            tel: (user.tel==="") ? null : user.tel,
            is_admin: (user.is_admin==="true" || user.is_admin===true) ? true : false,
          }
          const data_ = await axios.put(`${API_URL}/api/utilisateur/${user.id}`,updatedUser)
          let {status,message} = data_.data
          if(status==="success"){
            AlertToast("success",message)
            await refresh()
            onClose()
            setUser(defaultUser())
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
  const verifyUserName = (event) => {
    let error_message = null
    if(user.nom.trim().length<2){
      error_message="Au moins 2 caractères"
      setError({...error,nom: error_message})
      AlertToast("warning",error_message)
    }
  };
  const verifyUserPseudo= () => {
    //should verify the typeof numero
    let error_message = null
    if(user.pseudo.trim().length<3){
      error_message="Au moins 3 caractères"
      setError({...error,pseudo: error_message})
      AlertToast("warning",error_message)
    }
  };
  const verifyUserEmail= () => {
    if(user.email.trim().length<1){
      return
    }
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

  const verifyUserTel= () => {
    //should verify the typeof numero
    if(user.tel.trim().length<1){
      return
    }
    let error_message = null
    if(user.tel.trim().length!==10){
      error_message="Numero téléphone devrait être composer de 10 chiffres"
      setError({...error,tel: error_message})
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
    marginTop:0
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
              <Typography variant="div"><strong>EDIT UTILISATEUR </strong></Typography>
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
                    {/* {JSON.stringify(user)} */}
                    <TextField 
                    onBlur={verifyUserName}
                    onFocus={resetError}
                    error={error.nom? (true) : (false)}
                    helperText={error.nom ? (error.nom) : ''}
                    name="nom" variant="filled" required={true} value={user.nom} onChange={handleChange} placeholder="ex : Nom" type="name" label="NOM" />
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
                    onBlur={verifyUserPseudo}
                    onFocus={resetError}
                    error={error.pseudo? (true) : (false)}
                    helperText={error.pseudo ? (error.pseudo) : ''}
                    name="pseudo" variant="filled" required={true} value={user.pseudo} onChange={handleChange} placeholder="ex : Pseudo" type="name" label="PSEUDO" />
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
                    onBlur={verifyUserEmail}
                    onFocus={resetError}
                    error={error.email? (true) : (false)}
                    helperText={error.email ? (error.email) : ''}
                    name="email" variant="filled" required={true} value={user.email} onChange={handleChange} placeholder="ex : Email" type="name" label="EMAIL" />
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
                     onBlur={verifyUserTel}
                     onFocus={resetError}
                     error={error.tel? (true) : (false)}
                     helperText={error.tel ? (error.tel) : ''}
                    name="tel" variant="filled" required={false} value={user.tel} onChange={handleChange} placeholder="ex : Tel" type="number" label="TEL" />
                  </Box>
                </div>
                <div style={ficheItem}>
                  <div style={{minWidth: "35ch", marginBottom:"15px"}}>
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">ROLE DE L'UTILISATEUR :</FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="is_admin"
                        value={user.is_admin}
                        onChange={handleChange}
                      >
                        <FormControlLabel value={true} control={<Radio />} label="Admin" />
                        <FormControlLabel value={false} control={<Radio />} label="Client" />
                      </RadioGroup>
                    </FormControl>
                  </div>
                </div>
              </div>
            </ThemeProvider>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={onClose}>FEMER</Button> */}
          <div style={action}>
            <div style={actionItem}>
              <ButtonComponent color='error' function={skip} name_of_btn="RETOUR" icon={<CloseIcon />} />
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

export default EditUtilisateur;