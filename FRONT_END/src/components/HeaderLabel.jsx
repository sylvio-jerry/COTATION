import React from 'react';
import { Typography , Divider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const HeaderLabel = ({ title }) => {

  const theme = createTheme({
    typography: {
      // fontFamily: [
      //   '"Helvetica Neue"',
      //   '-apple-system',
      //   'BlinkMacSystemFont',
      //   '"Segoe UI"',
      //   'Roboto',
      //   'Arial',
      //   'sans-serif',
      //   '"Segoe UI Emoji"',
      //   '"Apple Color Emoji"',
      //   '"Segoe UI Symbol"',
      // ].join(','),
      h5: {
        fontSize: 20,
        letterSpacing: 7
      }
    },
  });


  return ( 
    // <div style={{borderRadius:15, padding:10}} className="bg-[#7fb6b9] mb-10">
      <div style={{borderRadius:15, padding:10}} className="bg-[#f2f2f2] mb-7">
      {/* <div style={{borderRadius:15, padding:10}} className="bg-[#dadcdd] mb-7"> */}
      <ThemeProvider theme={theme}>
        {/* <Button>Button</Button> */}
        <Typography align="center" variant="h5" color="black" fontWeight={100}>{title}</Typography>
      </ThemeProvider>
    </div>
  );
}

export default HeaderLabel;
