import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { useNavigate,useLocation,useParams } from "react-router-dom";
import { ButtonComponent, HeaderLabel, DatePicker} from '../../components';
import { Box,InputLabel,TextField,MenuItem,Select,FormControl } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BackspaceIcon from '@mui/icons-material/Backspace';
import VisibilityIcon from '@mui/icons-material/Visibility';
import globalStyle from '../../Style/globalStyle';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Typography  } from '@mui/material';

var moment = require('moment');
moment.locale('fr');
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const DetailMaintenance = () => {
  let {id} = useParams()
  let navigate = useNavigate();
  const {state} = useLocation()

  const classes = globalStyle()

  const defaultContrat = ()=>({
    num_contrat:'' ,
    date_debut: '',
    date_fin: '',
    statut:'',
    observation : '',
    date_proposition: '',
    num_facture: '',
    date_facture: '',
    nom_client: '',
    adresse: '',
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
      const {data} = await axios.get(`${API_URL}/api/contrat_maintenance/${id}`)
        contrat_data = data.data
        let date_proposition= contrat_data.date_proposition ? date_format(contrat_data.date_proposition) : "Non Precisé"

        let contrat_ = {
          num_contrat:contrat_data.num_contrat ,
          date_debut:date_format(contrat_data.date_debut),
          date_fin:date_format(contrat_data.date_fin),
          statut: contrat_data.statut,
          observation : contrat_data.observation ? contrat_data.observation  : "Pas d'observation",
          date_proposition: date_proposition,
          num_facture: contrat_data.num_facture ? contrat_data.num_facture : "Non Facturé" ,
          date_facture: contrat_data.date_facture ? date_format(contrat_data.date_facture) : "Non Precisé",
          nom_client: contrat_data.client.nom_client,
          province: contrat_data.client.ville.province.nom_province,
          ville: contrat_data.client.ville.nom_ville,
          redevance_totale : contrat_data.redevance_totale,
          adresse: contrat_data.client.adresse,
          contrat_detail : contrat_data.contrat_maintenance_detail
        }
        setResume(contrat_)
     } catch (error) {
       console.log("error while getClientRequest:",error);
     }
  }

  const exit = ()=>{
    navigate(-1)
  }
  
  return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  ${classes.mainContainer}`}>
      <HeaderLabel title="DETAIL CONTRAT DE MAINTENANCE"/>
      <div className={` ${classes.infoContainer}`}>
        <div className={` ${classes.infoContainerItem} ${classes.infoContainerItemLeft}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFO CONTRAT  (1)</strong></Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N° CONTRAT : </strong>{resume.num_contrat}</Typography>
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
              <Typography variant="div"><strong>REDEVANCE ANNUEL : </strong>{`${resume?.redevance_totale} Ar`}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE DEBUT : </strong>{resume.date_debut}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE FIN : </strong>{resume.date_fin}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>TOUS LES MATERIELS SOUS CONTRAT : </strong>Nombre ({resume.contrat_detail.length})</Typography>
            </div>
          </div>
        </div>
        <div className={` ${classes.infoContainerItem} ${classes.infoContainerItemRight}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFO CONTRAT (2) </strong></Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N° Facture : </strong>{resume.num_facture}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>Date Facture : </strong>{resume.date_facture}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE PROPOSITION : </strong>{resume.date_proposition}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>OBSERVATION : </strong>{resume.observation}</Typography>
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
              <th className={` ${classes.tableContentThTd}`} >DISPOSITON</th>
              <th className={` ${classes.tableContentThTd}`} >REDEVANCE</th>
            </tr>
          </thead>
          <tbody>
          { resume.contrat_detail.map((contrat_maintenance, index)=>{
            return <tr key={index}>
                      <td className={` ${classes.tableContentThTd}`}>{index+1}</td>
                      <td className={` ${classes.tableContentThTd}`}>{contrat_maintenance.equipement.num_serie}</td>
                      <td className={` ${classes.tableContentThTd}`}>{contrat_maintenance.equipement.marque}</td>
                      <td className={` ${classes.tableContentThTd}`}>{contrat_maintenance.equipement.modele}</td>
                      <td className={` ${classes.tableContentThTd}`}>{contrat_maintenance.equipement.is_locale ? "Interne" : "Externe"}</td>
                      <td className={` ${classes.tableContentThTd}`}>{contrat_maintenance.equipement?.redevance_contrat ? `${contrat_maintenance.equipement?.redevance_contrat} Ar` : "Non Précisé"}</td>
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

export default DetailMaintenance;