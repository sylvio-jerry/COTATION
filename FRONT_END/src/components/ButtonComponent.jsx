import React from 'react'
import {Button} from '@mui/material'
import { createTheme,ThemeProvider } from '@mui/material/styles';

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor) => augmentColor({ color: { main: mainColor } });

const theme = createTheme({
  palette: {
    anger: createColor('#F40B27'),
    apple: createColor('#5DBA40'),
    steelBlue: createColor('#5C76B7'),
    violet: createColor('#BC00A3'),
    vertBlue: createColor('#7fb6b9'),
    root: createColor('#03C9D7')
  },
});

const ButtonComponent = (props)=> {
  let enable_button = props.disable_button ? (props.disable_button) : (false)
 let  variation = props.variation ? (props.variation) : ('contained')
 let  bgColor = props.color ? (props.color) : ('white')
 let  color = props.textColor ? (props.textColor) : ('white')

  return (
    <>
      <ThemeProvider theme={theme}>
        <Button variant={variation} style={{color:color}} color={bgColor} disabled={enable_button} onClick={() => props.function()}  startIcon={props.icon}>{props.name_of_btn}</Button>
      </ThemeProvider>  
    </>
    )
}

export default ButtonComponent;