import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { useNavigate,useLocation,useParams } from "react-router-dom";
import { ButtonComponent, HeaderLabel, DatePicker} from '../../components';
import { Box,InputLabel,TextField,MenuItem,Select,FormControl } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BackspaceIcon from '@mui/icons-material/Backspace';
import VisibilityIcon from '@mui/icons-material/Visibility';
import globalStyle from '../../Style/globalStyle';
import maintenanceGabStyle from './maintenanceGabStyle';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { Typography  } from '@mui/material';

var moment = require('moment');
moment.locale('fr');
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
const DetailMaintenanceGab = () => {
  let {id} = useParams()
  let navigate = useNavigate();
  const {state} = useLocation()

  const classes = globalStyle()
  const classes_ = maintenanceGabStyle()

  const defaultContrat = ()=>({
    equipement: null,
    date_debut: null,
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
      const {data} = await axios.get(`${API_URL}/api/contrat_maintenance_gab/${id}`)
      if(data){
        contrat_data = data.data
      }
     } catch (error) {
       console.log("error while getContrat_maintenance_gab:",error);
     }
    let redevance_gab_ = contrat_data?.redevance_gab.map((redevance_)=>({...redevance_,
      date_facture:  redevance_.date_facture ? date_format(redevance_.date_facture) : 'Non specifié',
      num_facture: redevance_?.num_facture ? redevance_?.num_facture : "Non facturé"
    }))

    let contrat_ = {
      site_installation: contrat_data?.site_installation,
      equipement: contrat_data?.equipement ? contrat_data?.equipement : null,
      num_serie : contrat_data?.equipement?.num_serie ? contrat_data?.equipement.num_serie : '',
      marque : contrat_data?.equipement?.marque ? contrat_data?.equipement?.marque : '',
      modele : contrat_data?.equipement?.modele ? contrat_data?.equipement?.modele : '',
      fournisseur : contrat_data?.equipement?.fournisseur ? contrat_data?.equipement?.fournisseur : 'Non specifié',
      date_debut:contrat_data?.date_debut ? date_format(contrat_data.date_debut) : 'Non specifié',
      date_fin:contrat_data?.date_fin ? date_format(contrat_data.date_fin) : 'Non specifié',
      date_proposition:contrat_data?.date_proposition ? date_format(contrat_data.date_proposition) : 'Non specifié',
      observation: contrat_data?.observation ?  contrat_data?.observation : "Pas d'observation",
      nom_client: contrat_data?.client?.nom_client,
      province: contrat_data?.client?.ville?.province?.nom_province,
      ville: contrat_data?.client?.ville?.nom_ville,
      adresse: contrat_data?.client?.adresse,
      redevance_totale: contrat_data?.redevance_totale ? contrat_data?.redevance_totale : "Non specifié" ,
      annee_contrat: contrat_data?.annee_contrat,
      redevance_gab: redevance_gab_
    }

    setResume(contrat_)
  }

  const exit = ()=>{
    navigate(-1)
  }
  

  return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  ${classes.mainContainer}`}>
      <div className={classes_.headerLabelContainer}>
          <HeaderLabel title="DETAIL CONTRAT DE MAINTENANCE GAB"/>
      </div>
      <div className={` ${classes.infoContainer}`}>
        <div className={` ${classes.infoContainerItem} ${classes.infoContainerItemLeft}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFO CONTRAT </strong></Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>ANNEE CONTRAT: </strong>{resume?.annee_contrat}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE DEBUT CONTRAT : </strong>{resume?.date_debut}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE FIN CONTRAT : </strong>{resume?.date_fin}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>SITE INSTALLATION : </strong>{resume?.site_installation}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>REDEVANCE TOTALE : </strong>{resume?.redevance_totale}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE PROPOSITION : </strong>{resume?.date_proposition}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>EQUIPEMENT </strong></Typography>
              <div className={` ${classes.tabledetail} ml-3`}>
                <table className={` ${classes.tableContent}`}>
                  <thead  className={` ${classes.tableHeader}`}>
                    <tr>
                      <th className={` ${classes.tableContentThTd}`} >N° SERIE</th>
                      <th className={` ${classes.tableContentThTd}`} >MARQUE</th>
                      <th className={` ${classes.tableContentThTd}`} >MODELE</th>
                      <th className={` ${classes.tableContentThTd}`} >FOURNISSEUR</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className={` ${classes.tableContentThTd}`}>{resume.num_serie}</td>
                      <td className={` ${classes.tableContentThTd}`}>{resume.marque}</td>
                      <td className={` ${classes.tableContentThTd}`}>{resume.modele}</td>
                      <td className={` ${classes.tableContentThTd}`}>{resume.fournisseur}</td>
                    </tr>
                  </tbody>
                </table>
              </div>  
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>REDEVANCE TRIMESTRIEL </strong></Typography>
              <div className={` ${classes.tabledetail} ml-3`}>
                <table className={` ${classes.tableContent}`}>
                  <thead  className={` ${classes.tableHeader}`}>
                    <tr>
                      <th className={` ${classes.tableContentThTd}`}>QUARTER </th>
                      <th className={` ${classes.tableContentThTd}`}>N° FACTURE</th>
                      <th className={` ${classes.tableContentThTd}`}>DATE FACTURE</th>
                      <th className={` ${classes.tableContentThTd}`}>MONTANT</th>
                      <th className={` ${classes.tableContentThTd}`}>STATUT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resume?.redevance_gab?.length > 0 &&  resume?.redevance_gab?.map(({type,num_facture,date_facture,montant,isPaid},index)=>{
                            return <tr key={index}>
                                      <td className={` ${classes.tableContentThTd}`}>{type}</td>
                                      <td className={` ${classes.tableContentThTd}`}>{num_facture}</td>
                                      <td className={` ${classes.tableContentThTd}`}>{date_facture}</td>
                                      <td className={` ${classes.tableContentThTd}`}>{montant}</td>
                                      <td className={` ${classes.tableContentThTd}`}>{isPaid ? "Payé" : "Non Payé"}</td>
                                  </tr>
                          })          
                          }
                  </tbody>
                </table>
              </div>  
            </div>
          </div>
        </div>
        <div className={` ${classes.infoContainerItem} ${classes.infoContainerItemRight}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFO CLIENT </strong></Typography>
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

export default DetailMaintenanceGab;