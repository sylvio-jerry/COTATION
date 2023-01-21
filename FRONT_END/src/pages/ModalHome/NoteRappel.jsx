import React, {useEffect, useState} from 'react';
import axios from 'axios'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { HeaderLabel,AlertToast } from '../../components';
import CloseIcon from '@mui/icons-material/Close';
import { ButtonComponent } from '../../components';
import Slide from '@mui/material/Slide';
import globalStyle from '../../Style/globalStyle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Typography , Divider ,TextField,Box} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useStateContext } from '../../contexts/ContextProvider';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';

var moment = require('moment');
moment.locale('fr')
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const NoteRappel = ({openModal,closeModal,data})=> {
  const { noteRappel, setNoteRappel } = useStateContext();
  
  const classes = globalStyle();
  const [note, setNote] = useState(noteRappel)

  const onClose = () => {
    AlertToast("info","Operation annulé")
    closeModal(false);
  };

  const saveNote = () => {
    setNoteRappel(note);
    AlertToast("success","Note Enregistré")
    closeModal(false);
  };



  const handleChange = (event) => {
    setNote(event.target.value);
  };

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
    alignItems : "center"
  }

  const ficheItem = {
    // backgroundColor: "yellow",
    marginBottom: 10,
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems : "center"
  }

  const action = {
    // backgroundColor: "grey",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop:0,
    // padding: 20,
    
  }

  const actionItem = {
    margin: 25
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
        <DialogTitle id="scroll-dialog-title"> 
          {/* <HeaderLabel title="NOUVEAU SERVICE"/> */}
          <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>NOTE DE RAPPEL</strong></Typography>
          </div>
        </DialogTitle>
          <DialogContent
          >
            <ThemeProvider theme={theme}>
              <div style={ficheContainer}>
                <div style={ficheItem}>
                  <Box
                    component="form"
                    sx={{
                      '& > :not(style)': { m: 2, minWidth: "35ch" },
                    }}
                    noValidate
                    autoComplete="off"
                  >
                    <TextField 
                      multiline rows={5} variant="filled"
                      name="note"
                      value={note}
                      onChange={handleChange}
                      placeholder="ex : Suivi pour aujourd'hui"
                      type="name"
                      label="NOTE" 
                    />
                  </Box>
                </div>
              </div>
            </ThemeProvider>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={onClose}>FEMER</Button> */}
          <div style={action}>
            <div style={actionItem}>
              <ButtonComponent color='error' function={onClose} name_of_btn="ANNULER" icon={<CloseIcon />} />
            </div>
            <div style={actionItem}>
              <ButtonComponent color='root' function={saveNote} name_of_btn="ENREGISTRER" icon={<SaveIcon />} />
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default NoteRappel;