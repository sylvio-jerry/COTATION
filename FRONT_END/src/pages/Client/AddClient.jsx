import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { ButtonComponent, HeaderLabel,AlertToast } from '../../components';
import { Box,InputLabel,TextField,MenuItem,Select,FormControl } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BackspaceIcon from '@mui/icons-material/Backspace';
import clientStyle from './clientStyle';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const AddClient = () => {
  const classes = clientStyle()
  let navigate = useNavigate();

  const [villeData,setVilleData] = useState([])

  const defaultClient = ()=>({
      nom_client: '',
      adresse: '',
      email: '',
      tel: '',
      ville: null
  })

  const defaultError = ()=>({
    nom_client: null,
    adresse: null,
    email: null,
    tel: null,
    ville: null
  })

  const [client, setClient] = useState(defaultClient());
  const [error,setError]=useState(defaultError())

    useEffect(()=>{
      getVille()
    },[])

    const getVille = async()=>{
      try {
        const {data} = await axios.get(`${API_URL}/api/ville`)
        if(data){
          setVilleData(data.data)
        }
       } catch (error) {
         console.log("error while getClientRequest:",error);
       }
    }

    const add = async()=>{
      if(client.nom_client.trim() !== '' && client.adresse.trim() !== '' && client.ville !== null ){
        if(error.nom_client === null  && error.adresse === null && error.email === null && error.tel === null  && error.ville === null ){
          try {
            let newClient = client
            newClient.ville = newClient.ville.id
            const data_ = await axios.post(`${API_URL}/api/client`,newClient)
            let {status,message} = data_.data
            if(status==="success"){
              AlertToast("success",message)
              setClient(defaultClient())
            }
           } catch ({response}) {
            console.log("error while postClientRequest:", response);
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
  const verifyClientName = () => {
    let error_message = null
    if(client.nom_client.trim().length<2){
      error_message="Au moins 2 caractères"
      setError({...error,nom_client: error_message})
      AlertToast("warning",error_message)
    }
  };
  
  const verifyClientAdresse = () => {
    let error_message = null

    if(client.adresse.trim().length<3){
      error_message="Au moins 3 caractères"
      setError({...error,adresse: error_message})
      AlertToast("warning",error_message)
    }
    if(client.adresse.trim().length>255){
      error_message="Adresse du client trop long"
      setError({...error,adresse: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyClientEmail= () => {

    if(client.email.trim().length<1){
      return
    }
    let error_message = null
    //verification email valide front end(regex)
    const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //regex.test return boolean if valid or not 
    let isMailValid = regex.test(client.email)
    if (!isMailValid) {
        error_message = "Adresse email invalide"
        setError({...error,email: error_message})
        AlertToast("warning",error_message)
    }
  };
  const verifyClientTel= () => {
    //should verify the typeof numero
    if(client.tel.trim().length<1){
      return
    }
    let error_message = null
    if(client.tel.trim().length!==10 || +client.tel<1 ){
      error_message="Numero téléphone devrait être composer de 10 chiffres"
      setError({...error,tel: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyClientVille= () => {
    let error_message = null
    if(client.ville===null){
      error_message="Veuillez choisir le ville du client"
      setError({...error,ville: error_message})
      AlertToast("warning",error_message)
    }
  };

  const resetError = (event) => {
      setError({...error,[event.target.name]: null})
  };

    const exit = ()=>{
      AlertToast("info","Operation annulé")
      navigate(-1)
    }

  const handleChange = (event) => {
    setClient({...client,[event.target.name]:event.target.value});
  };

  const handleChangeVille = (event,value) => {
    setClient({...client,ville:value});
  };


return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl ${classes.mainContainer}`}> 
      <div className={classes.headerLabelContainer}>
        <HeaderLabel title="NOUVEAU CLIENT"/>
      </div>
      <div className={classes.formContainer}>
      <div className={classes.formContainerItem}>
        <div>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 2, minWidth: "35ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              error={error.nom_client? (true) : (false)}
              helperText={error.nom_client ? (error.nom_client) : ''}
              onBlur={verifyClientName}
              onFocus={resetError}
              variant="filled" required={true} name="nom_client" value={client.nom_client} onChange={handleChange} placeholder="ex : Nom" type="name" label="Nom" />
          </Box>
        </div>
        <div>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 2, minWidth: "35ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              error={error.email? (true) : (false)}
              helperText={error.email ? (error.email) : ''}
              onBlur={verifyClientEmail}
              onFocus={resetError}
              variant="filled" required={false} name="email" value={client.email} onChange={handleChange} placeholder="ex : Email" type="name" label="Email" />
          </Box>
        </div>
        <div>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 2, minWidth: "35ch" },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              error={error.adresse ? (true) : (false)}
              helperText={error.adresse ? (error.adresse) : ''}
              onBlur={verifyClientAdresse}
              onFocus={resetError}
              variant="filled" required={true} name="adresse" value={client.adresse} onChange={handleChange} placeholder="ex : Adresse" type="name" label="Adresse" />
          </Box>
        </div>
      </div>
      <div className={classes.formContainerItem}>
        <div>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 2, minWidth: "35ch", marginBottom:2 },
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              error={error.tel ? (true) : (false)}
              helperText={error.tel ? (error.tel) : ''}
              onBlur={verifyClientTel}
              onFocus={resetError}
              variant="filled" required={false} name="tel" value={client.tel} onChange={handleChange}placeholder="ex : 034 xx xxx xx" type="number" label="Tel" />
          </Box>
        </div>
        <div>
          <Box style={{minWidth: "35ch", marginBottom: 0, marginTop:15}}>
            <FormControl style={{minWidth: "100%"}}>
               <Autocomplete
                isOptionEqualToValue={(option, value) =>
                  value === undefined || value === "" || option.id === value.id
                }
                onChange={handleChangeVille}
                value={client.ville}
                getOptionLabel={(option) => option.nom_ville}
                groupBy={(option) => option.province.nom_province}
                renderGroup={(params) => 
                  (<li style={{padding:8}} key={params.key}>
                    <div className='flex  bg-[#03C9D7] rounded-lg p-1 font-medium'>
                      <div><LocationOnIcon/></div>
                      <div style={{marginLeft: 5}}>{params.group.toUpperCase()}</div>
                    </div>
                    <ul style={{marginLeft:25}}>{params.children}</ul>
                  </li>)
                }
                disablePortal
                id="combo-box-demo"
                options={villeData.sort((a, b) =>
                  b.province_id.toString().localeCompare(a.province_id.toString())
                )}
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
                  error={error.ville ? (true) : (false)}
                  helperText={error.ville ? (error.ville) : ''}
                  onBlur={verifyClientVille}
                  onFocus={resetError}
                  {...params} label="VILLE" name='ville' required={true}/>}
              /> 
            </FormControl>
          </Box>
        </div>
      </div>
    </div>
    <div className={classes.action}>
      <div  className={classes.actionItem} >
        <ButtonComponent color='error' function={exit} name_of_btn="ANNULER" icon={<BackspaceIcon />} />
      </div>
      <div  className={classes.actionItem} >
        <ButtonComponent color='root' function={add} name_of_btn="ENREGISTRER" icon={<SaveIcon />} />
      </div>
    </div>
  </div>
)

};

export default AddClient;
