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
import { Typography ,TextField,Box,Autocomplete,FormControl} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { IconButton } from '@mui/material';

var moment = require('moment');
moment.locale('fr')
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const EditVille = ({openModal,closeModal,refresh,data})=> {

  const classes = globalStyle();
  const onClose = () => {
    closeModal(false);
  };

  const skip = ()=>{
    AlertToast("info","Operation annulé")
    onClose()
  }

  const defaultVille = ()=>({
    nom_ville: '',
    province:null
  })

  const defaultError = ()=>({
    nom_ville: null,
    province:null
  })


  const [ville, setVille] = useState(defaultVille())
  const [provinceData,setProvinceData] = useState([])
  const [error,setError]=useState(defaultError())

  const handleChangeProvince= (event,value) => {
    setVille({...ville,province:value});
  };

  const handleChangeVille= (event) => {
    setVille({...ville,nom_ville:event.target.value});
  };

  useEffect(()=>{
      getProvince()
      getVille()
    },[])

  const getProvince = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/province`)
      if(data){
        setProvinceData(data.data)
      }
    } catch (error) {
      console.log("error while getProvinceRequest:",error);
    }
  }

  const getVille= ()=>{
    if(data){
      let ville_ = {
        id: data?.id,
        nom_ville: data?.nom_ville,
        province: data?.province
      }
      setVille(ville_)
    }
  }

  const edit = async()=>{
    if(ville.nom_ville.trim() !== '' && ville.province !==null){
      if(error.nom_ville === null && error.province === null){
        try {
          let updatedVille = {
            nom_ville: ville.nom_ville,
            province_id: ville.province.id
          }
          const data_ = await axios.put(`${API_URL}/api/ville/${data.id}`,updatedVille)
          let {status,message} = data_.data
          if(status==="success"){
            AlertToast("success",message)
            setVille(defaultVille())
            onClose()
            await refresh()
          }
         } catch ({response}) {
          console.log("error while editVilleRequest:", response);
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
  const verifyVilleName = (event) => {
    let error_message = null
    if(ville.nom_ville.trim().length<5){
      error_message="Au moins 5 caractères"
      setError({...error,nom_ville: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyVilleProvince = () => {
    let error_message = null
    if(ville.province===null){
      error_message="Veuillez choisir le province de la ville"
      setError({...error,province: error_message})
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
    // pediting: 20,
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
              <Typography variant="div"><strong>MODIFICATION VILLE </strong></Typography>
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
                        onChange={handleChangeProvince}
                        value={ville.province}
                        getOptionLabel={(option) => option.nom_province || ''}
                        disablePortal
                        id="combo-box-demo"
                        options={provinceData}
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
                          onBlur={verifyVilleProvince}
                          onFocus={resetError}
                          error={error.province? (true) : (false)}
                          helperText={error.province ? (error.province) : ''}
                          {...params} 
                          label="PROVINCE" 
                          required={true}
                          name="province"
                           />}
                      />
                    </FormControl>
                  </Box>
                </div>
                <div style={ficheItem}>
                  <Box
                    component="form"
                    sx={{
                      '& > :not(style)': { m: 2, minWidth: "35ch", marginBottom:15  },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField 
                    onBlur={verifyVilleName}
                    onFocus={resetError}
                    error={error.nom_ville? (true) : (false)}
                    helperText={error.nom_ville ? (error.nom_ville) : ''}
                    name="nom_ville" variant="filled" required={true} value={ville.nom_ville} onChange={handleChangeVille} placeholder="ex : Ville" type="name" label="VILLE" />
                  </Box>
                </div>
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

export default EditVille;