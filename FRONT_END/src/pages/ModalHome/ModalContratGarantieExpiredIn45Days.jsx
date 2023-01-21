import React, { useState} from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { HeaderLabel} from '../../components';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonComponent } from '../../components';
import Slide from '@mui/material/Slide';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography } from '@mui/material';
import globalStyle from '../../Style/globalStyle';

var moment = require('moment');
moment.locale('fr')

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const ModalContratGarantieExpiredIn45Days = ({openModal,closeModal,data})=> {

  const classes = globalStyle()
  const onClose = () => {
    closeModal(false);
  };

  const [contrat]= useState(data)

  const date_format = (date,stringFormat="DD/MM/YYYY")=>{
    let date_formatted = moment(new Date(date), stringFormat).format(stringFormat)
    return date_formatted;
  }

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
  
  return (
    <div>
      <Dialog
        open={openModal}
        onClose={onClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        fullWidth
        maxWidth="md"
        TransitionComponent={Transition}
        keepMounted
        style={dialogContainer}
      >
        <DialogTitle id="scroll-dialog-title"> <HeaderLabel title="CONTRAT DE GARANTIE"/></DialogTitle>
          <DialogContent
          >
            <ThemeProvider theme={theme}>
              <div style={ficheContainer}>
                <div style={ficheItem}>
                  <Typography variant="div"><strong>Liste de contrats de garantie autres que GAB expiré dans 45 jour : </strong>{contrat?.length}</Typography>
                </div>
                <div style={ficheItem}>
                    <div className={` ${classes.tabledetail} ml-3`}>
                      <table className={` ${classes.tableContent}`}>
                        <thead  className={` ${classes.tableHeader}`}>
                          <tr>
                            <th className={` ${classes.tableContentThTd}`}>N° CONTRAT</th>
                            <th className={` ${classes.tableContentThTd}`}>N° BN LIVRAISON</th>
                            <th className={` ${classes.tableContentThTd}`}>DATE LIVRAISON</th>
                            <th className={` ${classes.tableContentThTd}`}>NOMBRE EQUIPEMENT</th>
                            <th className={` ${classes.tableContentThTd}`}>PROVINCE</th>
                            <th className={` ${classes.tableContentThTd}`}>VILLE</th>
                            <th className={` ${classes.tableContentThTd}`}>CLIENT</th>
                          </tr>
                        </thead>
                        <tbody>
                          { contrat.map((contrat, index)=>{
                            return <tr key={index}>
                                      <td className={` ${classes.tableContentThTd}`}>{contrat?.num_contrat?.toString().toUpperCase()}</td>
                                      <td className={` ${classes.tableContentThTd}`}>{contrat?.livraison?.num_bon_livraison?.toString().toUpperCase()}</td>
                                      <td className={` ${classes.tableContentThTd}`}>{contrat?.livraison?.date_livraison ? date_format(contrat?.livraison?.date_livraison) : "-"}</td>
                                      <td className={` ${classes.tableContentThTd}`}>{contrat?.contrat_garantie_detail?.length}</td>
                                      <td className={` ${classes.tableContentThTd}`}>{contrat?.livraison?.client?.ville?.province?.nom_province.toString().toUpperCase()}</td>
                                      <td className={` ${classes.tableContentThTd}`}>{contrat?.livraison?.client?.ville?.nom_ville}</td>
                                      <td className={` ${classes.tableContentThTd}`}>{contrat?.livraison?.client?.nom_client.toString().toUpperCase()}</td>
                                  </tr>
                          })          
                          }
                        </tbody>
                      </table>
                  </div>
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

export default ModalContratGarantieExpiredIn45Days;