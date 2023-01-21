import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ButtonComponent, HeaderLabel,AlertToast } from '../../components';
import { Box,InputLabel,TextField,MenuItem,Select,FormLabel,FormControl,FormControlLabel,Radio,RadioGroup } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BackspaceIcon from '@mui/icons-material/Backspace';
import equipementStyle from './equipementStyle';
import Autocomplete from '@mui/material/Autocomplete';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import KeyboardCommandKeyOutlinedIcon from '@mui/icons-material/KeyboardCommandKeyOutlined';
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const EditEquipement = () => {
  const classes = equipementStyle()
  let navigate = useNavigate();
  let {id} = useParams()

  useEffect(()=>{
    getFamille()
    getEquipement()
  },[])

  const defaultEquipement = ()=>({
    num_serie: "",
    marque: "",
    modele: "",
    duree_garantie: 12,
    is_locale: true,
    famille: "",
    redevance_contrat: "",
    fournisseur: ""
  })

  const defaultError = ()=>({
    num_serie: null,
    marque: null,
    modele: null,
    famille: null,
    redevance_contrat: null,
    fournisseur: null
  })

  const [equipement, setEquipement] = useState(defaultEquipement());
  const [familleData,setFamilleData] = useState([])
  const [isGaranted, setIsGaranted] = useState(true); //front design
  
  //true for interne
  const [disposition, setDisposition] = useState(true);
  const [error,setError]=useState(defaultError())

  const dureeGarantieDataData = [
    {duree: 1,mois: "1 Mois"},
    {duree: 2,mois: "2 Mois"},
    {duree: 3,mois: "3 Mois"},
    {duree: 4,mois: "4 Mois"},
    {duree: 5,mois: "5 Mois"},
    {duree: 6,mois: "6 Mois"},
    {duree: 7,mois: "7 Mois"},
    {duree: 8,mois: "8 Mois"},
    {duree: 9,mois: "9 Mois"},
    {duree: 10,mois: "10 Mois"},
    {duree: 11,mois: "11 Mois"},
    {duree: 12,mois: "12 Mois"},
  ]
  
    const getEquipement = async () =>{
      let equipement_data = {}

      try {
        const {data} = await axios.get(`${API_URL}/api/equipement/${id}`)
        if(data){
          equipement_data = data.data
        }
       } catch (error) {
         console.log("error while getClientRequest:",error);
       }
  

      let equipement_ = {
        num_serie: equipement_data.num_serie,
        marque: equipement_data.marque,
        modele: equipement_data.modele,
        duree_garantie: equipement_data.duree_garantie ? equipement_data.duree_garantie : 12,
        is_locale: equipement_data.is_locale,
        famille: equipement_data.famille,
        redevance_contrat: equipement_data.redevance_contrat ?  equipement_data.redevance_contrat : "",
        fournisseur: equipement_data.fournisseur ?  equipement_data.fournisseur : ""
      }

      let isEquipementGaranted = equipement_data.duree_garantie ? true : false
      setIsGaranted(isEquipementGaranted)
      setDisposition(equipement_data.is_locale)
      setEquipement(equipement_)
    }
    const getFamille = async()=>{
      try {
        const {data} = await axios.get(`${API_URL}/api/famille`)
        if(data){
          setFamilleData(data.data)
        }
      } catch (error) {
        console.log("error while getFamilleRequest:",error);
      }
    }

    const edit = async()=>{
      if(disposition && isGaranted){
        if(equipement.num_serie.trim() !== '' && equipement.modele.trim() !== '' && equipement.marque.trim() !== '' && equipement.famille !== null ){
          if(error.num_serie === null  && error.modele === null && error.marque === null && error.famille === null && error.redevance_contrat === null && error.fournisseur === null   ){
            try {
              let equipementUpdated = {...equipement,famille:equipement.famille.id,is_locale:disposition,duree_garantie:+equipement.duree_garantie,redevance_contrat:(equipement.redevance_contrat.toString().trim()==='' ) ? null : +equipement.redevance_contrat,fournisseur:(equipement.fournisseur.toString().trim()==='' ) ? null : equipement.fournisseur.toString().trim()}
              const data_ = await axios.put(`${API_URL}/api/equipement/${id}`,equipementUpdated)
              let {status,message} = data_.data
              if(status==="success"){
                AlertToast("success",message)
                exit()
              }
           } catch ({response}) {
              console.log("error while editGarantieRequest:", response);
              let {status,message} = response.data
              if(status==="failed"){
                AlertToast("error",message)
              }
           }
          }else{
            AlertToast("warning","Veuillez remplir correctement le formulaire")
          }
        }else{
          AlertToast("warning","Veuillez remplir les champs obligatoires")

        }
      }else{
        if(equipement.num_serie.trim() !== '' && equipement.modele.trim() !== '' && equipement.marque.trim() !== '' && equipement.famille !== null){
          if(error.num_serie === null  && error.modele === null && error.marque === null && error.famille === null && error.fournisseur === null){
            try {
              let equipementUpdated = {...equipement,famille:equipement.famille.id,is_locale:disposition,duree_garantie:null,fournisseur:(equipement.fournisseur.toString().trim()==='' ) ? null : equipement.fournisseur.toString().trim() }
              const data_ = await axios.put(`${API_URL}/api/equipement/${id}`,equipementUpdated)
              let {status,message} = data_.data
              if(status==="success"){
                AlertToast("success",message)
                exit()
              }
           } catch ({response}) {
              console.log("error while editGarantieRequest:", response);
              let {status,message} = response.data
              if(status==="failed"){
                AlertToast("error",message)
              }
           }
          }else{
            AlertToast("warning","Veuillez remplir correctement le formulaire")
          }
        }else{
          AlertToast("warning","Veuillez remplir les champs obligatoires")
        }
      }
    }

    const exit = ()=>{
      navigate(-1)
    }
  
    const skip = ()=>{
      AlertToast("info","Operation annulé")
      navigate(-1)
    }

  const handleChange = (event) => {
    setEquipement({...equipement,[event.target.name]:event.target.value});
  };

  const handleChangeFamille = (event,value) => {
    setEquipement({...equipement,famille:value});
  };

  const handleChangeIsGaranted= (event) => {
    if(event.target.value==="false"){
     setEquipement({...equipement,duree_garantie:12});
    }
     setIsGaranted(!isGaranted);
   };
 
   const handleChangeDisposition= (event) => {
     if(event.target.value==="false"){
       setEquipement({...equipement,duree_garantie:12});
       setIsGaranted(!isGaranted);
      }
     setDisposition(!disposition);
   };

  //handle error validation
  const verifyNumSerie = () => {
    let error_message = null
    if(equipement.num_serie.trim().length<2){
      error_message="Au moins 2 caractères"
      setError({...error,num_serie: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyMarque = () => {
    let error_message = null
    if(equipement.marque.trim().length<2){
      error_message="Au moins 2 caractères"
      setError({...error,marque: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyFournisseur = () => {
    if(equipement.fournisseur.toString().trim().length<1){
      return
    }
    let error_message="Au moins 2 caractères"
    if(equipement.fournisseur.trim().length<2){
      setError({...error,fournisseur: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyModele = () => {
    let error_message = null
    if(equipement.modele.trim().length<2){
      error_message="Au moins 2 caractères"
      setError({...error,modele: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyRedevanceContrat = () => {
    if(equipement.redevance_contrat.toString().trim().length<1){
      return
    }
    let error_message = "Montant invalide";
    if(+equipement.redevance_contrat<1){
      setError({...error,redevance_contrat: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyFamille= () => {
    let error_message = null
    if(equipement.famille===null){
      error_message="Veuillez choisir la famille de l'equipement"
      setError({...error,famille: error_message})
      AlertToast("warning",error_message)
    }
  };
  
  const resetError = (event) => {
      setError({...error,[event.target.name]: null})
  };

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl ${classes.mainContainer}`}>
       <div className={classes.headerLabelContainer}>
        <HeaderLabel title="MODIFICATION EQUIPEMENT"/>
      </div>
      <div className={classes.formContainer}>
      <div className={classes.formContainerItem}>
          {/* <div>
            <Box style={{minWidth: "35ch", marginBottom: 30, marginTop:15}}>
              <FormControl style={{minWidth: "100%"}}>
              <Autocomplete
                isOptionEqualToValue={(option, value) =>
                  value === undefined || value === "" || option.id === value.id
                }
                onChange={handleChangeFamille}
                value={equipement.famille}
                getOptionLabel={(option) => option.nom_famille || ''}
                disablePortal
                id="combo-box-demo"
                options={familleData}
                sx={{ minWidth: "35ch" }}
                renderInput={(params) => <TextField 
                  error={error.famille ? (true) : (false)}
                  helperText={error.famille ? (error.famille) : ''}
                  onBlur={verifyFamille}
                  onFocus={resetError}
                  {...params} label="FAMILLE" name='famille' required={true}/>}
              />
              </FormControl>
            </Box>
          </div> */}
          <div>
          <Box style={{minWidth: "35ch", marginBottom: 30, marginTop:15}}>
              <FormControl style={{minWidth: "100%"}}>
              <Autocomplete
                isOptionEqualToValue={(option, value) =>
                  value === undefined || value === "" || option.id === value.id
                }
                onChange={handleChangeFamille}
                value={equipement.famille}
                groupBy={(option) => option.service.nom_service}
                renderGroup={(params) => 
                  (<li style={{padding:5}} key={params.key}>
                    <div className='flex  bg-[#03C9D7] rounded-lg p-1 font-medium'>
                      <div><KeyboardCommandKeyOutlinedIcon style={{color: 'white'}}/></div>
                      <div style={{marginLeft: 5, color: 'white'}}>{params.group.toUpperCase()}</div>
                    </div>
                    <ul style={{margin:5}} key={params.key}>
                      {/* <div className='flex  bg-[#b4bfc0] rounded-lg p-1 font-medium'>
                      </div> */}
                        <div style={{marginLeft: 5}}>{params.children}</div>
                    </ul>
                  </li>)
                }
                getOptionLabel={(option) => `${option.nom_famille} ` || ''}
                disablePortal
                id="combo-box-demo"
                options={familleData.sort((a, b) =>
                  b.service_id.toString().localeCompare(a.service_id.toString())
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
                  error={error.famille ? (true) : (false)}
                  helperText={error.famille ? (error.famille) : ''}
                  onBlur={verifyFamille}
                  onFocus={resetError}
                  {...params} label="FAMILLE" name='famille' required={true}/>}
              />
              </FormControl>
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
                error={error.marque ? (true) : (false)}
                helperText={error.marque ? (error.marque) : ''}
                onBlur={verifyMarque}
                onFocus={resetError}
                variant="filled" required={true} name="marque" value={equipement.marque} onChange={handleChange} placeholder="ex : Marque" type="name" label="Marque" />
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
                error={error.modele ? (true) : (false)}
                helperText={error.modele ? (error.modele) : ''}
                onBlur={verifyModele}
                onFocus={resetError}
                variant="filled" required={true} name="modele" value={equipement.modele} onChange={handleChange} placeholder="ex : Type | Modele" type="name" label="Type / Modele" />
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
                error={error.num_serie ? (true) : (false)}
                helperText={error.num_serie ? (error.num_serie) : ''}
                onBlur={verifyNumSerie}
                onFocus={resetError}
                variant="filled" required={true} name="num_serie" value={equipement.num_serie} onChange={handleChange} placeholder="ex : N° serie" type="name" label="N° Serie" />
            </Box>
          </div>
        </div>
        <div className={classes.formContainerItem}>
          <div>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, minWidth: "35ch",marginBottom:3.5  },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                error={error.fournisseur ? (true) : (false)}
                helperText={error.fournisseur ? (error.fournisseur) : ''}
                onBlur={verifyFournisseur}
                onFocus={resetError}
                variant="filled" required={false} name="fournisseur" value={equipement.fournisseur} onChange={handleChange} placeholder="ex : Fournisseur" type="name" label="FOURNISSEUR" />
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, minWidth: "35ch", marginBottom:4  },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                error={error.redevance_contrat ? (true) : (false)}
                helperText={error.redevance_contrat ? (error.redevance_contrat) : ''}
                onBlur={verifyRedevanceContrat}
                onFocus={resetError}
                variant="filled" required={false} name="redevance_contrat" value={equipement.redevance_contrat} onChange={handleChange} placeholder="ex : xx xxx Ar "
                type="number"
                label="REDEVANCE CONTRAT en Ariary" />
            </Box>
          </div>
          <div style={{minWidth: "35ch", marginBottom:10}}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">Disposition de l'equipement :</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={disposition}
                onChange={handleChangeDisposition}
              >
                <FormControlLabel value={true} control={<Radio />} label="Interne" />
                <FormControlLabel value={false} control={<Radio />} label="Externe" />
              </RadioGroup>
            </FormControl>
          </div>
          {disposition && <div style={{minWidth: "35ch"}}>
            <FormControl>
              <FormLabel id="demo-row-radio-buttons-group-label">Avec Garantie :</FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={isGaranted}
                onChange={handleChangeIsGaranted}
              >
                <FormControlLabel value={true} control={<Radio />} label="Oui" />
                <FormControlLabel value={false} control={<Radio />} label="Non" />
              </RadioGroup>
            </FormControl>
          </div>}
          {isGaranted && disposition && <div>
              <Box component="form"
                sx={{
                  '& > :not(style)': { m: 2, minWidth: "35ch" , marginTop:3},
                }}
                noValidate
                autoComplete="off">
                <FormControl >
                  <InputLabel id="demo-simple-select-label">DUREE GARANTIE</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={equipement.duree_garantie}
                    label=" DUREE GARANTIE "
                    onChange={handleChange}
                    name="duree_garantie"
                    MenuProps={MenuProps}
                    
                  >
                  {
                      dureeGarantieDataData.map(({duree,mois})=>{
                          return <MenuItem value={duree} key={duree}>{mois}</MenuItem>
                      })
                  }   
                  </Select>
              </FormControl>
            </Box>
          </div>}
        </div>
      </div>
      <div className={classes.action}>
        <div  className={classes.actionItem}>
          <ButtonComponent color='error' function={skip} name_of_btn="ANNULER" icon={<BackspaceIcon />} />
        </div>
        <div  className={classes.actionItem}>
          <ButtonComponent color='root' function={edit} name_of_btn="ENREGISTRER" icon={<SaveIcon />} />
        </div>
      </div>
    </div>
  )
};

export default EditEquipement;