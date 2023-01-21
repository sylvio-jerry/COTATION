import React, {useEffect, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { HeaderLabel} from '../../components';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonComponent } from '../../components';
import Slide from '@mui/material/Slide';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography,Box } from '@mui/material';
import globalStyle from '../../Style/globalStyle';

var moment = require('moment');
moment.locale('fr')

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Verify = ({openModal,closeModal,data})=> {

  const onClose = () => {
    closeModal(false);
  };

  const [contrat]= useState(data)
  const classes = globalStyle();

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

  let statut = (date_fin_contrat)=> moment(date_fin_contrat, "DD/MM/YYYY").isBefore(moment(),"day") ? "Expiré" : "Valide"

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
            {/* {JSON.stringify(contrat)} */}
            <ThemeProvider theme={theme}>
              <div style={ficheContainer}>
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
                  <Typography variant="div"><strong>ANNEE CONTRAT: </strong>{contrat?.date_debut ? moment(contrat?.date_debut, "DD/MM/YYYY").year() : "" }</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>DATE DEBUT CONTRAT : </strong>{contrat?.date_debut}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>DATE FIN CONTRAT : </strong>{contrat?.date_debut ? moment(new Date(moment(contrat?.date_debut,"DD/MM/YYYY"))).endOf('year').format('L') : "" }</Typography>
                </div>
                <div style={ficheItem} className='flex'>
                  <Typography variant="div"><strong>STATUT CONTRAT :  </strong></Typography>
                  <div>{contrat?.date_debut ? <RenderStatut statut={statut(moment(new Date(moment(contrat?.date_debut,"DD/MM/YYYY"))).endOf('year').format('DD/MM/YYYY'))}/>  : ""}</div>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>SITE INSTALLATION : </strong>{contrat?.site_installation}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>REDEVANCE TOTALE : </strong>{contrat?.redevance_totale}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>DATE PROPOSITION : </strong>{contrat?.date_proposition}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div" ><strong>EQUIPEMENT </strong></Typography>
                </div>
                <div style={ficheItem}>
                    <div className={` ${classes.tabledetail} ml-3`}>
                      <table className={` ${classes.tableContent}`}>
                        <thead  className={` ${classes.tableHeader}`}>
                          <tr>
                            <th className={` ${classes.tableContentThTd}`}>N° SERIE</th>
                            <th className={` ${classes.tableContentThTd}`}>MARQUE</th>
                            <th className={` ${classes.tableContentThTd}`}>MODELE</th>
                            <th className={` ${classes.tableContentThTd}`}>FOURNISSEUR</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contrat?.equipement && <tr>
                            <td className={` ${classes.tableContentThTd}`}>{contrat?.equipement?.num_serie}</td>
                            <td className={` ${classes.tableContentThTd}`}>{contrat?.equipement?.marque}</td>
                            <td className={` ${classes.tableContentThTd}`}>{contrat?.equipement?.modele}</td>
                            <td className={` ${classes.tableContentThTd}`}>{contrat?.equipement?.fournisseur ? contrat?.equipement?.fournisseur  : "Non specifié"}</td>
                          </tr>}
                        </tbody>
                      </table>
                  </div>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div" ><strong>REDEVANCE</strong></Typography>
                </div>
                <div style={ficheItem}>
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
                          {contrat?.redevance_gab?.length > 0 &&  contrat?.redevance_gab?.map(({type,num_facture,date_facture,montant,isPaid},index)=>{
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
                <div style={ficheItem}>
                  <Typography variant="div" ><strong>OBSERVATION : </strong></Typography>
                  <Typography variant="h6">{contrat?.observation}</Typography>
                </div>
              </div>
            </ThemeProvider>
        </DialogContent>
        <DialogActions>
          <div style={{marginRight : 23}}>
          <ButtonComponent color='error' function={onClose} name_of_btn="FERMER" icon={<CloseIcon />} />
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Verify;