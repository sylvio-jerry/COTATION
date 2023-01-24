import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { Box,InputLabel,MenuItem,Select,FormControl,TextField } from '@mui/material';
import { ExportPdf,DatePicker} from '..'
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
var moment = require('moment');
moment.locale('fr');
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
const VehiculeFilter = ({filterOption,filterData}) => {

  const TOUS = 0
  const [filter, setFilter]= useState(filterData)

  const statutData = [
    { id:1, statut:"DISPONIBLE" },
    { id:2, statut:"NON DISPONIBLE" }
  ]
  
   //'NEUVE','OCCASION','CAMION','ENGIN','REMORQUE'
   const EtatVehiculeData = [
    { id:1, etat:"NEUVE" },
    { id:2, etat:"OCCASION" },
    { id:3, etat:"CAMION" },
    { id:4, etat:"ENGIN" },
    { id:5, etat:"REMORQUE"}
  ]

  // useEffect(()=>{
  //   filterOption(filter)
  // },[filter])

  const handleChangeDateDebut = (date) => {
    setFilter({...filter,date_debut_arrivee:date});
  };

  const handleChangeDateFin = (date) => {
    setFilter({...filter,date_fin_arrivee:date});
  };
  
  const handleChange = (event) => {
    setFilter({...filter,[event.target.name]:event.target.value});
  };

  //style
  const filterContainer = {
      // height: 180,
      borderRadius:3,
      backgroundColor:"#f2f2f2",
      borderTop: "2px double #afa2a2",
      borderBottom: "2px inset #afa2a2",
      display: "flex",
      flexDirection:"column",
      alignItems:"center"  
  }
  const filterUp = {
      // backgroundColor:"red",
      width:"100%",
      marginBottom:"20px",
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap"
    }

    const filterItem = {
        // height: "50%",
        // backgroundColor:"yellow",
        minWidth: "50ch",
        display: "flex",
        justifyContent:"space-between",
        flexWrap: "wrap",
        margin:5
    }

  const filterDown = {
      // height: 100,
      // backgroundColor:"blue",
      display: "flex",
      width:"100%",
      justifyContent:"center",
      height: "50%",
      flexWrap: "wrap"
  }
  
  const formStyle= {
    width:"20ch",
    minWidth: "20ch",
    margin:5
  }     

    return (
      <div style={filterContainer}>
        <div style={filterUp}>
          <div style={filterItem}>
            <div >
              <Box style={{width:"100%"}}>
                <FormControl style={formStyle}>
                  <TextField
                    select
                    SelectProps={{
                      MenuProps: {
                        sx: { maxHeight: '35ch' }
                      }
                    }}
                    value={filter.etatVehicule}
                    label=" ETAT VEHICULE "
                    onChange={handleChange}
                    name="etatVehicule"
                    required
                  >
                    <MenuItem value={TOUS} >TOUS</MenuItem>
                      {
                        EtatVehiculeData.map(({id,etat})=>{
                            return <MenuItem value={etat} key={id}>{`${etat}`}</MenuItem>
                        })
                      }   
                  </TextField>   
                </FormControl>
              </Box>
            </div>
            <div style={{}}>
              <Box style={{width:"100%"}}>
                <FormControl style={formStyle}>
                  <InputLabel id="demo-simple-select-label">STATUT</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter.statut}
                    label=" STATUT "
                    onChange={handleChange}
                    name="statut"
                  >
                    <MenuItem value={TOUS} >TOUS</MenuItem>
                  {
                      statutData.map(({id,statut})=>{
                          return <MenuItem value={id} key={id}>{statut}</MenuItem>
                      })
                  }
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>
        </div>
        <div style={filterDown}>
          <div style={filterItem}>
            <div style={{}}>
              <Box style={{width: "100%"}}>
                <FormControl style={formStyle}>
                    <DatePicker label="DATE DEBUT" defaultValue={filter.date_debut_arrivee} getDate={handleChangeDateDebut}/>
                
                </FormControl>
              </Box>
            </div>
              <div style={{}}>
              <Box >
                <FormControl style={formStyle}>
                  <DatePicker label="DATE FIN" defaultValue={filter.date_fin_arrivee} getDate={handleChangeDateFin}/>
                </FormControl>
              </Box>
            </div>
          </div>   
        </div>
      </div>
    );
  }

export default VehiculeFilter;
