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
import { Typography , Divider } from '@mui/material';

var moment = require('moment');
moment.locale('fr')

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Verify = ({openModal,closeModal,data})=> {
  const classes = globalStyle()
  const onClose = () => {
    closeModal(false);
  };

  const [contrat]= useState(data)
  const [validity, setValidity] = useState([])

  const makeValidityContrat = async ()=>{
    // console.log("teste : ",moment(date_debut_,"DD/MM/YYYY").add(3, 'y').format('DD/MM/YYYY'));
    let duree_annee_contrat = +data.duree_annee
    let date_debut_ = data.date_debut
    let validity_ = []
    let statut = (date_fin_contrat)=> moment(date_fin_contrat, "DD/MM/YYYY").isBefore(moment(),"day") ? "Expiré" : "Valide"

    for(let i=1;i<=duree_annee_contrat;i++){
      validity_.push({
        date_debut:moment(date_debut_,"DD/MM/YYYY").add(i-1, 'y').format('DD/MM/YYYY'),
        date_fin:moment(date_debut_,"DD/MM/YYYY").add(i,"year").subtract(1,"day").format('DD/MM/YYYY'),
        date_alarm_before:moment(date_debut_,"DD/MM/YYYY").add(i,"year").subtract(1,"day").subtract(45,"day").format('DD/MM/YYYY'),
        statut: statut(moment(date_debut_,"DD/MM/YYYY").add(i,"year").subtract(1,"day").format('DD/MM/YYYY'))
      })
    } 

    setValidity(validity_)
  }

  useEffect(()=>{
    // console.log("dialog verify mounted", validity);
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

  const resumeContainer = {
    display: "flex",
    flexDirection: "column",
  }

  const resumeItem = {
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
              <div style={resumeContainer}>
                <div style={resumeItem}>
                  <Typography variant="div"><strong>N° CONTRAT : </strong>{contrat.num_contrat}</Typography>
                </div>
                <div style={resumeItem}>
                  <Typography variant="div"><strong>N° FACTURE : </strong>{contrat.num_facture}</Typography>
                </div>
                <div style={resumeItem}>
                  <Typography variant="div"><strong>DATE FACTURE : </strong>{contrat.date_facture}</Typography>
                </div>
                <div style={resumeItem}>
                  <Typography variant="div"><strong>CLIENT : </strong>{contrat.client.nom_client}</Typography>
                </div>
                <div style={resumeItem}>
                  <Typography variant="div"><strong>ADRESSE CLIENT : </strong>{contrat.client.adresse}</Typography>
                </div>
                <div style={resumeItem}>
                  <Typography variant="div"><strong>DATE PROPOSITION : </strong>{contrat.date_proposition}</Typography>
                </div>
                <div style={resumeItem}>
                  <Typography variant="div" ><strong>EQUIPEMENT : Nombre ({contrat.equipement.length})</strong></Typography>
                </div>
                <div style={resumeItem}>
                  <div>
                      <table style={TableContent}>
                        <thead>
                          <tr>
                            <th style={TableContentThTd}>N° SERIE</th>
                            <th style={TableContentThTd}>MARQUE</th>
                            <th style={TableContentThTd}>MODELE</th>
                          </tr>
                        </thead>
                        <tbody>
                        { contrat.equipement.map((equipement, index)=>{
                          return <tr key={index}>
                                    <td style={TableContentThTd}>{equipement.num_serie}</td>
                                    <td style={TableContentThTd}>{equipement.marque}</td>
                                    <td style={TableContentThTd}>{equipement.modele}</td>
                                </tr>
                        })          
                        }
                        </tbody>
                      </table>
                  </div>
                </div>
                <div style={resumeItem}>
                  <Typography variant="div" ><strong>VALIDITE : Nombre Année ({contrat.duree_annee})</strong></Typography>
                </div>
                <div style={resumeItem}>
                  <div>
                      <table  style={TableContent}>
                        <thead>
                          <tr>
                            <th style={TableContentThTd}>Année </th>
                            <th style={TableContentThTd}>DEBUT</th>
                            <th style={TableContentThTd}>FIN</th>
                            <th style={TableContentThTd}>STATUT</th>
                            <th style={TableContentThTd}>DATE NOTIFICATION MAIL</th>
                          </tr>
                        </thead>
                        <tbody>
                          { validity.map((validity, index)=>{
                            return <tr key={index}>
                                      <td style={TableContentThTd}>Année {index+1}</td>
                                      <td style={TableContentThTd}>{validity.date_debut}</td>
                                      <td style={TableContentThTd}>{validity.date_fin}</td>
                                      <td style={TableContentThTd}>{validity.statut}</td>
                                      <td style={TableContentThTd}>{validity.date_alarm_before}</td>
                                  </tr>
                          })          
                          }
                        </tbody>
                      </table>
                  </div>
                </div>
                <div style={resumeItem}>
                  <Typography variant="div" ><strong>OBSERVATION : </strong></Typography>
                  <Typography variant="h6">{contrat.observation}</Typography>
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