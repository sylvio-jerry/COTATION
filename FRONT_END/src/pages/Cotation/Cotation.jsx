import React, { useEffect,useState, useRef  } from 'react';
import axios from 'axios'
import { useReactToPrint } from 'react-to-print';
// import ReactToPrint from 'react-to-print';
import { useNavigate,useLocation,useParams } from "react-router-dom";
import { ButtonComponent, HeaderLabel, DatePicker,ExportPdf, CotationForm} from '../../components';
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
import Lottie from 'react-lottie';
import * as infoAnimation from '../../assets/lottie/info.json'
import logo from '../../assets/images/smmc.png'

var moment = require('moment');
moment.locale('fr');
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const Cotation = () => {
  let {id} = useParams()
  let navigate = useNavigate();

  const classes = globalStyle()
  const componentRef = useRef();

  const optionData = ()=>({
    EtatVehicule: '',
    PoidsVehicule: '',
    PoidsColis: '',
    Amorcage: ''
})

    //lottie file
    const InfoComponent = ()=>{
      const defaultOptions = {
        loop: true,
        autoplay: true, 
        animationData: infoAnimation,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice'
        }
      };
  
      return <div>
                  <Lottie options={defaultOptions}
                  height={250}
                  width={200}/>
              </div>
    }

  const handlePdf = useReactToPrint({
    
    content: () => {
      let compare = '' 
      if(option?.PoidsVehicule < 1){
        compare = 'INFERIEUR A 1 TONNE'
      }else if(option?.PoidsVehicule <= 2){
        compare = 'ENTRE 1 à 2 TONNES'
      }else if(option?.PoidsVehicule <= 4){
        compare = 'ENTRE 2 à 4 TONNES'
      }else if(option?.PoidsVehicule <= 6){
        compare = 'ENTRE 4 à 6 TONNES'
      }else if(option?.PoidsVehicule <= 10){
        compare = 'ENTRE 6 à 10 TONNES'
      }else{
        compare = 'SUPERIEUR A 10 TONNES'
      }

      const cotationTable = componentRef.current.cloneNode(true);
      const info = document.createElement('div');
      info.style = "margin: 15px"

      // const br = document.createElement('br');
      const header = `
        <div>
          <div id='logo'>
            <img src="${logo}" alt="" class="watermark" width="300px" height="300px"/>
          </div>
          <div> 
            <p>DEBARQUEMENT DE 1 VEHICULE <strong>${option?.EtatVehicule}</strong> UTILITAIRE 
             PESANT UN POIDS ${compare} AVEC UN COLIS DE ${option?.PoidsColis} TONNES.</p>
        </div>
      `;

        info.innerHTML = header;
        info.appendChild(cotationTable);
      return info;
    }
  });

  const [cotation,setCotation] = useState(null)
  const [option,setOption] = useState(optionData)
  const [showDetail,setShowDetail] = useState(false)

  useEffect(()=>{
    console.warn(' changedRender. . . ',option);
    showDetail_()
  },[option])

  const showDetail_ = () =>{
    if( option.PoidsVehicule.trim() !== ''  && option.Amorcage.trim() !==''  && option.PoidsColis.trim() !== '' && option.EtatVehicule.trim() !=='' ){
      setShowDetail(true)
    }
  }

  const getOption = (option_) =>{
    setOption(option_)
    getCotation()
  }


    //CALCUL
    const getPuDebarquement = (poidsVehicule=0) =>{
      if(typeof poidsVehicule !== "number") return
      let pu = 0 //Euro
      if(poidsVehicule < 1){
        pu = 100
      }else if(poidsVehicule <= 2){
        pu = 165
      }else if(poidsVehicule <= 4){
        pu = 260
      }else if(poidsVehicule <= 6){
        pu = 320
      }else if(poidsVehicule <= 10){
        pu = 450
      }else{
        pu = 500
      }
      return pu
    }
  
    const getPuVisteDouane = (etatDuVehicule='')=>{
      let PU_visite_douane = 0
      if(etatDuVehicule.toUpperCase()==='NEUVE'){
        PU_visite_douane = 0
      }else{
        PU_visite_douane = 45
      }
      return PU_visite_douane
    }
  
    const getPuAssistanceCivio = (etatDuVehicule='')=>{
      let puAssistanceCivio = 0
      if(etatDuVehicule.toUpperCase()==='NEUVE'){
        puAssistanceCivio = 0
      }else{
        puAssistanceCivio = 12
      }
      return puAssistanceCivio
    }

    const Generate_info_estimative = ()=>{
      let compare = '' 
      if(option?.PoidsVehicule < 1){
        compare = 'INFERIEUR A 1 TONNE'
      }else if(option?.PoidsVehicule <= 2){
        compare = 'ENTRE 1 à 2 TONNES'
      }else if(option?.PoidsVehicule <= 4){
        compare = 'ENTRE 2 à 4 TONNES'
      }else if(option?.PoidsVehicule <= 6){
        compare = 'ENTRE 4 à 6 TONNES'
      }else if(option?.PoidsVehicule <= 10){
        compare = 'ENTRE 6 à 10 TONNES'
      }else{
        compare = 'SUPERIEUR A 10 TONNES'
      }

      return(
        <Typography variant="div">
                  DEBARQUEMENT DE 1 VEHICULE <strong>{option?.EtatVehicule}</strong> UTILITAIRE 
                  PESANT UN POIDS {compare} AVEC UN COLIS DE {option?.PoidsColis} TONNES et AVEC UN AMORCAGE DE {option?.Amorcage} %.
        </Typography>
      )
    }

  const getCotation = ()=>{
    var PU_cession = 0.5,
    PU_march_sous_condit= 12,
    PU_droit_port= 2.4, 
    PU_redevence= 2.25,
    PU_droit_region= 4.5,
    PU_redevence_march= 0.4,
    PU_droit_region_march=0.4,
    Qt_debarquement= 1,
    Qt_cession= 2,
    Qt_visite_douane= 1,
    Qt_assistance_civio= 1,
    Qt_redevence= 1,
    Qt_droit_region= 1,

    Amorcage = +option.Amorcage,
    PU_debarquement= getPuDebarquement(+option.PoidsVehicule), // depends du poids de vehicule
    PU_visite_douane= getPuVisteDouane(option.EtatVehicule), // si neuve : 0 , autres : 45
    PU_assistance_civio= getPuAssistanceCivio(option.EtatVehicule),  // si neuve : 0 , autres : 12
    Qt_march_sous_condit= +option.PoidsColis, //poids du colis
    Qt_droit_port= +option.PoidsVehicule, // poids du vehicule
    Qt_redevence_march= +option.PoidsColis,  //poids du colis
    Qt_droit_region_march= +option.PoidsColis,  //poids du colis,
  
    Montant_debarquement= (PU_debarquement * Qt_debarquement) * (1 + (+option.Amorcage/100)), // (PU_debarquement * Qt_debarquement) * (1 + (Amorcage/100))
    Montant_visite_douane= PU_visite_douane * Qt_visite_douane, // PU_visite_douane * Qt_visite_douane
    Montant_assistance_civio= PU_assistance_civio * Qt_assistance_civio, // PU_assistance_civio * Qt_assistance_civio
    Montant_cession= PU_cession * Qt_cession, // PU_cession * Qt_cession
    Montant_march_sous_condit= PU_march_sous_condit * Qt_march_sous_condit, // PU_march_sous_condit * Qt_march_sous_condit
  
    Montant_HTVA_1 = Montant_debarquement + Montant_visite_douane + Montant_assistance_civio + Montant_cession + Montant_march_sous_condit, //Montant_debarquement + Montant_visite_douane + Montant_assistance_civio + Montant_cession + Montant_march_sous_condit + Montant_march_sous_condit
    Montant_TVA_1 = ( Montant_HTVA_1 * 20 ) / 100, // ( Montant_HTVA_1 * 20 ) / 100
    NetApayer1= Montant_HTVA_1 + Montant_TVA_1, // Montant_HTVA_1 + Montant_TVA_1
  
    Montant_droit_port= PU_droit_port * Qt_droit_port, // PU_droit_port * Qt_droit_port
    Montant_redevence= PU_redevence * Qt_redevence, // PU_redevence * Qt_redevence
    Montant_droit_region= PU_droit_region * Qt_droit_region, // PU_droit_region * Qt_droit_region
    Montant_redevence_march= PU_redevence_march * Qt_redevence_march, // PU_redevence_march * Qt_redevence_march
    Montant_droit_region_autres_march= PU_droit_region_march * Qt_droit_region_march, // PU_droit_region_march * Qt_droit_region_march
  
    Montant_HTVA_2= Montant_droit_port + Montant_redevence + Montant_droit_region + Montant_redevence_march + Montant_droit_region_autres_march, //Montant_droit_port + Montant_redevence + Montant_droit_region + Montant_redevence_march + Montant_droit_region_autres_march
    Montant_TVA_2= ( Montant_HTVA_2 * 20 ) / 100, // ( Montant_HTVA_2 * 20 ) / 100
    NetApayer2 =Montant_HTVA_2 + Montant_TVA_2,// Montant_HTVA_2 + Montant_TVA_2
  
    Montant_HTVA =Montant_HTVA_1 + Montant_HTVA_2, //Montant_HTVA_1 + Montant_HTVA_2
    Montant_TVA = Montant_TVA_1 + Montant_TVA_2, // Montant_TVA_1 + Montant_TVA_2
    NetApayer = Montant_HTVA + Montant_TVA //Montant_HTVA + Montant_TVA

    let cotation_ = {
      PU_cession,
      PU_march_sous_condit,
      PU_droit_port, 
      PU_redevence,
      PU_droit_region,
      PU_redevence_march,
      PU_droit_region_march,
      Qt_debarquement,
      Qt_cession,
      Qt_visite_douane,
      Qt_assistance_civio,
      Qt_redevence,
      Qt_droit_region,
      PU_debarquement,
      PU_visite_douane,
      PU_assistance_civio, 
      Qt_march_sous_condit, 
      Qt_droit_port,
      Qt_redevence_march,
      Qt_droit_region_march, 
    
      Amorcage,
      Montant_debarquement, 
      Montant_visite_douane,
      Montant_assistance_civio,
      Montant_cession,
      Montant_march_sous_condit,
    
      Montant_HTVA_1,
      Montant_TVA_1,
      NetApayer1,
    
      Montant_droit_port,
      Montant_redevence,
      Montant_droit_region,
      Montant_redevence_march, 
      Montant_droit_region_autres_march,
    
      Montant_HTVA_2,
      Montant_TVA_2, 
      NetApayer2,
    
      Montant_HTVA,
      Montant_TVA, 
      NetApayer 
    }

    setCotation(cotation_)
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
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  ${classes.mainContainer}`} >
      <CotationForm 
        exportPdf={handlePdf}
        option = {option}
        getOption = {getOption}
      />
      <div className={` ${classes.infoContainer}`}>
        <div className={` ${classes.infoContainerItem} ${classes.infoContainerItemLeft}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div>
              <div className={` ${classes.headerRecap } `}>
                <Typography variant="div"><strong>DETAIL </strong></Typography>
              </div>
              <div className={` ${classes.resumeItem} mt-2`}>
                <Typography variant="div"><strong>NOTE EXPLICATIVE : </strong></Typography>
                {showDetail && <Generate_info_estimative/>}
              </div>
            </div>
          </div>
        </div>
        <div className={` ${classes.infoContainerItem} ${classes.infoContainerItemRight}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>COTATION</strong></Typography>
            </div>
            <div className={` ${classes.headerRecap } `}>
              <InfoComponent/>
            </div>
          </div>
        </div>
      </div>
      <div className={` ${classes.tabledetail}`}  ref={componentRef} style={{display: 'flex', flexDirection:'column', alignItems: 'center'}}>
      <div className={` ${classes.tabledetail}`} >
        <table className={` ${classes.tableContent}`}>
          <thead  className={` ${classes.tableHeader}`}>
            <tr>
              <th className={` ${classes.tableContentThTd}`} >DESIGNATION PRESTATION </th>
              <th className={` ${classes.tableContentThTd}`} >UNITE</th>
              <th className={` ${classes.tableContentThTd}`} >PU</th>
              <th className={` ${classes.tableContentThTd}`} >EN</th>
              <th className={` ${classes.tableContentThTd}`} >QT</th>
              <th className={` ${classes.tableContentThTd}`} >MAJ</th>
              <th className={` ${classes.tableContentThTd}`} >MONTANT</th>
            </tr>
          </thead>
          { (cotation!==null) && <tbody>
            <tr>
              <td className={` ${classes.tableContentThTd}`}>DEBARQUEMENT VEH</td>
              <td className={` ${classes.tableContentThTd}`}>NB</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.PU_debarquement}</td>
              <td className={` ${classes.tableContentThTd}`}>EURO</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Qt_debarquement}</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Amorcage}</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_debarquement?.toFixed(2)}</td>
            </tr>
            <tr>
              <td className={` ${classes.tableContentThTd}`}>VISITE DES DOUANES AVEC M.O / VEH UTILITAIRE</td>
              <td className={` ${classes.tableContentThTd}`}>NB</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.PU_visite_douane}</td>
              <td className={` ${classes.tableContentThTd}`}>EURO</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Qt_visite_douane}</td>
              <td className={` ${classes.tableContentThTd}`}></td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_visite_douane?.toFixed(2)}</td>
            </tr>
            <tr>
              <td className={` ${classes.tableContentThTd}`}>ASSISTANCE AU CIVIO</td>
              <td className={` ${classes.tableContentThTd}`}>NB</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.PU_assistance_civio}</td>
              <td className={` ${classes.tableContentThTd}`}>EURO</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Qt_assistance_civio}</td>
              <td className={` ${classes.tableContentThTd}`}></td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_assistance_civio?.toFixed(2)}</td>
            </tr>
            <tr>
              <td className={` ${classes.tableContentThTd}`}>CESSION IMPRIMEES(BON D' ENLEVEMENT)</td>
              <td className={` ${classes.tableContentThTd}`}>NB</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.PU_cession}</td>
              <td className={` ${classes.tableContentThTd}`}>EURO</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Qt_cession}</td>
              <td className={` ${classes.tableContentThTd}`}></td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_cession?.toFixed(2)}</td>
            </tr>
            <tr>
              <td className={` ${classes.tableContentThTd}`}>DEBARQUEMENT MARCH SOUS AUTRES CONDIT</td>
              <td className={` ${classes.tableContentThTd}`}>M3.T</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.PU_march_sous_condit}</td>
              <td className={` ${classes.tableContentThTd}`}>EURO</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Qt_march_sous_condit}</td>
              <td className={` ${classes.tableContentThTd}`}></td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_march_sous_condit?.toFixed(2)}</td>
            </tr>
          </tbody>
          }
        </table>
        <div className="mt-5">
            <table className="w-2/6" align="right" id="tab2">
            <tr>
              <td className={` ${classes.tableContentThTd}`}>MONTANT HTVA</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_HTVA_1?.toFixed(2)}</td>
            </tr>
            <tr>
              <td className={` ${classes.tableContentThTd}`}>MONTANT TVA</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_TVA_1?.toFixed(2)}</td>
            </tr>
            <tr>
              <td className={` ${classes.tableContentThTd}`}>NET A PAYER</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.NetApayer1?.toFixed(2)}</td>
            </tr>
            </table>
            <br />
          </div>
      </div>
      <div className={` ${classes.tabledetail} mt-1`} >
        <table className={` ${classes.tableContent}`}>
          <thead  className={` ${classes.tableHeader}`}>
            <tr>
              <th className={` ${classes.tableContentThTd}`} >DESIGNATION PRESTATION </th>
              <th className={` ${classes.tableContentThTd}`} >UNITE</th>
              <th className={` ${classes.tableContentThTd}`} >PU</th>
              <th className={` ${classes.tableContentThTd}`} >EN</th>
              <th className={` ${classes.tableContentThTd}`} >QT</th>
              <th className={` ${classes.tableContentThTd}`} >MAJ</th>
              <th className={` ${classes.tableContentThTd}`} >MONTANT</th>
            </tr>
          </thead>
          { (cotation!==null) && <tbody>
            <tr>
              <td className={` ${classes.tableContentThTd}`}>DROIT DE PORT A L' IMPORTATION</td>
              <td className={` ${classes.tableContentThTd}`}>T/M3</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.PU_droit_port}</td>
              <td className={` ${classes.tableContentThTd}`}>EURO</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Qt_droit_port}</td>
              <td className={` ${classes.tableContentThTd}`}></td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_droit_port?.toFixed(2)}</td>
            </tr>
            <tr>
              <td className={` ${classes.tableContentThTd}`}>REDEVANCE COMMUNALE SUR VEHICULE</td>
              <td className={` ${classes.tableContentThTd}`}>NB</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.PU_redevence}</td>
              <td className={` ${classes.tableContentThTd}`}>EURO</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Qt_redevence}</td>
              <td className={` ${classes.tableContentThTd}`}></td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_redevence?.toFixed(2)}</td>
            </tr>
            <tr>
              <td className={` ${classes.tableContentThTd}`}>DROIT DE REGION SUR VEHICULE</td>
              <td className={` ${classes.tableContentThTd}`}>NB</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.PU_droit_region}</td>
              <td className={` ${classes.tableContentThTd}`}>EURO</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Qt_droit_region}</td>
              <td className={` ${classes.tableContentThTd}`}></td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_droit_region?.toFixed(2)}</td>
            </tr>
            <tr>
              <td className={` ${classes.tableContentThTd}`}>REDEVANCE COMMUNALE SUR MARCHANDISE</td>
              <td className={` ${classes.tableContentThTd}`}>T</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.PU_redevence_march}</td>
              <td className={` ${classes.tableContentThTd}`}>EURO</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Qt_redevence_march}</td>
              <td className={` ${classes.tableContentThTd}`}></td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_redevence_march?.toFixed(2)}</td>
            </tr>
            <tr>
              <td className={` ${classes.tableContentThTd}`}>DROIT DE REGION SUR AUTRES MARCHANDISES</td>
              <td className={` ${classes.tableContentThTd}`}>T</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.PU_droit_region_march}</td>
              <td className={` ${classes.tableContentThTd}`}>EURO</td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Qt_droit_region_march}</td>
              <td className={` ${classes.tableContentThTd}`}></td>
              <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_droit_region_autres_march?.toFixed(2)}</td>
            </tr>
          </tbody>
          }
        </table>
        <div style={{display:'flex', flexDirection: 'column', float: 'right'}} className='w-2/6 mt-6'>
          <div className="mt-5">
            <table className="w-full" id="tab2">
              <tr>
                <td className={` ${classes.tableContentThTd}`}>MONTANT HTVA</td>
                <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_HTVA_2?.toFixed(2)}</td>
              </tr>
              <tr>
                <td className={` ${classes.tableContentThTd}`}>MONTANT TVA</td>
                <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_TVA_2?.toFixed(2)}</td>
              </tr>
              <tr>
                <td className={` ${classes.tableContentThTd}`}>NET A PAYER</td>
                <td className={` ${classes.tableContentThTd}`}>{cotation?.NetApayer2?.toFixed(2)}</td>
              </tr>
            </table>
            <br />
          </div>
          <div className="mt-5">
            <table className="w-full" id="tab2">
              <tr>
                <td className={` ${classes.tableContentThTd}`}>MONTANT TOTAL HTVA</td>
                <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_HTVA?.toFixed(2)}</td>
              </tr>
              <tr>
                <td className={` ${classes.tableContentThTd}`}>MONTANT TVA</td>
                <td className={` ${classes.tableContentThTd}`}>{cotation?.Montant_TVA?.toFixed(2)}</td>
              </tr>
              <tr>
                <td className={` ${classes.tableContentThTd}`}>NET A PAYER</td>
                <td className={` ${classes.tableContentThTd}`}>{cotation?.NetApayer?.toFixed(2)}</td>
              </tr>
            </table>
            <br />
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


export default Cotation;