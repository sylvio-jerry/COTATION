import * as React from 'react';
import { createTheme,ThemeProvider } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import AcUnitOutlinedIcon from '@mui/icons-material/AcUnitOutlined';

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
    root: createColor('#03C9D7'),
    // red: createColor('#03C9D7')
  },
});
  
const BadgeComponent = ({badgeContent,icon,color="root"})=> {
  return (
    <ThemeProvider theme={theme}>
        <Stack spacing={4} direction="row" sx={{ color: 'action.active'}}>
        <Badge badgeContent={badgeContent} showZero color={color}  sx={{ "& .MuiBadge-badge": { fontSize: 15, color:'white' } }}>
            {icon}
            {/* <Info style={{width:30, height:35}} /> */}
        </Badge>
        </Stack>
    </ThemeProvider>
  );
}

export default BadgeComponent;