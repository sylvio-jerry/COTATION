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

  const onClose = () => {
    closeModal(false);
  };

  const [livraison]= useState(data)
  const classes = globalStyle()
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
                  <Typography variant="div"><strong>N° BON DE LIVRAISON : </strong>{livraison?.num_bon_livraison}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>N° FACTURE : </strong>{livraison?.num_facture}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>DATE FACTURE : </strong>{livraison?.date_facture}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>DATE LIVRAISON : </strong>{livraison?.date_livraison}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>CLIENT : </strong>{livraison?.client?.nom_client}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>PROVINCE CLIENT : </strong>{livraison?.client?.ville?.province?.nom_province}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>VILLE CLIENT : </strong>{livraison?.client?.ville?.nom_ville}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>ADRESSE CLIENT : </strong>{livraison?.client?.adresse}</Typography>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div" ><strong>EQUIPEMENT : Nombre ({livraison?.equipement?.length})</strong></Typography>
                </div>
                <div style={ficheItem}>
                    <div className={` ${classes.tabledetail} ml-3`}>
                      <table className={` ${classes.tableContent}`}>
                        <thead  className={` ${classes.tableHeader}`}>
                          <tr>
                            <th className={` ${classes.tableContentThTd}`}>N° SERIE</th>
                            <th className={` ${classes.tableContentThTd}`}>MARQUE</th>
                            <th className={` ${classes.tableContentThTd}`}>MODELE</th>
                            <th className={` ${classes.tableContentThTd}`}>GARANTIE</th>
                            <th className={` ${classes.tableContentThTd}`}>FOURNISSEUR</th>
                          </tr>
                        </thead>
                        <tbody>
                        { livraison?.equipement?.map((equipement, index)=>{
                          return <tr key={index}>
                                    <td className={` ${classes.tableContentThTd}`}>{equipement?.num_serie}</td>
                                    <td className={` ${classes.tableContentThTd}`}>{equipement?.marque}</td>
                                    <td className={` ${classes.tableContentThTd}`}>{equipement?.modele}</td>
                                    <td className={` ${classes.tableContentThTd}`}>{equipement.duree_garantie ? `${equipement.duree_garantie} Mois` : "Pas de garantie"}</td>
                                    <td className={` ${classes.tableContentThTd}`}>{equipement.fournisseur ? equipement.fournisseur : "Non specifié"}</td>
                                </tr>
                        })          
                        }
                        </tbody>
                      </table>
                  </div>
                </div>
                <div style={ficheItem}>
                  <Typography variant="div" ><strong>OBSERVATION : </strong></Typography>
                  <Typography variant="h6">{livraison?.observation}</Typography>
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