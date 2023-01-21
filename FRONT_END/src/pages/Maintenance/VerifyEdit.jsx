import React, {useEffect, useState} from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { HeaderLabel} from '../../components';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonComponent } from '../../components';
import Slide from '@mui/material/Slide';
import globalStyle from '../../Style/globalStyle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography,Box } from '@mui/material';

var moment = require('moment');
moment.locale('fr')

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Verify = ({openModal,closeModal,data})=> {

  const classes = globalStyle();
  const onClose = () => {
    closeModal(false);
  };

  const [contrat]= useState(data)
  const [validity, setValidity] = useState([])

  const makeValidityContrat = async ()=>{
    let date_debut_ = data.date_debut
    let validity_ = []
    let statut = (date_fin_contrat)=> moment(date_fin_contrat, "DD/MM/YYYY").isBefore(moment(),"day") ? "Expiré" : "Valide"

    for(let i=1;i<=1;i++){
      validity_.push({
        date_debut:date_debut_ ? moment(date_debut_,"DD/MM/YYYY").add(i-1, 'y').format('DD/MM/YYYY') : "",
        date_fin: date_debut_ ? moment(date_debut_,"DD/MM/YYYY").add(i,"year").subtract(1,"day").format('DD/MM/YYYY') : "",
        date_alarm_before: date_debut_ ? moment(date_debut_,"DD/MM/YYYY").add(i,"year").subtract(1,"day").subtract(45,"day").format('DD/MM/YYYY') : "",
        statut: date_debut_ ? statut(moment(date_debut_,"DD/MM/YYYY").add(i,"year").subtract(1,"day").format('DD/MM/YYYY')) : ""
      })
    } 

    setValidity(validity_)
  }

  useEffect(()=>{
    makeValidityContrat()
  },[])

  const theme = createTheme({
    typography: {
      fontFamily: [
        "titilliumlight",
        '"Helvetica Neue"',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        'Arial',
        'sans-serif',
        '"Segoe UI Emoji"',
        '"Apple Color Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      color:"black",
      h5: {
        fontSize: 20,
        letterSpacing: 7,
        fontWeight:200,
      },
      h6: {
        fontSize: 18,
        letterSpacing: 5,
        fontWeight:100,
        marginTop:15
      },
      
    },
  });

  const dialogContainer = {
    marginTop: 50
    // backgroundColor: "red",
  }

  const ficheContainer = {
    display: "flex",
    flexDirection: "column",
    // backgroundColor: "red",
  }

  const ficheItem = {
    // backgroundColor: "yellow",
    marginBottom: 20,
    width: "100%"
  }

  const TableContent = {
    fontFamily: "Arial, Helvetica, sans-serif",
    borderCollapse: "collapse",
    width: "100%"
  }

  const TableContentThTd = {
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
  }

  const RenderStatut = ( {statut} ) => {
    console.warn("the stat ++++++++++++++++++++bro",statut);
    let colorStatut = statut === "Valide" ? "#006635" : "#992600"
    const statutStyle = {
      color: colorStatut
    };
  
    console.warn("the color made ++++++++++++++++++++bro",colorStatut);
    return (
      <Box>
          <Typography style={statutStyle}>
             {statut}
          </Typography>
      </Box>
    );
  };


  return (
    <div>
      <Dialog
        open={openModal}
        onClose={onClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
        TransitionComponent={Transition}
        keepMounted
        style={dialogContainer}
      >
        <DialogTitle id="scroll-dialog-title"> <HeaderLabel title="RECAPITULATIF"/></DialogTitle>
          <DialogContent
          >
            <ThemeProvider theme={theme}>
              <div style={ficheContainer}>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>N° CONTRAT : </strong>{contrat?.num_contrat}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>N° FACTURE : </strong>{contrat?.num_facture}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>DATE FACTURE : </strong>{contrat?.date_facture}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>CLIENT : </strong>{contrat?.client?.nom_client}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>PROVINCE CLIENT : </strong>{contrat?.client?.ville?.province?.nom_province}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>VILLE CLIENT : </strong>{contrat?.client?.ville?.nom_ville}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>ADRESSE CLIENT : </strong>{contrat?.client?.adresse}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>REDEVANCE ANNUEL : </strong>{contrat?.redevance_totale ? `${contrat?.redevance_totale} Ar` : "Non Précisé"}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>DATE PROPOSITION : </strong>{contrat?.date_proposition}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div" ><strong>VALIDITE </strong></Typography>
                </div>
                <div style={ficheItem}>
                    <div className={` ${classes.tabledetail} ml-3`}>
                      <table className={` ${classes.tableContent}`}>
                        <thead  className={` ${classes.tableHeader}`}>
                          <tr>
                            {/* <th style={TableContentThTd}>Année </th> */}
                            <th className={` ${classes.tableContentThTd}`}>DATE DEBUT</th>
                            <th className={` ${classes.tableContentThTd}`}>DATE FIN</th>
                            <th className={` ${classes.tableContentThTd}`}>STATUT</th>
                            {/* <th className={` ${classes.tableContentThTd}`}>DATE NOTIFICATION MAIL</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          { validity.map((validity, index)=>{
                            return <tr key={index}>
                                      {/* <td className={` ${classes.tableContentThTd}`}>Année {index+1}</td> */}
                                      <td className={` ${classes.tableContentThTd}`}>{validity.date_debut}</td>
                                      <td className={` ${classes.tableContentThTd}`}>{validity.date_fin}</td>
                                      <td className={` ${classes.tableContentThTd}`}><RenderStatut statut={validity.statut}/></td>
                                      {/* <td className={` ${classes.tableContentThTd}`}>{validity.date_alarm_before}</td> */}
                                  </tr>
                          })          
                          }
                        </tbody>
                      </table>
                  </div>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div" ><strong>EQUIPEMENT :</strong></Typography>
                </div>
                <div style={ficheItem}>
                    <div className={` ${classes.tabledetail} ml-3`}>
                      <table className={` ${classes.tableContent}`}>
                        <thead  className={` ${classes.tableHeader}`}>
                          <tr>
                            <th className={` ${classes.tableContentThTd}`}>N° SERIE</th>
                            <th className={` ${classes.tableContentThTd}`}>MARQUE</th>
                            <th className={` ${classes.tableContentThTd}`}>MODELE</th>
                            <th className={` ${classes.tableContentThTd}`}>REDEVANCE</th>
                          </tr>
                        </thead>
                        <tbody>
                        { contrat.equipement.map((equipement, index)=>{
                          return <tr key={index}>
                                    <td className={` ${classes.tableContentThTd}`}>{equipement?.num_serie}</td>
                                    <td className={` ${classes.tableContentThTd}`}>{equipement?.marque}</td>
                                    <td className={` ${classes.tableContentThTd}`}>{equipement?.modele}</td>
                                    <td className={` ${classes.tableContentThTd}`}>{equipement?.redevance_contrat ? `${equipement?.redevance_contrat} Ar` : "Non Précisé"}</td>
                                </tr>
                        })          
                        }
                        </tbody>
                      </table>
                  </div>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div" ><strong>OBSERVATION </strong></Typography>
                  <Typography variant="h6">{contrat?.observation}</Typography>
                </div>
              </div>
            </ThemeProvider>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={onClose}>FEMER</Button> */}
          <div style={{marginRight : 23}}>

          <ButtonComponent color='error' function={onClose} name_of_btn="FERMER" icon={<CloseIcon />} />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Verify;