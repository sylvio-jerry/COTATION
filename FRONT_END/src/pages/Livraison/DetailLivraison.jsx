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

const DetailLivraison = () => {
  let {id} = useParams()
  let navigate = useNavigate();
  const classes = globalStyle()

  const defaultContrat = ()=>({
    num_bon_livraison: '',
    date_livraison: null,
    num_facture: '',
    date_facture: null,
    nom_client: '',
    adresse: '',
    province: '',
    equipement: [],
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
    let livraison_data = {}
    try {
      const {data} = await axios.get(`${API_URL}/api/livraison/${id}`)
        livraison_data = data.data

        let livraison_ = {
          num_bon_livraison:livraison_data.num_bon_livraison ,
          date_facture:date_format(livraison_data.date_facture),
          date_livraison:date_format(livraison_data.date_livraison),
          observation : livraison_data.observation ? livraison_data.observation  : "Pas d'observation",
          num_facture: livraison_data.num_facture ? livraison_data.num_facture : "Non Facturé" ,
          date_facture: livraison_data.date_facture ? date_format(livraison_data.date_facture) : "Non Precisé",
          nom_client: livraison_data.client.nom_client,
          province: livraison_data.client.ville.province.nom_province,
          ville: livraison_data.client.ville.nom_ville,
          adresse: livraison_data.client.adresse ? livraison_data.client.adresse : "Non Precisé",
          equipement : livraison_data.equipement
        }
    
        setResume(livraison_)
     } catch (error) {
       console.log("error while getClientRequest:",error);
     }

  }

  const exit = ()=>{
    navigate(-1)
  }
  
  const headerLabelContainer = {
    // backgroundColor: "yellow",
    marginBottom: 10,
    width: "50%",
    dislay: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    minWidth:250
  }
  
  return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  ${classes.mainContainer}`}>
      <div style={headerLabelContainer}>
        <HeaderLabel title="DETAIL LIVRAISON"/>
      </div>
      <div className={` ${classes.infoContainer}`}>
        <div className={` ${classes.infoContainerItem} ${classes.infoContainerItemLeft}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFO LIVRAISON  (1)</strong></Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N° BON DE LIVRAISON : </strong>{resume.num_bon_livraison}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N° FACTURE : </strong>{resume.num_facture}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE LIVRAISON : </strong>{resume.date_livraison}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DATE FACTURE : </strong>{resume.date_facture}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>OBSERVATION : </strong>{resume.observation}</Typography>
            </div>
          </div>
        </div>
        <div className={` ${classes.infoContainerItem} ${classes.infoContainerItemRight}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFO LIVRAISON (2) </strong></Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>CLIENT : </strong>{resume.nom_client}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>PROVINCE CLIENT: </strong>{resume.province}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>VILLE CLIENT: </strong>{resume.ville}</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>ADRESSE CLIENT: </strong>{resume.adresse }</Typography>
            </div>
            <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>TOUS LES MATERIELS LIVRÉS : </strong>Nombre ({resume.equipement.length})</Typography>
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
              <th className={` ${classes.tableContentThTd}`} >FOURNISSEUR</th>
            </tr>
          </thead>
          <tbody>
          { resume.equipement.map((equipement, index)=>{
            return <tr key={index}>
                      <td className={` ${classes.tableContentThTd}`}>{index+1}</td>
                      <td className={` ${classes.tableContentThTd}`}>{equipement.num_serie}</td>
                      <td className={` ${classes.tableContentThTd}`}>{equipement.marque}</td>
                      <td className={` ${classes.tableContentThTd}`}>{equipement.modele}</td>
                      <td className={` ${classes.tableContentThTd}`}>{equipement.duree_garantie ? `${equipement.duree_garantie} Mois` : "Pas de garantie"}</td>
                      <td className={` ${classes.tableContentThTd}`}>{equipement.fournisseur ? equipement.fournisseur : "Non specifié"}</td>
                      
    
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

export default DetailLivraison;