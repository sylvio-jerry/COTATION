import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { useNavigate,useLocation,useParams } from "react-router-dom";
import { ButtonComponent, HeaderLabel,AlertToast, DatePicker} from '../../components';
import { Box,TextField,FormControl } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BackspaceIcon from '@mui/icons-material/Backspace';
import Autocomplete from '@mui/material/Autocomplete';
import { Typography  } from '@mui/material';
import garantieStyle from './garantieStyle';
import filterFunction from "../../filterFunction";
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
var moment = require('moment');
moment.locale('fr');

const EditGarantie = () => {
  let {id} = useParams()
  let navigate = useNavigate();
  const { state } = useLocation();
  const classes = garantieStyle()
  const classes_ = garantieStyle()

  const defaultContrat = ()=>({
    num_contrat: '',
    observation : '',
    livraison:null
  })

  const defaultError = ()=>({
    num_contrat: null,
    observation : null,
    livraison:null
  })

  const [livraisonData,setLivraisonData] = useState([])
  const [livraisonDataWithoutGab,setLivraisonDataWithoutGab] = useState([])
  const [isFetchLivraisonDone,SetIsFetchLivraisonDone]=useState(false)
  const [contrat, setContrat] = useState(defaultContrat());
  const [error,setError]=useState(defaultError())


  useEffect(()=>{
    getLivraison()
  },[contrat.livraison])

  useEffect(()=>{
   if(isFetchLivraisonDone){
    getContrat()
   }
  },[isFetchLivraisonDone])

  useEffect(()=>{
    handleResume(contrat)
  },[contrat])

  const getContrat = async () =>{
    let contrat_data = {}
    try {
      const {data} = await axios.get(`${API_URL}/api/contrat_garantie/${id}`)
      if(data){
        contrat_data = data.data
      }
     } catch (error) {
       console.log("error while getClientRequest:",error);
     }

    // let livraison_from_contrat = contrat_data?.contrat_garantie_detail?.find(el=>el.contrat_garantie_id===contrat_data.id).equipement.livraison
    let livraison_from_contrat = contrat_data?.livraison
    let livraison = livraisonData.find(livraison=>livraison.id===livraison_from_contrat.id)
    
    let contrat_ = {
      num_contrat:contrat_data.num_contrat ,
      observation : contrat_data.observation,
      livraison:livraison
    }

    setContrat(contrat_)
    handleResume(contrat_)
  }

  const getLivraison = async()=>{
    //all gab liste

    const handleIfLivraisonAlreadyInContrat = (item) =>  +item?.id === +state.livraison.id || !item?.contrat_garantie

    const handleFamille= (item) => {
      const FAMILLE_GAB = "GAB"

      return !!item.equipement.find((equipement) => {
        if (equipement.famille.nom_famille !== FAMILLE_GAB) {
          item.equipement =
            item.equipement = item.equipement.filter(
              (equip) => equip.famille.nom_famille !== FAMILLE_GAB
            );
          return true;
        }
        return false;
      });
    };
    const checking = [handleFamille,handleIfLivraisonAlreadyInContrat];

    try {
      const {data} = await axios.get(`${API_URL}/api/livraison`)
      if(data){
        let data_ = data.data
        setLivraisonData(data_)
        const newArray = filterFunction(data.data, checking);
        setLivraisonDataWithoutGab(newArray)
        SetIsFetchLivraisonDone(true)
      }
     } catch (error) {
       console.log("error while getLivraisonRequest:",error);
     }
  }

  const defaultResume= ()=>({
      num_contrat: '',
      observation : '',
      num_bon_livraison: '',
      date_livraison: '',
      equipement: [],
      no_garantie:[],
      with_garantie:[]
  })

  const [resume, setResume] = useState(defaultResume())

  const handleResume = (contrat_) =>{
    if(contrat_.livraison===null){
      return;
    }

    let statut = (date_fin_contrat)=> moment(date_fin_contrat, "DD/MM/YYYY").isBefore(moment(),"day") ? "Expir??" : "Valide"
    
    let equipement_no_garantie = contrat_.livraison.equipement ? contrat_.livraison.equipement.filter(equipement=>equipement.duree_garantie === null) : []
    let equipement_with_garantie = contrat_.livraison.equipement ? contrat_.livraison.equipement.filter(equipement=>equipement.duree_garantie !== null) : []
    let contrat_garantie_detail = []

    if(equipement_with_garantie.length!==0){
        equipement_with_garantie.map((equipement)=>{
          contrat_garantie_detail.push({
            date_debut:moment(new Date(contrat_.livraison.date_livraison),"DD/MM/YYYY").format('DD/MM/YYYY'),
            date_fin:moment(new Date(contrat_.livraison.date_livraison),"DD/MM/YYYY").add(equipement.duree_garantie,"month").subtract(1,"day").format('DD/MM/YYYY'),
            statut: statut(moment(new Date(contrat_.livraison.date_livraison),"DD/MM/YYYY").add(equipement.duree_garantie,"month").subtract(1,"day").format('DD/MM/YYYY')),
            equipement: equipement,
          }) 
          return contrat_garantie_detail
        })
  }
    
    const resume_ = {
      num_contrat:contrat_.num_contrat,
      nom_client: contrat_.livraison.client.nom_client,
      adresse: contrat_.livraison.client.adresse,
      province: contrat_?.livraison?.client.ville.province.nom_province,
      ville: contrat_?.livraison?.client.ville.nom_ville,
      observation: contrat_.observation,
      date_livraison: contrat_.livraison.date_livraison ? moment(new Date(contrat_.livraison.date_livraison),"DD/MM/YYYY").format('DD/MM/YYYY') : "" ,
      num_bon_livraison: contrat_.livraison.num_bon_livraison? contrat_.livraison.num_bon_livraison : "" ,
      equipement: contrat_.livraison.equipement ? contrat_.livraison.equipement : [],
      no_garantie: equipement_no_garantie,
      with_garantie: contrat_garantie_detail
    }
    setResume(resume_)
 
  }

  const edit = async()=>{
    if(contrat.num_contrat.trim() !=='' && contrat.livraison !== null ){
      if(error.num_contrat === null  && error.livraison === null && error.observation === null){
        try {
          let updatedContrat = {
            num_contrat : contrat.num_contrat,
            livraison_id : contrat.livraison.id,
            observation : contrat.observation
          }
          const data_ = await axios.put(`${API_URL}/api/contrat_garantie/${id}`,updatedContrat)
          let {status,message} = data_.data
          if(status==="success"){
            AlertToast("success",message)
            setResume(defaultResume())
            exit()
          }
        } catch ({response}) {
          console.log("error while editGarantieRequest:", response);
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

  const handleChangeLivraison = (event,value) => {
    setContrat({...contrat,livraison:value});

  };

  const verifyNumContrat = () => {
    let error_message = null
    if(contrat.num_contrat.trim().length<2){
      error_message="Au moins 2 caract??res"
      setError({...error,num_contrat: error_message})
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

  const verifyLivaison= () => {
    let error_message = null
    if(contrat.livraison===null){
      error_message="Veuillez choisir le numero de bon de livraison"
      setError({...error,livraison: error_message})
      AlertToast("warning",error_message)
    }
  };
  
  const resetError = (event) => {
    console.log("reset error de ",event.target.name);
      setError({...error,[event.target.name]: null})
  };

  const RenderStatut = ( {statut} ) => {
    let colorStatut = statut === "Valide" ? "#006635" : "#992600"
    const statutStyle = {
      color: colorStatut
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
      <div className={classes_.headerLabelContainer}>
        <HeaderLabel title="MODIFICATION CONTRAT DE GARANTIE"/>
      </div>
      <div className={classes.formContainer}>
        <div className={`${classes.formContainerItemLeft}`} >
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
                variant="filled" required={true} name="num_contrat" value={contrat.num_contrat} onChange={handleChange} placeholder="ex : N?? Contrat" type="name" label="N?? CONTRAT" />
            </Box>
          </div>
          <div>
            <Box style={{minWidth: "35ch", marginBottom: 30, marginTop:15}}>
              <FormControl style={{minWidth: "100%"}}>
              <Autocomplete
                isOptionEqualToValue={(option, value) =>
                  value === undefined || value === "" || option.id === value.id
                }
                onChange={handleChangeLivraison}
                value={contrat.livraison ||  ''}
                getOptionLabel={(option) => `N?? BN Livraison - ${option.num_bon_livraison || ''}`}
                disablePortal
                id="combo-box-demo"
                options={livraisonDataWithoutGab}
                // options={livraisonData}
                sx={{ minWidth: "35ch" }}
                renderInput={(params) => <TextField 
                  error={error.livraison ? (true) : (false)}
                  helperText={error.livraison ? (error.livraison) : ''}
                  onBlur={verifyLivaison}
                  onFocus={resetError}
                  {...params} label="LIVRAISON" name='livraison' required={true}/>}
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
              <Typography variant="div"><strong>N?? CONTRAT : </strong>{resume.num_contrat}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>CLIENT : </strong>{resume.nom_client}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>PROVINCE CLIENT : </strong>{resume?.province}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>VILLE CLIENT : </strong>{resume?.ville}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>ADRESSE CLIENT: </strong>{resume.adresse }</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>OBSERVATION : </strong>{resume.observation}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N?? LIVRAISON : </strong>{resume.num_bon_livraison}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE LIVRAISON : </strong>{resume.date_livraison}</Typography>
            </div>
            {/* <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>TOUS LES MATERIELS LIVR??S : </strong>Nombre ({resume.equipement.length})</Typography>
            </div> */}
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div" ><strong>PAS DE GARANTIE : </strong>Nombre ({resume.no_garantie.length})</Typography>
              <div >
                <table className={` ${classes.tableContent}`}>
                  <thead className={` ${classes.tableHeader}`}>
                    <tr>
                      <th className={` ${classes.tableContentThTd}`} >N?? </th>
                      <th className={` ${classes.tableContentThTd}`} >N?? SERIE</th>
                      <th className={` ${classes.tableContentThTd}`} >MARQUE</th>
                      <th className={` ${classes.tableContentThTd}`} >MODELE</th>
                    </tr>
                  </thead>
                  <tbody>
                  { resume.no_garantie.map((equipement, index)=>{
                    return <tr key={index}>
                              <td className={` ${classes.tableContentThTd}`}>{index+1}</td>
                              <td className={` ${classes.tableContentThTd}`}>{equipement.num_serie}</td>
                              <td className={` ${classes.tableContentThTd}`}>{equipement.marque}</td>
                              <td className={` ${classes.tableContentThTd}`}>{equipement.modele}</td>
                          </tr>
                  })          
                  }
                  </tbody>
                </table>
              </div>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div" ><strong>AVEC GARANTIE : </strong>Nombre ({resume.with_garantie.length})</Typography>
              <div >
                <table className={` ${classes.tableContent}`}>
                  <thead  className={` ${classes.tableHeader}`}>
                    <tr>
                      <th className={` ${classes.tableContentThTd}`} >N?? </th>
                      <th className={` ${classes.tableContentThTd}`} >N?? SERIE</th>
                      <th className={` ${classes.tableContentThTd}`} >MARQUE</th>
                      <th className={` ${classes.tableContentThTd}`} >MODELE</th>
                      <th className={` ${classes.tableContentThTd}`} >GARANTIE</th>
                      <th className={` ${classes.tableContentThTd}`} >DEBUT</th>
                      <th className={` ${classes.tableContentThTd}`} >FIN</th>
                      <th className={` ${classes.tableContentThTd}`} >STATUT</th>
                    </tr>
                  </thead>
                  <tbody>
                  { resume.with_garantie.map((contrat_garantie, index)=>{
                    return <tr key={index}>
                              <td className={` ${classes.tableContentThTd}`}>{index+1}</td>
                              <td className={` ${classes.tableContentThTd}`}>{contrat_garantie.equipement.num_serie}</td>
                              <td className={` ${classes.tableContentThTd}`}>{contrat_garantie.equipement.marque}</td>
                              <td className={` ${classes.tableContentThTd}`}>{contrat_garantie.equipement.modele}</td>
                              <td className={` ${classes.tableContentThTd}`}>{`${contrat_garantie?.equipement?.duree_garantie} Mois`}</td>
                              <td className={` ${classes.tableContentThTd}`}>{contrat_garantie.date_debut}</td>
                              <td className={` ${classes.tableContentThTd}`}>{contrat_garantie.date_fin}</td>
                              <td className={` ${classes.tableContentThTd}`}><RenderStatut statut={contrat_garantie.statut} /></td>
                          </tr>
                  })          
                  }
                  </tbody>
                </table>
              </div>
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

export default EditGarantie;