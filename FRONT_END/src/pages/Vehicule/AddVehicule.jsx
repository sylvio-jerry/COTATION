import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { ButtonComponent, HeaderLabel, DatePicker,AlertToast} from '../../components';
import { Box,TextField,FormControl,InputLabel,Select,MenuItem } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BackspaceIcon from '@mui/icons-material/Backspace';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Verify from './Verify';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
var moment = require('moment');
moment.locale('fr');

const AddVehicule = () => {
  let navigate = useNavigate();
  
  useEffect(()=>{
    // getClient()
    // getEquipement()
  },[])

  const defaultVehicule = ()=>(
    {
      Matricule: '',
      Marque: '',
      Version: '',
      EtatVehicule: '',
      PoidsVehicule: '',
      PoidsColis: '',
      Amorcage: '',
      dateArriveeAuPort: null,
    }
  )

  const defaultError = ()=>({
    Matricule: null,
    Marque: null,
    Version: null,
    EtatVehicule: null,
    PoidsVehicule: null,
    PoidsColis: null,
    dateArriveeAuPort: null,
    Amorcage: null
  })

  const [vehicule, setVehicule] = useState(defaultVehicule());
  const [showVerify, setShowVerify] = useState(false);
  const [error,setError]=useState(defaultError())

  //'NEUVE','OCCASION','CAMION','ENGIN','REMORQUE'
  const EtatVehiculeData = [
    { id:1, etat:"NEUVE" },
    { id:2, etat:"OCCASION" },
    { id:3, etat:"CAMION" },
    { id:4, etat:"ENGIN" },
    { id:5, etat:"REMORQUE"},
  ]

    const add = async()=>{
      console.log("vehicule test +++",vehicule);
      console.log("vehicule AAA +++",+vehicule.PoidsVehicule);
      console.log("vehicule AAA +++",typeof +vehicule.PoidsVehicule);

      if(vehicule.Matricule.trim() !=='' && vehicule.Marque.trim() !=='' && vehicule.Version.trim() !==''  && vehicule.PoidsVehicule.trim() !== ''  && vehicule.Amorcage.trim() !==''  && vehicule.PoidsColis.trim() !== '' && vehicule.dateArriveeAuPort !== null && vehicule.EtatVehicule.trim() !=='' ){
        if(error.Matricule === null  && error.Marque === null  && error.Version === null   && error.EtatVehicule === null  && error.PoidsVehicule === null && error.PoidsColis === null && error.Amorcage === null){
          try {
            let newVehicule = vehicule
            newVehicule.Matricule = newVehicule.Matricule.trim()
            newVehicule.Marque = newVehicule.Marque.trim()
            newVehicule.Version = newVehicule.Version.trim()
            newVehicule.PoidsVehicule = +newVehicule.PoidsVehicule.trim()
            newVehicule.PoidsColis = +newVehicule.PoidsColis.trim()
            newVehicule.EtatVehicule = newVehicule.EtatVehicule
            newVehicule.Amorcage = +newVehicule.Amorcage.trim()
            newVehicule.DateArriveeAuPort = moment(newVehicule.dateArriveeAuPort,'DD/MM/YYYY').format('YYYY-MM-DD')

            // console.log('new Liv to send : ',newVehicule);
            const data_ = await axios.post(`${API_URL}/api/car/create`,newVehicule)
            let {status,message} = data_.data
            if(status==="success"){
              AlertToast("success",message)
              setVehicule(defaultVehicule())
            }
           } catch ({response}) {
            console.log("error while postCarsRequest:", response);
            let {status,message} = response?.data
            if(status==="failed"){
              setVehicule(defaultVehicule())
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

    // const add = ()=>{
    //   console.log('clicked !!');
    // }
    
    const exit = ()=>{
      AlertToast("info","Operation annulé")
      navigate(-1)
    }

    const verify = ()=>{
      setShowVerify(!showVerify)
    }

  const handleChange = (event) => {
    setVehicule({...vehicule,[event.target.name]:event.target.value});
  };

  // const handleChangeClient = (event,value) => {
  //   setVehicule({...livraison,client:value});
  // };

  const handleChangeDateArrivee = (date) => {
    setVehicule({...vehicule,dateArriveeAuPort:date});
  };

  //handle error handler
  const verifyMatricule= () => {
    let error_message = null
    if(vehicule.Matricule.trim().length<6){
      error_message="Au moins 6 caractères"
      setError({...error,Matricule: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyMarque= () => {
    let error_message = null
    if(vehicule.Marque.trim().length<3){
      error_message="Au moins 3 caractères"
      setError({...error,Marque: error_message})
      AlertToast("warning",error_message)
    }
  };
  const verifyVersion= () => {
    let error_message = null
    if(vehicule.Version.trim().length<2){
      error_message="Au moins 2 caractères"
      setError({...error,Version: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyPoidsVehicule = () => {
    let error_message = null
    if(+vehicule.PoidsVehicule<=0 || vehicule.PoidsVehicule.trim() === ''){
      error_message="Poids du colis invalide"
      setError({...error,PoidsVehicule: error_message})
      AlertToast("warning",error_message)
    }else if(+vehicule.PoidsVehicule>100 || vehicule.PoidsVehicule.trim() === ''){
      error_message="Poids du colis invalide"
      setError({...error,PoidsVehicule: error_message})
      AlertToast("warning",error_message)
    }
  };
  const verifyPoidsColis = () => {
    let error_message = null
    if(+vehicule.PoidsColis<0 || vehicule.PoidsColis.trim() === ''){
      error_message="Poids du colis invalide"
      setError({...error,PoidsColis: error_message})
      AlertToast("warning",error_message)
    }else if(+vehicule.PoidsColis>100  || vehicule.PoidsColis.trim() === ''){
      error_message="Poids du colis invalide"
      setError({...error,PoidsColis: error_message})
      AlertToast("warning",error_message)
    }
  };
  const verifyAmorcage = () => {
    let error_message = null
    if(+vehicule.Amorcage<0 || vehicule.Amorcage.trim() === ''){
      error_message="Amorcage invalide"
      setError({...error,Amorcage: error_message})
      AlertToast("warning",error_message)
    }else if(+vehicule.Amorcage>100  || vehicule.Amorcage.trim() === ''){
      error_message="Amorcage invalide"
      setError({...error,Amorcage: error_message})
      AlertToast("warning",error_message)
    }
  };

  const resetError = (event) => {
      setError({...error,[event.target.name]: null})
  };

  //style
  const addContainer = {
    // backgroundColor: "red",
    width: "95%",
    height:"85vh",
    padding:10,
    marginTop:100,
    display: "flex",
    flexDirection: "column",
    alignItems : "center"
  }
  const headerLabelContainer = {
    // backgroundColor: "yellow",
    marginBottom: 10,
    width: "50%",
    dislay: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    minWidth:250,
    paddingTop:10
  }
  const formContainer = {
    // backgroundColor: "black",
    padding: 10,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom:30
  }

  const formContainerItem = {
    // backgroundColor: "white",
    margin: 10,
    width: 350,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }

  const action = {
    // backgroundColor: "grey",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 0
  }

  const actionItem = {
    margin: 25
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl" style={addContainer}>
      {showVerify && <Verify openModal={showVerify} closeModal={setShowVerify} data={vehicule} />}
      <div style={headerLabelContainer}>
        <HeaderLabel title="NOUVEAU VEHICULE"/>
      </div>
      <div style={formContainer}>
        <div style={formContainerItem}>
          <div>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, minWidth: "35ch" ,marginBottom:1.5},
              }}
              noValidate
            >
             <TextField
                error={error.Matricule ? (true) : (false)}
                helperText={error.Matricule ? (error.Matricule) : ''}
                onBlur={verifyMatricule}
                onFocus={resetError}
                variant="filled" required={true} name="Matricule" value={vehicule.Matricule} onChange={handleChange} placeholder="ex : N° Matricule" type="name" label="N° Matricule"
              />
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, minWidth: "35ch" ,marginBottom:4 },
              }}
              noValidate
            >
             <TextField
                error={error.Marque ? (true) : (false)}
                helperText={error.Marque ? (error.Marque) : ''}
                onBlur={verifyMarque}
                onFocus={resetError}
                variant="filled" required={true} name="Marque" value={vehicule.Marque} onChange={handleChange} placeholder="ex : N° Marque" type="name" label="N° Marque"
              />
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, minWidth: "35ch" ,marginBottom:4 },
              }}
              noValidate
            >
             <TextField
              error={error.Version ? (true) : (false)}
              helperText={error.Version ? (error.Version) : ''}
              onBlur={verifyVersion}
              onFocus={resetError}
                variant="filled" required={true} name="Version" value={vehicule.Version} onChange={handleChange} placeholder="ex :  Version" type="name" label="Version"
              />
            </Box>
          </div>
          {/* etat */}
          <div style={{}}>
            <Box component="form"
                sx={{
                  '& > :not(style)': { m: 2, minWidth: "35ch" , marginTop:3},
                }}
                noValidate
                autoComplete="off">
              <FormControl>
                <TextField
                  select
                  SelectProps={{
                    MenuProps: {
                      sx: { maxHeight: '35ch' }
                    }
                  }}
                  value={vehicule.EtatVehicule}
                  label=" ETAT VEHICULE "
                  onChange={handleChange}
                  name="EtatVehicule"
                  required
                >
                    {
                      EtatVehiculeData.map(({id,etat})=>{
                          return <MenuItem value={etat} key={id}>{`${etat}`}</MenuItem>
                      })
                    }   
                </TextField>        
              </FormControl>
            </Box>
          </div>            
        </div>
        <div style={formContainerItem}>
          <div>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, minWidth: "35ch" },
              }}
              noValidate
            >
              <TextField
                error={error.PoidsVehicule ? (true) : (false)}
                helperText={error.PoidsVehicule ? (error.PoidsVehicule) : ''}
                onBlur={verifyPoidsVehicule}
                onFocus={resetError}
                variant="filled" required={true} name="PoidsVehicule" value={vehicule.PoidsVehicule} onChange={handleChange} placeholder="ex :  Poids du Vehicule" type="number" label="Poids du Véhicule" />
            </Box>
          </div>
          <div>
           <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, minWidth: "35ch" ,marginBottom:5.5 },
              }}
              noValidate
            >
              <TextField
                error={error.PoidsColis ? (true) : (false)}
                helperText={error.PoidsColis ? (error.PoidsColis) : ''}
                onBlur={verifyPoidsColis}
                onFocus={resetError}
                variant="filled" required={true} name="PoidsColis" value={vehicule.PoidsColis} onChange={handleChange} placeholder="ex :  Poids du Colis" type="number" label="Poids du Colis" />
            </Box>
          </div>
          <div>
            <Box style={{minWidth: "35ch", marginBottom:4}}>
              <FormControl style={{minWidth: "100%"}}>
                <DatePicker label="DATE ARRIVEE AU PORT" required={true} defaultValue={vehicule.dateArriveeAuPort} getDate={handleChangeDateArrivee}/>
              </FormControl>
            </Box>
          </div>
          <div>
           <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, minWidth: "35ch", marginTop:6.5},
              }}
              noValidate
            >
              <TextField
                error={error.Amorcage ? (true) : (false)}
                helperText={error.Amorcage ? (error.Amorcage) : ''}
                onBlur={verifyAmorcage}
                onFocus={resetError}
                variant="filled" required={true} name="Amorcage" value={vehicule.Amorcage} onChange={handleChange} placeholder="ex :  Amorcage" type="number" label="Amorcage"
                />
              </Box>
          </div>
        </div>
      </div>
      <div style={action}>
        <div style={actionItem}>
          <ButtonComponent color='error' function={exit} name_of_btn="RETOUR" icon={<BackspaceIcon />} />
        </div>
        <div style={actionItem}>
          <ButtonComponent color='vertBlue' textColor="white" function={verify} name_of_btn="VOIR" icon={<VisibilityIcon />} />
        </div>
        <div style={actionItem}>
          <ButtonComponent color='root' function={add} name_of_btn="ENREGISTRER" icon={<SaveIcon />} />
        </div>
      </div>
    </div>
  )
};

export default AddVehicule;