import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { useNavigate,useLocation,useParams } from "react-router-dom";
import { ButtonComponent, HeaderLabel, DatePicker} from '../../components';
import BackspaceIcon from '@mui/icons-material/Backspace';
import globalStyle from '../../Style/globalStyle';
import garantieGabStyle from './garantieGabStyle';
import { Typography ,Box } from '@mui/material';

var moment = require('moment');
moment.locale('fr');
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
const DetailGarantieGab = () => {
  let {id} = useParams()
  let navigate = useNavigate();
  const {state} = useLocation()

  const classes = globalStyle()
  const classes_ = garantieGabStyle()

  const defaultContrat = ()=>({
    equipement: null,
    date_installation: null,
    site_installation : '',
    observation : ''
  })

  const [resume, setResume] = useState(defaultContrat());

  useEffect(()=>{
    getResume()
  },[])

  const date_format = (date,stringFormat="DD/MM/YYYY")=>{
    let date_formatted = moment(new Date(date), stringFormat).format(stringFormat)
    return date_formatted;
  }

  const getResume = async () =>{

    let contrat_data = {}

    try {
      const {data} = await axios.get(`${API_URL}/api/contrat_garantie_gab/${id}`)
      if(data){
        contrat_data = data.data
      }
     } catch (error) {
       console.log("error while getClientRequest:",error);
     }
    
    let contrat_ = {
      site_installation: contrat_data?.site_installation,
      equipement: contrat_data?.equipement ? contrat_data?.equipement : null,
      num_serie : contrat_data?.equipement?.num_serie ? contrat_data?.equipement.num_serie : '',
      marque : contrat_data?.equipement?.marque ? contrat_data?.equipement?.marque : '',
      modele : contrat_data?.equipement?.modele ? contrat_data?.equipement?.modele : '',
      date_installation:contrat_data?.date_installation ? date_format(contrat_data.date_installation) : '' ,
      date_fin:contrat_data?.date_installation ? date_format(contrat_data?.date_fin) : '',
      observation: contrat_data?.observation ?  contrat_data?.observation : "Pas d'observation",
      statut: contrat_data?.statut,
      nom_client: contrat_data?.livraison?.client?.nom_client,
      province: contrat_data?.livraison?.client?.ville?.province?.nom_province,
      ville: contrat_data?.livraison?.client?.ville?.nom_ville,
      adresse: contrat_data?.livraison?.client?.adresse,
      date_livraison: contrat_data?.livraison?.date_livraison ? date_format(contrat_data?.livraison?.date_livraison): "" ,
      duree_garantie: contrat_data?.equipement?.duree_garantie ? contrat_data?.equipement?.duree_garantie+' Mois' : '' ,
      num_facture : contrat_data?.livraison?.num_facture ? contrat_data?.livraison?.num_facture : "Non Facturé" ,
      date_facture : contrat_data?.livraison?.date_facture ? date_format(contrat_data?.livraison?.date_facture) : "Non Precisé",
      num_bon_livraison : contrat_data?.livraison?.num_bon_livraison
    }

    setResume(contrat_)
  }

  const exit = ()=>{
    navigate(-1)
  }

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
      <div className={classes_.headerLabelContainer}>
        <HeaderLabel title="DETAIL CONTRAT DE GARANTIE GAB"/>
      </div>
      <div className={` ${classes.infoContainer}`}>
        <div className={` ${classes.infoContainerItem} ${classes.infoContainerItemLeft}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFO CONTRAT </strong></Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>CLIENT : </strong>{resume.nom_client}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>PROVINCE CLIENT : </strong>{resume.province }</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>VILLE CLIENT: </strong>{resume.ville }</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>ADRESSE CLIENT: </strong>{resume.adresse }</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>EQUIPEMENT : </strong></Typography>
              <div className={` ${classes.tabledetail} ml-3`}>
                <table className={` ${classes.tableContent}`}>
                  <thead  className={` ${classes.tableHeader}`}>
                    <tr>
                      <th className={` ${classes.tableContentThTd}`} >N° SERIE</th>
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
              <Typography variant="div"><strong>STATUT: </strong>{resume?.statut}</Typography>
            </div> */}
            <div className={` ${classes.resumeItem} flex`}>
              <Typography variant="div"><strong>STATUT: </strong></Typography>
              <div>{ resume?.date_installation ? <RenderStatut statut={resume?.statut}/> : ""}</div>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>OBSERVATION : </strong>{resume.observation}</Typography>
            </div>
          </div>
        </div>
        <div className={` ${classes.infoContainerItem} ${classes.infoContainerItemRight}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFO LIVRAISON </strong></Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N° BN LIVRAISON : </strong>{resume.num_bon_livraison}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE LIVRAISON : </strong>{resume.date_livraison}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N° FACTURE LIVRAISON: </strong>{resume.num_facture}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE FACTURE LIVRAISON : </strong>{resume.date_facture}</Typography>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.action}>
        <div className={classes.actionItem}>
          <ButtonComponent color='error' function={exit} name_of_btn="RETOUNER" icon={<BackspaceIcon />} />
        </div>
      </div>
    </div>
  )
};

export default DetailGarantieGab;