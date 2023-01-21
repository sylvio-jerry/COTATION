import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { useNavigate,useLocation,useParams } from "react-router-dom";
import { ButtonComponent, HeaderLabel, DatePicker} from '../../components';
import { Box,InputLabel,TextField,MenuItem,Select,FormControl } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BackspaceIcon from '@mui/icons-material/Backspace';
import VisibilityIcon from '@mui/icons-material/Visibility';
import globalStyle from '../../Style/globalStyle';
import garantieStyle from './garantieStyle';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Typography  } from '@mui/material';

var moment = require('moment');
moment.locale('fr');
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
const DetailGarantie = () => {
  let {id} = useParams()
  let navigate = useNavigate();
  const {state} = useLocation()

  const classes = globalStyle()
  const classes_ = garantieStyle()

  const defaultContrat = ()=>({
    num_contrat:'' ,
    date_proposition:'',
    observation : '',
    num_bon_livraison: '',
    num_facture: '',
    nom_client: '',
    date_facture: '',
    adresse: '',
    date_livraison: '',
    contrat_detail : []
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
      const {data} = await axios.get(`${API_URL}/api/contrat_garantie/${id}`)
      if(data){
        contrat_data = data.data
      }
     } catch (error) {
       console.log("error while getClientRequest:",error);
     }

    let livraison= contrat_data?.livraison
 
    let date_livraison = date_format(livraison?.date_livraison)
    let date_facture = livraison?.date_facture ? date_format(livraison.date_facture) : 'Non Précisé'


    let contrat_ = {
      num_contrat:contrat_data?.num_contrat ,
      observation : contrat_data?.observation ? contrat_data?.observation : 'Non Precisé',
      nom_client: livraison?.client?.nom_client,
      adresse: livraison?.client?.adresse ? livraison?.client?.adresse : 'Non Precisé' ,
      province: livraison?.client?.ville?.province?.nom_province,
      ville: livraison?.client?.ville?.nom_ville,
      province: livraison?.client?.ville.province.nom_province ? livraison?.client?.ville.province.nom_province : 'Non Precisé' ,
      ville: livraison?.client?.ville?.nom_ville ? livraison?.client?.ville?.nom_ville: 'Non Precisé' ,
      num_bon_livraison: livraison?.num_bon_livraison,
      num_facture: livraison?.num_facture ? livraison?.num_facture : 'Non Precisé',
      date_livraison: date_livraison,
      date_facture: date_facture,
      contrat_detail : contrat_data?.contrat_garantie_detail
    }

    setResume(contrat_)
  }

  const exit = ()=>{
    navigate(-1)
  }
  
  return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  ${classes.mainContainer}`}>
      <div className={classes_.headerLabelContainer}>
        <HeaderLabel title="DETAIL CONTRAT DE GARANTIE"/>
      </div>
      <div className={` ${classes.infoContainer}`}>
        <div className={` ${classes.infoContainerItem} ${classes.infoContainerItemLeft}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFO CONTRAT </strong></Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N° CONTRAT : </strong>{resume.num_contrat}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
            <Typography variant="div"><strong>CLIENT : </strong>{resume.nom_client}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>PROVINCE CLIENT: </strong>{resume.province }</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>VILLE CLIENT: </strong>{resume.ville }</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>ADRESSE CLIENT: </strong>{resume.adresse }</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>OBSERVATION : </strong>{resume.observation}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>TOUS LES MATERIELS SOUS CONTRAT : </strong>Nombre ({resume.contrat_detail.length})</Typography>
            </div>
          </div>
        </div>
        <div className={` ${classes.infoContainerItem} ${classes.infoContainerItemRight}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFO LIVRAISON </strong></Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N° LIVRAISON : </strong>{resume.num_bon_livraison}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N° Facture : </strong>{resume.num_facture}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE LIVRAISON : </strong>{resume.date_livraison}</Typography>
            </div>
          </div>
        </div>
      </div>
      <div className={` ${classes.tabledetail} `}>
        <table className={` ${classes.tableContent}`}>
          <thead  className={` ${classes.tableHeader}`}>
            <tr>
              <th className={` ${classes.tableContentThTd}`} >N° </th>
              <th className={` ${classes.tableContentThTd}`} >N° SERIE</th>
              <th className={` ${classes.tableContentThTd}`} >MARQUE</th>
              <th className={` ${classes.tableContentThTd}`} >MODELE</th>
              <th className={` ${classes.tableContentThTd}`} >GARANTIE</th>
              <th className={` ${classes.tableContentThTd}`} >DEBUT</th>
              <th className={` ${classes.tableContentThTd}`} >FIN</th>
              <th className={` ${classes.tableContentThTd}`} >STATUT</th>
            </tr>
          </thead>
          <tbody>
          { resume.contrat_detail.map((contrat_garantie, index)=>{
            return <tr key={index}>
                      <td className={` ${classes.tableContentThTd}`}>{index+1}</td>
                      <td className={` ${classes.tableContentThTd}`}>{contrat_garantie.equipement.num_serie}</td>
                      <td className={` ${classes.tableContentThTd}`}>{contrat_garantie.equipement.marque}</td>
                      <td className={` ${classes.tableContentThTd}`}>{contrat_garantie.equipement.modele}</td>
                      <td className={` ${classes.tableContentThTd}`}>{`${contrat_garantie?.equipement?.duree_garantie} Mois`}</td>
                      <td className={` ${classes.tableContentThTd}`}>{date_format(contrat_garantie.date_debut)}</td>
                      <td className={` ${classes.tableContentThTd}`}>{date_format(contrat_garantie.date_fin)}</td>
                      <td className={` ${classes.tableContentThTd}`}>{contrat_garantie.statut}</td>
                  </tr>
          })          
          }
          </tbody>
        </table>
      </div>
      <div className={classes.action}>
        <div className={classes.actionItem}>
          <ButtonComponent color='error' function={exit} name_of_btn="RETOUNER" icon={<BackspaceIcon />} />
        </div>
      </div>
    </div>
  )
};

export default DetailGarantie;