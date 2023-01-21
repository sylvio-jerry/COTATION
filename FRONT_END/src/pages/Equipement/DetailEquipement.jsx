import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { ButtonComponent, HeaderLabel } from '../../components';
import { useNavigate ,useParams} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography , Divider } from '@mui/material';
import image from '../../assets/images/equipement/equipement.png'
import BackspaceIcon from '@mui/icons-material/Backspace';
import globalStyle from '../../Style/globalStyle';
import Lottie from 'react-lottie';
import * as infoAnimation from '../../assets/lottie/info.json'

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
const DetailEquipement = () => {
  let {id} = useParams()
  const classes = globalStyle()
  const navigate= useNavigate()

  const defaultResume = ()=>({
    num_serie:'' ,
    marque: '',
    modele: '',
    duree_garantie: '',
    disposition: '',
    famille: '',
    service: ''
  })

  const [resume, setResume] = useState(defaultResume());

  useEffect(()=>{
    getResume()
  },[])

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
                height={400}
                width={350}/>
            </div>
  }

  const exit = ()=>{
    navigate(-1)
  }

  const getResume = async () =>{
    let equipementData = {}
    try {
      const {data} = await axios.get(`${API_URL}/api/equipement/${id}`)
        
        equipementData = data.data

        let equipement = {
          num_serie:equipementData?.num_serie ,
          marque: equipementData?.marque,
          modele: equipementData?.modele,
          garantie : equipementData?.duree_garantie ? `${equipementData?.duree_garantie} Mois` : "Pas de garantie",
          disposition: equipementData?.disposition ? "Interne"  : "Externe",
          fournisseur: equipementData?.fournisseur ? equipementData?.fournisseur  : "Non specifié",
          famille: equipementData?.famille?.nom_famille,
          service: equipementData?.famille?.service?.nom_service,
          redevance_contrat: equipementData.redevance_contrat ? `${equipementData.redevance_contrat} Ar` : "Non Precisé"
        }

        setResume(equipement)
     } catch (error) {
       console.log("error while getClientRequest:",error);
     }
  }


  const equipementImageContainer = {
    // backgroundColor: "black",
    display: "flex",
    justifyContent: "center",
    width:350,
    height: 400,
    padding:5
  }
  
  const imageStyle = {
    // backgroundColor: "pink",
    // height:"100%",
    // width:"100%",
    borderRadius: "25px",
  }

  // const theme = createTheme({
  //   typography: {
  //     fontFamily: [
  //       "titilliumlight",
  //       '"Helvetica Neue"',
  //       '-apple-system',
  //       'BlinkMacSystemFont',
  //       '"Segoe UI"',
  //       'Roboto',
  //       'Arial',
  //       'sans-serif',
  //       '"Segoe UI Emoji"',
  //       '"Apple Color Emoji"',
  //       '"Segoe UI Symbol"',
  //     ].join(','),
  //     color:"black",
  //     h5: {
  //       fontSize: 20,
  //       letterSpacing: 7,
  //       fontWeight:200,
  //     },
  //     h6: {
  //       fontSize: 18,
  //       letterSpacing: 5,
  //       fontWeight:100,
  //       marginTop:15
  //     },
  //     div: {
  //       fontSize: 18,
  //       letterSpacing: 5,
  //       fontWeight:100,
  //       marginTop:15,
  //       display:"flex",
  //       flexWrap: "wrap",
  //       // backgroundColor: "orange",
  //       width:470,
  //       minWidth:200
  //     },
  //   },
  // });

  // return (
  //   <ThemeProvider theme={theme}>
  //     <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl" style={detailContainer}>
  //       <div style={headerLabelContainer}>
  //         <HeaderLabel title="INFORMATION EQUIPEMENT"/>
  //       </div>
  //       <div style={detailInfo}>
  //         <div style={equipementImageContainer}>
  //           <img src={image} alt="Image de l'equipement" style={imageStyle}/>
  //         </div>
  //         <div style={equipementDetailContainer}>
  //           <div style={equipementDetail} >
  //             <div style={equipementDetailItem}>
  //               <Typography variant="div"><strong>Service : </strong>MONETIQUE</Typography>
  //               <Typography variant="div"><strong>Famille : </strong>GAB</Typography>
  //             </div>
  //             <Divider style={{marginTop: 5}}/>
  //             <div style={equipementDetailItem}>
  //               <Typography variant="div"><strong>N° Serie : </strong>452234</Typography>
  //               <Typography variant="div"><strong>Marque : </strong>Cashwork</Typography>
  //               <Typography variant="div"><strong>Modèle : </strong>522</Typography>
  //               <Typography variant="div"><strong>Garantie : </strong>Pas de garantie</Typography>
  //               <Typography variant="div"><strong>Disposition : </strong>Materiel Externe</Typography>
  //             </div>
  //             <Divider style={{marginTop: 5}}/>
  //             <div style={equipementDetailItem}>
  //               <Typography variant="div"><strong>Numero Livraison : </strong>45216</Typography>
  //               <Typography variant="div"><strong>Numero Contrat de Garantie : </strong>4526</Typography>
  //               <Typography variant="div"><strong>Contrat de maintenance : </strong>Pas de contrat de maintenance effectué</Typography>
  //             </div>
  //             <div style={equipementDetailItem}>
  //             <div style={action}>
  //               <ButtonComponent color='error' function={exit} name_of_btn="RETOUR" icon={<BackspaceIcon />} />
  //             </div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
      
  //   </ThemeProvider>
  // );

  return (
    <div className={`m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl  ${classes.mainContainer}`}>
      {/* <HeaderLabel title="NOUVEAU CONTRAT DE GARANTIE"/> */}
      <div className={classes.formContainer}>
        <div className={`${classes.formContainerItemLeft}`} >
          <div style={equipementImageContainer}>
            {/* <img src={image} alt="Image de l'equipement" style={imageStyle}/> */}
            <InfoComponent/>
          </div>
        </div>
        <div className={` ${classes.formContainerItemRight}`}>
          <div className={` ${classes.resumeContainer}`}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFORMATION EQUIPEMENT</strong></Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>SERVICE : </strong> {resume.service}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>FAMILLE : </strong> {resume.famille}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>N° SERIE : </strong> {resume.num_serie}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>MARQUE : </strong> {resume.marque}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>MODELE : </strong> {resume.modele}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>GARANTIE : </strong> {resume.garantie}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>FOURNISSEUR : </strong> {resume.fournisseur}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>REDEVANCE CONTRAT : </strong> {resume.redevance_contrat}</Typography>
            </div>
           <div className={` ${classes.resumeItem}`}>
              <Typography variant="div"><strong>DISPOSITON : </strong> {resume.disposition}</Typography>
            </div>
          </div>
        </div>
      </div>
      <div className={classes.action}>
        <div className={classes.actionItem}>
          <ButtonComponent color='error' function={exit} name_of_btn="ANNULER" icon={<BackspaceIcon />} />
        </div>
      </div>
    </div>
  )
};

export default DetailEquipement;
