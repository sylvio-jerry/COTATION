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
import logo_smmc from '../../assets/images/smmc.png'
import background from '../../assets/images/port.jpg'


const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
function Copyright(props) {
    return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://smmc-company.com/">
        @SMMC PORT TOAMASINA
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
  // flexDirection: 'column', alignItems: 'center'
  return (
    <ThemeProvider theme={theme}>
      <div className=' w-full bg-black overflow-hidden flex justify-center' style={{height: '100vh',flexDirection: 'column', alignItems: 'center',backgroundImage: `url(${background})` }}>
        <div  style={{ display: 'flex',flexDirection: 'column', alignItems: 'center'}}>
          <div className=' rounded-3xl' style={{backgroundColor:'rgba(227,201,117,0.9)'}}>
            <Container component="main" maxWidth="xs" style={{ padding: 10,paddingTop:0.5, marginTop:5}} className="rounded-3xl">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* <Avatar sx={{ m: 1, bgcolor: '#f1c139' }}>
                  <LockOutlinedIcon />
                </Avatar> */}
                <Link to="/" className="items-center gap-3 ml-3 mt-4 flex text-xl font-extrabold tracking-tight dark:text-white text-slate-900">
                  <img src={logo_smmc} alt='SMMC' width={250} height={250} />
                </Link>{' '} 
                <div className='mt-5 text-center'>
                  <Typography component="h3" variant="h5">
                    COTATION DE MANUTENTION DES MARCHANDISES CONVENTIONNELLES
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
                      <div className='text-black sm'>
                        Mot de passe oublié ? 
                      </div>
                      <div className='text-black sm'>
                        Pas de compte ? <Link to={'#'}>Inscrivez-vous !</Link>
                      </div>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              <Copyright sx={{ mt: 2, mb: 4 }} />
            </Container>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}