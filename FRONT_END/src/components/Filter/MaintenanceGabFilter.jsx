import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { Box,InputLabel,MenuItem,Select,FormControl,TextField} from '@mui/material';
import { ExportPdf, ExportExcel, DatePicker,YearPicker} from '..'

var moment = require('moment');
moment.locale('fr');

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
const MaintenanceGabFilter = ({exportPdf,exportExcel,filterOption,filterData}) => {

  useEffect(()=>{
    getProvince()
    getVille()
    getClient()
  },[])

  const TOUS = 0
  const [filter, setFilter]= useState(filterData)
  const [provinceData,setProvinceData] = useState([])
  const [villeData,setVilleData] = useState([])
  const [villeDataFiltered,setVilleDataFiltered] = useState([])
  const [clientData,setClientData] = useState([])
  const [clientDataFiltered,setClientDataFiltered] = useState([])

  const statutData = [
    { id:1, statut:"Expiré" },
    { id:2, statut:"Valide" }
  ]
  
  useEffect(()=>{
    setFilter({...filter,client:0})
    if(filter.ville===0){
      setClientDataFiltered(clientData)
    }else{
      setClientDataFiltered(clientData.filter(client=>client.ville_id===filter.ville))
    }
  },[filter.ville])

  useEffect(()=>{
    setFilter({...filter,ville:0})
    if(filter.province===0){
      setVilleDataFiltered(villeData)
    }else{
      setVilleDataFiltered(villeData.filter(ville=>ville.province_id===filter.province))
    }
  },[filter.province])

  useEffect(()=>{
    handleQuarter()
  },[filter.date_range])

  useEffect(()=>{
    filterOption(filter)
  },[filter])

  const handleQuarter = ()=>{
    const JANVIER = moment().month(0)
    const MARS = moment().month(2)
    const AVRIL = moment().month(3)
    const JUIN = moment().month(5)
    const JUILLET = moment().month(6)
    const SEPTEMBRE = moment().month(8)
    const OCTOBRE = moment().month(9)
    const DECEMBRE = moment().month(11)
  
    const {date_debut:old_date_debut,date_fin:old_date_fin}=filter

    let date_debut=old_date_debut
    let date_fin=old_date_fin
    if(filter.date_range===0){
      // console.log('in zero 00')
        date_debut=moment().startOf('year')
       date_fin=moment().endOf('year')

    }
    if(filter.date_range==="Q1"){
      // console.log('in Q1')
      date_debut=moment(JANVIER).startOf('month')
      date_fin=moment(MARS).endOf('month')
    }
    if(filter.date_range==="Q2"){
      // console.log('in Q2')
      date_debut=moment(AVRIL).startOf('month')
      date_fin=moment(JUIN).endOf('month')
    }
    if(filter.date_range==="Q3"){
      // console.log('in Q3')
      date_debut=moment(JUILLET).startOf('month')
      date_fin=moment(SEPTEMBRE).endOf('month')
    }
    if(filter.date_range==="Q4"){
      // console.log('in Q4')
      date_debut=moment(OCTOBRE).startOf('month')
      date_fin=moment(DECEMBRE).endOf('month')
    }
    if((!old_date_debut.isSame(date_debut))||(!old_date_fin.isSame(date_fin)))
    setFilter({
      ...filter,
      date_debut,
      date_fin
    });
  }

  const getProvince = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/province`)
      if(data){
        setProvinceData(data.data)
      }
     } catch (error) {
       console.log("error while getProvinceRequest:",error);
     }
  }
  const getVille = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/ville`)
      if(data){
        setVilleData(data.data)
        setVilleDataFiltered(data.data)
      }
     } catch (error) {
       console.log("error while getProvinceRequest:",error);
     }
  }
  const getClient= async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/client`)
      if(data){
        setClientData(data.data)
        setClientDataFiltered(data.data)
      }
     } catch (error) {
       console.log("error while getClientRequest:",error);
     }
  }

  const handleChangeDateInstallation = (date) => {
    setFilter({...filter,date_debut:date});
  };

  const handleChangeDateFin = (date) => {
    setFilter({...filter,date_fin:date});
  };
  
  const handleChange = (event) => {
    setFilter({...filter,[event.target.name]:event.target.value});
  };

  const handlePdf = ()=>{
    exportPdf()
  }

  const handleExcel = ()=>{
    exportExcel()
  }

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
      justifyContent: "space-between",
      flexWrap: "wrap"
    }

  const filterItem = {
      // height: "50%",
      // backgroundColor:"yellow",
      // minWidth: "20ch",
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
      justifyContent:"space-between",
      height: "50%",
      flexWrap: "wrap"
  }
  
  const formStyle= {
    width:"17ch",
    minWidth: "17ch",
    // backgroundColor:"pink",
    margin:5
  }   

    return (
      <div style={filterContainer}>
        <div style={filterUp}>
          <div style={filterItem}>
            <div style={{}}>
              <Box style={{width:"100%"}}>
                <FormControl style={formStyle} >
                  <InputLabel id="demo-simple-select-label">PROVINCE</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter.province}
                    label=" PROVINCE "
                    onChange={handleChange}
                    name="province"
                  >
                    <MenuItem value={TOUS} >TOUS</MenuItem>
                  {
                      provinceData.map(({id,nom_province})=>{
                          return <MenuItem value={id} key={id}>{nom_province}</MenuItem>
                      })
                  }
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div style={{}}>
              <Box style={{width:"100%"}}>
                <FormControl style={formStyle} >
                  <TextField
                    select
                    SelectProps={{
                      MenuProps: {
                        sx: { maxHeight: '35ch' }
                      }
                    }}
                    value={filter.ville}
                    label=" VILLE "
                    onChange={handleChange}
                    name="ville"
                  >
                    <MenuItem value={TOUS}>TOUS</MenuItem>
        
                    {
                      villeDataFiltered.map(({id,nom_ville,province})=>{
                          return <MenuItem value={id} key={id}>{`${province.nom_province} ${nom_ville} `}</MenuItem>
                      })
                    }   
                  </TextField>        
                </FormControl>
              </Box> 
            </div>
          </div>
          <div style={filterItem}>
            <div>
              <Box style={{width:"100%"}}>
                <FormControl style={formStyle} >
                  <TextField
                    select
                    SelectProps={{
                      MenuProps: {
                        sx: { maxHeight: '35ch' }
                      }
                    }}
                    value={filter.client}
                    label=" CLIENT "
                    onChange={handleChange}
                    name="client"
                  >
                    <MenuItem value={TOUS}>TOUS</MenuItem>
        
                    {
                      clientDataFiltered.map(({id,nom_client,ville,adresse})=>{
                          return <MenuItem value={id} key={id}>{`${nom_client} ${ville.province.nom_province} ${ville.nom_ville} ${adresse}`}</MenuItem>
                      })
                    } 
                  </TextField>        
                </FormControl>
              </Box> 
            </div>
            <div style={{}}>
              <Box style={{width:"100%"}}>
                <FormControl style={formStyle}>
                  <InputLabel id="demo-simple-select-label">STATUT CONTRAT</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter.statut}
                    label=" STATUT CONTRAT "
                    onChange={handleChange}
                    name="statut"
                  >
                    <MenuItem value={TOUS} >TOUS</MenuItem>
                  {
                      statutData.map(({id,statut})=>{
                          return <MenuItem value={statut} key={id}>{statut}</MenuItem>
                      })
                  }
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div style={{}}>
              <Box style={{width:"100%"}}>
                <FormControl style={formStyle}>
                  <InputLabel id="demo-simple-select-label">STATUT REDEVANCE</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter.redevance}
                    label=" STATUT REDEVANCE "
                    onChange={handleChange}
                    name="redevance"
                  >
                    <MenuItem value={TOUS} >TOUS</MenuItem>
                    <MenuItem value={1} >PAYE</MenuItem>
                    <MenuItem value={2} >NON PAYE</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>
          {/* <div style={filterItem}> 
          </div> */}
        </div>
        <div style={filterDown}>
          <div style={filterItem}>
            <div style={{}}>
              <Box style={{width: "100%"}}>
                <FormControl style={formStyle}>
                    <DatePicker label="DATE DEBUT" defaultValue={filter.date_debut} getDate={handleChangeDateInstallation}/>
                </FormControl>
              </Box>
            </div>
            <div style={{}}>
              <Box >
                <FormControl style={formStyle}>
                  <DatePicker label="DATE FIN" defaultValue={filter.date_fin} getDate={handleChangeDateFin}/>
                  {/* <DatePicker label="DATE FIN" views={['year']} defaultValue={filter.date_fin} getDate={handleChangeDateFin}/> */}
                </FormControl>
              </Box>
            </div>
          </div>  
          <div style={filterItem}>
            {/* <div style={{}}>
              <Box style={{width:"100%"}}>
                <FormControl style={formStyle}>
                  <InputLabel id="demo-simple-select-label">FLITRE DATE</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter.date_range}
                    label=" FLITRE DATE "
                    onChange={handleChange}
                    name="date_range"
                  >
                    <MenuItem value={TOUS} >TOUS</MenuItem>
                    <MenuItem value={'Q1'} >JAN - MARS</MenuItem>
                    <MenuItem value={'Q2'} >AVRIL - JUIN</MenuItem>
                    <MenuItem value={'Q3'} >JUILLET - SEPTEMBRE</MenuItem>
                    <MenuItem value={'Q4'} >OCTOBRE - DECEMBRE</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div> */}
            <div style={{}}>
              <Box style={{width:"100%"}}>
                <FormControl style={formStyle}>
                  <InputLabel id="demo-simple-select-label">FACTURE</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter.num_facture}
                    label=" FACTURE "
                    onChange={handleChange}
                    name="num_facture"
                  >
                    <MenuItem value={TOUS} >TOUS</MenuItem>
                    <MenuItem value={1} >FACTURE</MenuItem>
                    <MenuItem value={2} >NON FACTURE</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div style={{}}>
              <Box style={{width:"100%"}}>
                <FormControl style={formStyle}>
                  <InputLabel id="demo-simple-select-label">TRIMESTRE</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter.quarter}
                    label=" TRIMESTRE "
                    onChange={handleChange}
                    name="quarter"
                  >
                    <MenuItem value={TOUS} >TOUS</MenuItem>
                    <MenuItem value={'Q1'} >Q1</MenuItem>
                    <MenuItem value={'Q2'} >Q2</MenuItem>
                    <MenuItem value={'Q3'} >Q3</MenuItem>
                    <MenuItem value={'Q4'} >Q4</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </div>
              <div >
                <Box style={{width:"100%"}}>
                  <FormControl style={formStyle}>
                      <div style={{display: "flex", justifyContent: "end"}}>
                        {/* <ExportPdf function={handlePdf}/> */}
                        <ExportExcel function={handleExcel}/>
                    </div>
                  </FormControl>
                </Box>
              </div>
          </div>  
          {/* <div style={filterItem}>
          </div>   */}
        </div>
      </div>
    );
  }

export default MaintenanceGabFilter;
