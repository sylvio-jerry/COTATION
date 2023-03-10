import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { useLocation,useNavigate,useParams } from "react-router-dom";
import { ButtonComponent, HeaderLabel,AlertToast, DatePicker} from '../../components';
import { Box,InputLabel,TextField,MenuItem,Select,FormControl } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BackspaceIcon from '@mui/icons-material/Backspace';
import VisibilityIcon from '@mui/icons-material/Visibility';
import garantieGabStyle from './garantieGabStyle';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Typography , Divider } from '@mui/material';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
var moment = require('moment');
moment.locale('fr');

const EditGarantieGab = () => {
  let {id} = useParams()
  const {state} = useLocation()
  useEffect(()=>{
    getEquipement()
  },[])

  const classes = garantieGabStyle()

  let navigate = useNavigate();

  const [equipementData,setEquipementData] = useState([])
  
  const getEquipement = async()=>{
    let equipement_id = state?.equipement?.id
    try {
      const {data} = await axios.get(`${API_URL}/api/equipement/edit_to_contrat_garantie_gab/${equipement_id}`)
      if(data){
        setEquipementData(data.data)
        SetIsFetchEquipementDone(true)
      }
     } catch (error) {
       console.log("error while get_edit_to_contrat_garantie_gab:",error);
       
     }
  }

  const defaultContrat = () => ({
    equipement: null,
    date_installation: null,
    site_installation : '',
    observation : ''
  });
  
  const defaultError = ()=>({
    equipement: null,
    date_installation: null,
    site_installation : null,
    observation : null
  })

  const [contrat, setContrat] = useState(defaultContrat());
  const [error,setError]=useState(defaultError())

  const defaultResume = () => ({
    equipement: null,
    date_installation: null,
    site_installation : '',
    observation : ''
  });

  const [resume, setResume] = useState(defaultResume())
  const [isFetchEquipementDone,SetIsFetchEquipementDone]=useState(false)

  useEffect(()=>{
    if(isFetchEquipementDone){
     getContrat()
    }
   },[isFetchEquipementDone])

  const date_format = (date,stringFormat="DD/MM/YYYY")=>{
    let date_formatted = moment(new Date(date), stringFormat).format(stringFormat)
    return date_formatted;
  }


  const getContrat = async () =>{
    let contrat_data = {}
    try {
      const {data} = await axios.get(`${API_URL}/api/contrat_garantie_gab/${id}`)
      if(data){
        contrat_data = data.data
      }
     } catch (error) {
       console.log("error while getContratRequest:",error);
     }

    let contrat_ = {
      equipement: contrat_data?.equipement,
      date_installation: contrat_data?.date_installation ? date_format(contrat_data?.date_installation) : null,
      site_installation : contrat_data?.site_installation,
      observation : contrat_data?.observation ? contrat_data?.observation : ''
    }
    handleResume(contrat_)
    setContrat(contrat_)
  }


  const handleResume = (contrat_) =>{
    if(!contrat_.equipement || contrat_.equipement===null || typeof contrat_.equipement=="undefined"){
      return;
    }

    let statut = (date_fin_contrat)=> moment(date_fin_contrat, "DD/MM/YYYY").isBefore(moment(),"day") ? "Expir??" : "Valide"
  
  const resume_ = {
      site_installation: contrat_?.site_installation,
      equipement: contrat_?.equipement ? contrat_?.equipement : null,
      num_serie : contrat_?.equipement?.num_serie ? contrat_?.equipement.num_serie : '',
      marque : contrat_?.equipement?.marque ? contrat_?.equipement?.marque : '',
      modele : contrat_?.equipement?.modele ? contrat_?.equipement?.modele : '',
      date_installation:contrat_?.date_installation ? moment(contrat_.date_installation,"DD/MM/YYYY").format('DD/MM/YYYY') : '' ,
      date_fin:contrat_?.date_installation ? moment(contrat_?.date_installation,"DD/MM/YYYY").add(+contrat_.equipement.duree_garantie,"month").subtract(1,"day").format('DD/MM/YYYY') : '',
      observation: contrat_?.observation,
      statut: statut(moment(new Date(contrat_?.date_installation),"DD/MM/YYYY").add(contrat_?.equipement.duree_garantie,"month").subtract(1,"day").format('DD/MM/YYYY')),
      nom_client: contrat_?.equipement?.livraison?.client?.nom_client,
      province: contrat_?.equipement?.livraison?.client?.ville?.province?.nom_province,
      ville: contrat_?.equipement?.livraison?.client?.ville?.nom_ville,
      adresse: contrat_?.equipement?.livraison?.client?.adresse,
      date_livraison: contrat_?.equipement?.livraison?.date_livraison ? moment(new Date(contrat_?.equipement?.livraison?.date_livraison),"DD/MM/YYYY").format('DD/MM/YYYY') : "" ,
      duree_garantie: contrat_?.equipement?.duree_garantie ? contrat_?.equipement?.duree_garantie+' Mois' : '' ,
      num_facture : contrat_?.equipement?.livraison?.num_facture ? contrat_?.equipement?.livraison?.num_facture : "Non Factur??" ,
      date_facture : contrat_?.equipement?.livraison?.date_facture ? moment(new Date(contrat_?.equipement?.livraison?.date_facture),"DD/MM/YYYY").format('DD/MM/YYYY') : "Non Factur??",
      num_bon_livraison : contrat_?.equipement?.livraison?.num_bon_livraison
    }

    setResume(resume_)
 
  }

  useEffect(()=>{
    handleResume(contrat)
  },[contrat])

    const edit = async()=>{
      if(contrat.site_installation.trim() !=='' && contrat.date_installation !== null && contrat.equipement !== null ){
        if(error.site_installation === null  && error.date_installation === null && error.date_installation === null){
          try {
            let contrat_ = contrat
            let updatedContrat = {
              equipement: contrat_?.equipement,
              date_installation: moment(contrat_?.date_installation,'DD/MM/YYYY').format('YYYY-MM-DD'),
              site_installation : contrat_?.site_installation,
              observation : (contrat_?.observation.trim() !== '') ? contrat_?.observation.trim() : null
            }
            const data_ = await axios.put(`${API_URL}/api/contrat_garantie_gab/${id}`,updatedContrat)
            let {status,message} = data_.data
            if(status==="success"){
              AlertToast("success",message)
              setContrat(defaultContrat())
              setResume(defaultResume())
              exit()
            }
           } catch ({response}) {
            console.log("error while postGabRequest:", response);
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
  
    const exit = ()=>{
      navigate(-1)
    }
  
    const skip = ()=>{
      AlertToast("info","Operation annul??")
      navigate(-1)
    }
  const handleChange = (event) => {
    setContrat({...contrat,[event.target.name]:event.target.value});
  };

  const handleChangeEquipement = (event,value) => {
    setContrat({...contrat,equipement:value});
  };

  const handleChangeDateInstallation = (date) => {
    setContrat({...contrat,date_installation:date});
  };

  const verifySiteInstallation = () => {
    let error_message = null
    if(contrat.site_installation.trim().length<2){
      error_message="Au moins 2 caract??res"
      setError({...error,site_installation: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyObservation = () => {
    let error_message = null
    if(contrat.observation.trim().length>255){
      error_message="Observation trop long"
      setError({...error,observation: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyEquipement= () => {
    let error_message = null
    if(contrat.equipement===null){
      error_message="Veuillez choisir l'equipement"
      setError({...error,equipement: error_message})
      AlertToast("warning",error_message)
    }
  };
  
  const resetError = (event) => {
      setError({...error,[event.target.name]: null})
  };

  const RenderStatut = ( {statut} ) => {
    let colorStatut = statut === "Valide" ? "#006635" : "#992600"
    const statutStyle = {
      color: colorStatut,
      marginLeft: 4
    };

    return (
      <Box>
          <Typography style={statutStyle}>
             {statut}
          </Typography>
      </Box>
    );
  };

  return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  ${classes.mainContainer}`}>
      <div className={classes.headerLabelContainer}>
        <HeaderLabel title="MODIFICATION GARANTIE GAB"/>
      </div>
      <div className={classes.formContainer}>
        <div className={`${classes.formContainerItemLeft}`} >
          {/* <div>
            <Box style={{minWidth: "35ch", marginBottom: 30, marginTop:15}}>
              <FormControl style={{minWidth: "100%"}}>
              <Autocomplete
                isOptionEqualToValue={(option, value) =>
                  value === undefined || value === "" || option.id === value.id
                }
                onChange={handleChangeEquipement}
                value={contrat.equipement }
                getOptionLabel={(option) => option.num_serie}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    {`${option.num_serie} | ${option.marque} | ${option.modele}`}
                  </li>
                )}
                disablePortal
                id="combo-box-demo"
                options={equipementData}
                sx={{ minWidth: "35ch" }}
                renderInput={(params) => <TextField 
                  error={error.equipement ? (true) : (false)}
                  helperText={error.equipement ? (error.equipement) : ''}
                  onBlur={verifyEquipement}
                  onFocus={resetError}
                  {...params} label="EQUIPEMENT" name='equipement' required={true}/>}
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
                  onChange={handleChangeEquipement}
                  value={contrat.equipement}
                  id="checkboxes-tags-demo"
                  groupBy={(option) => option.famille.nom_famille}
                  renderGroup={(params) => 
                    (<li style={{padding:5}} key={params.key}>
                      <div className='flex  bg-[#03C9D7] rounded-lg p-1 font-medium'>
                        <div><LanOutlinedIcon style={{color: 'white'}}/></div>
                        <div style={{marginLeft: 5, color: 'white'}}>{params.group.toUpperCase()}</div>
                      </div>
                      <ul style={{margin:5}} key={params.key}>
                          <div style={{marginLeft: 5}}>{params.children}</div>
                      </ul>
                    </li>)
                  }
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      {`${option.num_serie} | ${option.marque} | ${option.modele}`}
                    </li>
                  )}
                  options={equipementData.sort((a, b) =>
                    a.famille.nom_famille.toString().localeCompare(b.famille.nom_famille.toString())
                  )}
                  // disableCloseOnSelect
                  getOptionLabel={(option) => `${option.num_serie || ''} | ${option.marque || ''} | ${option.modele || ''} `}
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
                    error={error.equipement ? (true) : (false)}
                    helperText={error.equipement ? (error.equipement) : ''}
                    onBlur={verifyEquipement}
                    onFocus={resetError}
                    {...params} label="EQUIPEMENT" name='equipement' required={true}/>}
                />
              </FormControl>
            </Box>
          </div> 
          <div>
            <Box style={{minWidth: "35ch", marginBottom: 30, marginTop:15}}>
              <FormControl style={{minWidth: "100%"}}>
                <DatePicker label="DATE INSTALLATION" required={true} defaultValue={contrat.date_installation} getDate={handleChangeDateInstallation}/>
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
                error={error.site_installation ? (true) : (false)}
                helperText={error.site_installation ? (error.site_installation) : ''}
                onBlur={verifySiteInstallation}
                onFocus={resetError}
                variant="filled" required={true} name="site_installation" value={contrat.site_installation} onChange={handleChange} placeholder="ex : Site Installation" type="name" label="SITE D'INSTALLATION" />
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
                error={error.observation ? (true) : (false)}
                helperText={error.observation ? (error.observation) : ''}
                onBlur={verifyObservation}
                onFocus={resetError}
                multiline rows={3} variant="filled" required={false} name="observation" value={contrat.observation} onChange={handleChange} placeholder="ex : Observation" type="name" label="OBSERVATION" />
            </Box>
          </div>
        </div>
        <div className={` ${classes.formContainerItemRight}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>RECAPITULATIF </strong></Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>CLIENT : </strong>{resume.nom_client}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>PROVINCE CLIENT : </strong>{resume.province }</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>VILLE CLIENT : </strong>{resume.ville }</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>ADRESSE CLIENT : </strong>{resume.adresse }</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>EQUIPEMENT </strong></Typography>
              <div className={` ${classes.tabledetail} ml-3`}>
                <table className={` ${classes.tableContent}`}>
                  <thead  className={` ${classes.tableHeader}`}>
                    <tr>
                      <th className={` ${classes.tableContentThTd}`} >N?? SERIE</th>
                      <th className={` ${classes.tableContentThTd}`} >MARQUE</th>
                      <th className={` ${classes.tableContentThTd}`} >MODELE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={` ${classes.tableContentThTd}`}>{resume.num_serie}</td>
                      <td className={` ${classes.tableContentThTd}`}>{resume.marque}</td>
                      <td className={` ${classes.tableContentThTd}`}>{resume.modele}</td>
                    </tr>
                  </tbody>
                </table>
              </div>  
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>SITE D'INSTALLATION : </strong>{resume.site_installation}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE INSTALLATION : </strong>{resume.date_installation}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE FIN GARANTIE : </strong>{resume.date_fin}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DUREE GARANTIE : </strong>{resume?.duree_garantie}</Typography>
            </div>
           {/* <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>STATUT : </strong>{resume?.statut}</Typography>
            </div> */}
            <div className={` ${classes.resumeItem} flex`}>
              <Typography variant="div"><strong>STATUT: </strong></Typography>
              <div>{ resume?.date_installation ? <RenderStatut statut={resume?.statut}/> : ""}</div>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>OBSERVATION : </strong>{resume.observation}</Typography>
            </div>
            <div className={` ${classes.resumeItem} ml-8 mr-8`}>
              <Divider />
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N?? BN LIVRAISON : </strong>{resume.num_bon_livraison}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE LIVRAISON : </strong>{resume.date_livraison}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N?? FACTURE LIVRAISON : </strong>{resume.num_facture}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE FACTURE LIVRAISON : </strong>{resume.date_facture}</Typography>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.action}>
        <div className={classes.actionItem}>
          <ButtonComponent color='error' function={skip} name_of_btn="ANNULER" icon={<BackspaceIcon />} />
        </div>
        <div  className={classes.actionItem}>
          <ButtonComponent color='root' function={edit} name_of_btn="ENREGISTRER" icon={<SaveIcon />} />
        </div>
      </div>
    </div>
  )
};

export default EditGarantieGab;