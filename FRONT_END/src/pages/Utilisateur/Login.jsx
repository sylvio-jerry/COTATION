import React, {useEffect, useState} from 'react';
import axios from 'axios'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AlertToast } from '../../components';
import { useStateContext } from '../../contexts/ContextProvider';
import logo_birger from '../../assets/images/logo_birger.png'

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
function Copyright(props) {
    return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.birger.technology/">
        @BIRGER
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignIn() {
    const {setCurrentUser} = useStateContext();
    
    // const navigate= useNavigate()

    const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const userInfo = {
        email: data.get('email'),
        password: data.get('password'),
    }

    try {
        const {data} = await axios.post(`${API_URL}/api/utilisateur/login`,userInfo)
        let {status,message} = data
        if(status==="success"){
            const userConnected = data.data
          AlertToast("success",message)
          localStorage.setItem('userConnected',JSON.stringify(userConnected) );
          setCurrentUser(userConnected)
        //   const userLoggedIn = {"id":userConnected.id,"pseudo":userConnected.pseudo, "email": userConnected.email}
        //   localStorage.setItem('userConnected',userLoggedIn );
        // setCurrentUser(userLoggedIn)
        }
       } catch ({response}) {
        console.log("error while loggingRequest:", response);
        let {status,message} = response.data
        if(status==="failed"){
          AlertToast("error",message)
        }
     }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Link to="/" className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
            <img src={logo_birger} alt='BIRGER' width={150} height={50} />
          </Link>{' '} 
          <div className='mt-5'>
            <Typography component="h3" variant="h5">
              CONTRAT DE MAINTENANCE
            </Typography>
          </div>
         
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Se connecter
            </Button>
            <Grid container>
              <Grid item>
                <div className='text-gray-500 sm'>
                Mot de passe oublié ? Veuillez contacter votre administrateur
                </div>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}