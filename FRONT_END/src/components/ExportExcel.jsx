import React from 'react';
import { IconButton } from '@mui/material';
import {ReactComponent  as Excel}  from '../assets/images/excel_96.svg'

const ExportExcel = (props) => {
    return (
        <IconButton onClick={() => { props.function() }}><Excel  style={{width:55, height:55}}/></IconButton>
    );}

export default ExportExcel;
