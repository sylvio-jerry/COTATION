import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { useLocation, useNavigate ,useParams} from "react-router-dom";
import { ButtonComponent, HeaderLabel, DatePicker,AlertToast} from '../../components';
import { Box,TextField,FormControl } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BackspaceIcon from '@mui/icons-material/Backspace';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifyAdd from './VerifyAdd';
import maintenanceStyle from './maintenanceStyle'
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
var moment = require('moment');
moment.locale('fr');

const RenewMaintenanceGab = () => {
  let {id} = useParams()
  const classes = maintenanceStyle()
  let navigate = useNavigate();
  let {state} = useLocation()

  const defaultContrat = () => ({
    num_contrat: '',
    num_facture: '',
    date_facture: null,
    date_debut: null,
    client:null,
    duree_annee: '',
    equipement: [],
    date_proposition: null,
    observation : '',
    redevance_totale: "",
  });

  const defaultError = ()=>({
    num_contrat: null,
    num_facture: null,
    date_facture: null,
    date_debut: null,
    duree_annee: null,
    client: null,
    equipement: null,
    date_proposition: null,
    observation : null,
    redevance_totale: null
  })

  const [contrat, setContrat] = useState(defaultContrat());
  const [equipementData,setEquipementData] = useState([])
  const [clientData,setClientData] = useState([])
  const [showVerify, setShowVerify] = useState(false);
  const [error,setError]=useState(defaultError())

  useEffect(()=>{
    getClient()
    getEquipement()
    getContrat()
  },[])
   
  const getContrat = async () =>{
    let contrat_ = null
    try {
      const {data} = await axios.get(`${API_URL}/api/contrat_maintenance/${id}`)
      if(data){
        contrat_ = data.data
        let contrat__ = {}
        if(contrat_){
          let equipement = []
          contrat_?.contrat_maintenance_detail.map((el)=>{
            equipement.push(el.equipement)
          })

            contrat__ = {
              num_contrat: "",
              num_facture: "",
              date_facture: null,
              date_debut: moment(contrat_?.date_debut).add(1,'year').format('DD/MM/YYYY'),
              // date_debut: null,
              client:contrat_.client,
              equipement : equipement,
              date_proposition: null,
              observation : contrat_.observation ? contrat_.observation  : "",
              redevance_totale: contrat_.redevance_totale ?  contrat_.redevance_totale : ""
          }
          setContrat(contrat__)
       }
      }
     } catch (error) {
       console.log("error while getClientRequest:",error);
     }
    

  }

  const getEquipement = async()=>{
    const getEquipementIds = state?.contrat_maintenance_detail.map(({equipement_id})=>equipement_id)
    try {
     
      const {data} = await axios.post(`${API_URL}/api/equipement/renew_add_to_contrat_maintenance`,{array_of_id_equipement_contrat:getEquipementIds})
      if(data){
        setEquipementData(data.data)
      }
     } catch (error) {
       console.log("error while getEquipementRequest:",error);
     }
  }

  const getClient = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/client`)
      if(data){
        setClientData(data.data)
      }
     } catch (error) {
       console.log("error while getClientRequest:",error);
     }
  }

  const renew = async()=>{
    if(contrat.num_contrat.trim() !==''  && contrat.duree_annee.length>0 && contrat.date_debut !== null && contrat.client !== null && contrat.equipement.length>0 ){
      if(error.num_contrat === null && error.duree_annee === null && error.date_debut === null  && error.client === null && error.equipement === null && error.redevance_totale === null){
        try {
          let contrat_ = contrat
          let equipementId = []
          contrat_.equipement.map((el)=>{
            equipementId.push(el.id)
          })
          let redevance_totale_=(contrat_.redevance_totale.toString().trim()==='' ) ? null : +contrat_.redevance_totale
          let RenewedContrat = {
            num_contrat: contrat_.num_contrat,
            num_facture: contrat_.num_facture,
            date_facture: contrat_.date_facture ? moment(contrat_.date_facture,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
            date_debut: contrat_.date_debut ? moment(contrat_.date_debut,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
            client_id: contrat_.client.id,
            equipement_id: equipementId,
            duree_annee: +contrat_.duree_annee,
            date_proposition: contrat_.date_proposition ? moment(contrat_.date_proposition,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
            observation : contrat_.observation,
            redevance_totale: redevance_totale_
          }
          const data_ = await axios.post(`${API_URL}/api/contrat_maintenance`,RenewedContrat)
          let {status} = data_.data
          if(status==="success"){
            AlertToast("success","Renouvellement avec succ??s")
            setContrat(defaultContrat())
            exit()
          }
        } catch ({response}) {
            console.log("error while renewServiceRequest:", response);
            let {status} = response.data
            if(status==="failed"){
              AlertToast("error","Echec du renouvellement")
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


  //handle error handler
  const verifyNumContrat= () => {
    let error_message = null
    if(contrat.num_contrat.trim().length<2){
      error_message="Au moins 2 caract??res"
      setError({...error,num_contrat: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyDureeAnnee = () => {
    let error_message = null
    if(+contrat.duree_annee<1){
      error_message="Dur??e de contrat invalide"
      setError({...error,duree_annee: error_message})
      AlertToast("warning",error_message)
    }else if(+contrat.duree_annee > 25){
      error_message="Dur??e de contrat invalide"
      setError({...error,duree_annee: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyClient= () => {
    let error_message = null
    if(contrat.client===null){
      error_message="Veuillez choisir le client"
      setError({...error,client: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyRedevanceContrat = () => {
    if(contrat.redevance_totale.toString().trim().length<1){
      return
    }
    let error_message = "Montant invalide";
    if(+contrat.redevance_totale<1){
      setError({...error,redevance_totale: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyEquipement= () => {
    let error_message = null
    if(contrat.equipement.length<1){
      error_message="Veuillez choisir l'??quipemet"
      setError({...error,equipement: error_message})
      AlertToast("warning",error_message)
    }
  };

  const resetError = (event) => {
      setError({...error,[event.target.name]: null})
  };

  const exit = ()=>{
    navigate(-1)
  }

  const skip = ()=>{
    AlertToast("info","Operation annul??")
    navigate(-1)
  }

  const verify = ()=>{
    setShowVerify(!showVerify)
  }

  const sumOfRedevanceContrat = (equipement=[])=>{
    if(!equipement) return
    let redevance_totale_ = 0
    equipement.map((equip)=>{
      if(equip.redevance_contrat){
        redevance_totale_ = redevance_totale_ + +equip.redevance_contrat
      }
    })
    return redevance_totale_
  }
  
  const handleChange = (event) => {
    setContrat({...contrat,[event.target.name]:event.target.value});
  };

  const handleChangeClient = (event,value) => {
    setContrat({...contrat,client:value});
  };

  const handleChangeEquipement = (event,value) => {
    let redevance_totale = sumOfRedevanceContrat(value)
    setContrat({...contrat,equipement:value, redevance_totale });
  };


  const handleChangeDateDebut = (date) => {
    setContrat({...contrat,date_debut:date});
  };

  const handleChangeDateFacture = (date) => {
    setContrat({...contrat,date_facture:date});
  };

  const handleChangeDateProposition = (date) => {
    setContrat({...contrat,date_proposition:date});
  };

  return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl ${classes.mainContainer}`}>
       {showVerify && <VerifyAdd openModal={showVerify} closeModal={setShowVerify} data={contrat} />}
      <div className={classes.headerLabelContainer}>
        <HeaderLabel title="RENOUVELLEMENT CONTRAT DE MAINTENANCE"/>
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
            >
              <TextField
                error={error.num_contrat ? (true) : (false)}
                helperText={error.num_contrat ? (error.num_contrat) : ''}
                onBlur={verifyNumContrat}
                onFocus={resetError}
                variant="filled" required={true} name="num_contrat" value={contrat.num_contrat} onChange={handleChange} placeholder="ex : N?? Contrat" type="name" label="N?? CONTRAT"
              />
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, minWidth: "35ch", marginBottom:4 },
              }}
              noValidate
            >
              <TextField variant="filled" required={false} name="num_facture" value={contrat.num_facture} onChange={handleChange} placeholder="ex : N?? Facture" type="name" label="N?? FACTURE" />
            </Box>
          </div>
          <div>
            <Box style={{minWidth: "35ch", marginBottom:30}}>
              <FormControl style={{minWidth: "100%"}}>
                <DatePicker label="DATE FACTURE" defaultValue={contrat.date_facture} getDate={handleChangeDateFacture}/>
              </FormControl>
            </Box>
          </div>
          <div>
            <Box style={{minWidth: "35ch", marginBottom:15}}>
              <FormControl style={{minWidth: "100%"}}>
                <DatePicker label="DATE DEBUT CONTRAT" defaultValue={contrat.date_debut} getDate={handleChangeDateDebut}/>
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
            >
              <TextField
                error={error.duree_annee ? (true) : (false)}
                helperText={error.duree_annee ? (error.duree_annee) : ''}
                onBlur={verifyDureeAnnee}
                onFocus={resetError}
                variant="filled" required={true} name="duree_annee" value={contrat.duree_annee} onChange={handleChange} placeholder="ex : 1 an " type="number" label="DUREE CONTRAT EN ANNEE" />
            </Box>
          </div>
        </div>
        <div className={classes.formContainerItem}>
          <div>
            <Box style={{minWidth: "35ch", marginBottom: 30, marginTop:15}}>
              <FormControl style={{minWidth: "100%"}}>
              <Autocomplete
                isOptionEqualToValue={(option, value) => value === undefined || value === "" || option.id === value.id }
                // defaultValue={{id:2,nom_client: "BNI"}}
                defaultValue={null}
                value={contrat.client}
                onChange={handleChangeClient}
                getOptionLabel={(option) => `${option.nom_client || ''} ${option.ville.nom_ville || ''} ${option.adresse || ''} `}
                disablePortal
                disabled
                id="combo-box-demo"
                options={clientData} 
                sx={{ minWidth: "35ch" }}
                renderInput={(params) => <TextField 
                  error={error.client ? (true) : (false)}
                  helperText={error.client ? (error.client) : ''}
                  onBlur={verifyClient}
                  onFocus={resetError}
                  {...params} label="CLIENT" name='client' required={true}/>}
              />
              </FormControl>
            </Box>
          </div>
          <div>
            <Box style={{minWidth: "35ch",marginBottom:15}}>
              <FormControl style={{minWidth: "100%"}}>
                <Autocomplete
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  // isOptionEqualToValue={(option, value) =>
                  //   value === undefined || value === "" || option.id === value.id
                  // }
                  onChange={handleChangeEquipement}
                  multiple
                  value={contrat.equipement}
                  id="checkboxes-tags-demo"
                  groupBy={(option) => option.famille.nom_famille}
                  renderGroup={(params) => 
                    (<li style={{padding:5}} key={params.key}>
                      <div className='flex  bg-[#03C9D7] rounded-lg p-1 font-medium'>
                        <div><LanOutlinedIcon style={{color: 'white'}}/></div>
                        <div style={{marginLeft: 5, color: 'white'}}>{params.group.toUpperCase()}</div>
                      </div>
                      <ul style={{margin:5}}  key={params.key}>
                        {/* <div className='flex  bg-[#b4bfc0] rounded-lg p-1 font-medium'>
                        </div> */}
                          <div style={{marginLeft: 5}}>{params.children}</div>
                      </ul>
                    </li>)
                  }
                  options={equipementData?.sort((a, b) =>
                    a?.famille?.nom_famille?.toString().localeCompare(b?.famille?.nom_famille?.toString())
                  )}
                  disableCloseOnSelect
                  getOptionLabel={(option) => `${option.num_serie || ''} | ${option.marque || ''} | ${option.modele || ''} `}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {`${option.num_serie} | ${option.marque} | ${option.modele}`}
                    </li>
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
                  renderInput={(params) => (
                    <TextField 
                      error={error.equipement ? (true) : (false)}
                      helperText={error.equipement ? (error.equipement) : ''}
                      onBlur={verifyEquipement}
                      onFocus={resetError}
                      {...params} label="EQUIPEMENT" placeholder="Equipement" required={true} name="equipement" />
                  )}
                />
              </FormControl>
            </Box>
          </div>  
          <div>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 2, minWidth: "35ch", marginBottom: 4 },
              }}
              noValidate
            >
              <TextField
                error={error.redevance_totale ? true : false}
                helperText={error.redevance_totale ? error.redevance_totale : ""}
                onBlur={verifyRedevanceContrat}
                onFocus={resetError}
                variant="filled"
                required={true}
                name="redevance_totale"
                value={contrat.redevance_totale}
                onChange={handleChange}
                placeholder="ex : xx xxx Ar "
                type="number"
                label="REDEVANCE TOTALE en Ariary"
              />
            </Box>
          </div>
          <div>
            <Box style={{minWidth: "35ch", marginBottom:15}}>
              <FormControl style={{minWidth: "100%"}}>
                <DatePicker label="DATE PROPOSITION" defaultValue={contrat.date_proposition} getDate={handleChangeDateProposition}/>
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
            >
              <TextField multiline rows={3} variant="filled" required={false} name="observation" value={contrat.observation} onChange={handleChange} placeholder="ex : Observation" type="name" label="OBSERVATION" />
            </Box>
          </div>
        </div>
      </div>
      <div className={classes.action}>
        <div  className={classes.actionItem}>
          <ButtonComponent color='error' function={skip} name_of_btn="ANNULER" icon={<BackspaceIcon />} />
        </div>
        <div className={classes.actionItem}>
          <ButtonComponent color='vertBlue' textColor="white" function={verify} name_of_btn="VOIR" icon={<VisibilityIcon />} />
        </div>
        <div  className={classes.actionItem}>
          <ButtonComponent color='success' function={renew} name_of_btn="RENOUVELER" icon={<SaveIcon />} />
        </div>
      </div>
    </div>
  )
};

export default RenewMaintenanceGab;


