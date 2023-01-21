import React from 'react';
import { IconButton } from '@mui/material';
import {ReactComponent  as Pdf}  from '../assets/images/pdf.svg'

const ExportPdf = (props) => {
    return (
        <IconButton onClick={() => {props.function()}}><Pdf style={{width:40, height:50}}/></IconButton>
    );}

export default ExportPdf;
