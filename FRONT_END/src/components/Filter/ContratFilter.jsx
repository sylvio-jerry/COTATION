import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { Box,InputLabel,MenuItem,Select,FormControl,TextField } from '@mui/material';
import { ExportPdf, ExportExcel,DatePicker} from '../../components'
import filterFunction from "../../filterFunction";

var moment = require('moment');
moment.locale('fr');

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
const ContratFilter = ({exportPdf,exportExcel,filterOption,filterData}) => {

  useEffect(()=>{
    getProvince()
    getService()
    getFamille()
    getClient()
  },[])

  
  const TOUS = 0
  const [filter, setFilter]= useState(filterData)
  const [provinceData,setProvinceData] = useState([])
  const [serviceData,setServiceData] = useState([])
  const [familleData,setFamilleData] = useState([])
  const [familleDataFiltered,setFamilleDataFiltered] = useState([])
  const [clientData,setClientData] = useState([])
  const [clientDataFiltered,setClientDataFiltered] = useState([])

  const statutData = [
    { id:1, statut:"Expiré" },
    { id:2, statut:"Valide" }
  ]
  
  useEffect(()=>{
    filterOption(filter)
  },[filter])
  
    useEffect(()=>{
      setFilter({...filter,famille:0})
      if(filter.service===0){
        setFamilleDataFiltered(familleData)
      }else{
        setFamilleDataFiltered(familleData.filter(famille=>famille.service_id===filter.service))
      }
    },[filter.service])

    useEffect(()=>{
      setFilter({...filter,client:0})
      if(filter.province===0){
        setClientDataFiltered(clientData)
      }else{
        setClientDataFiltered(clientData.filter(client=>client?.ville?.province?.id === filter.province))
      }
    },[filter.province])

    
    //getFamilleWithoutGab
    const handleFamille= (item) => item?.nom_famille !== "GAB";
    
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

  const getService = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/service`)
      if(data){
        setServiceData(data.data)
      }
     } catch (error) {
       console.log("error while getServiceRequest:",error);
     }
  }
  const getFamille = async()=>{
    const checking = [handleFamille];
    try {
      const {data} = await axios.get(`${API_URL}/api/famille`)
      if(data){
        setFamilleData(data.data)
        
        const newArray = filterFunction(data.data, checking);
        setFamilleDataFiltered(newArray)
      }
     } catch (error) {
       console.log("error while getFamilleRequest:",error);
     }
  }

  const handleChangeDateDebut = (date) => {
    // setDate_debut_contrat(date);
    setFilter({...filter,date_debut_contrat:date});
  };

  const handleChangeDateFin = (date) => {
    setFilter({...filter,date_fin_contrat:date});
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
                <FormControl style={formStyle}>
                  <InputLabel id="demo-simple-select-label">SERVICE</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter.service}
                    label=" SERVICE "
                    onChange={handleChange}
                    name="service"
                  >
                    <MenuItem value={TOUS} >TOUS</MenuItem>
                  {
                      serviceData.map(({id,nom_service})=>{
                          return <MenuItem value={id} key={id}>{nom_service}</MenuItem>
                      })
                  }
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div >
              {/* {JSON.stringify(filter)} */}
              <Box style={{width:"100%"}}>
                <FormControl style={formStyle}>
                  <InputLabel id="demo-simple-select-label">FAMILLE</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter.famille}
                    label=" FAMILLE "
                    onChange={handleChange}
                    name="famille"
                  >
                    <MenuItem value={TOUS} >TOUS</MenuItem>
                  {
                      familleDataFiltered.map(({id,nom_famille})=>{
                          return <MenuItem value={id} key={id}>{nom_famille}</MenuItem>
                      })
                  }
                  </Select>
                </FormControl>
              </Box>
            </div>
          </div>
          <div style={filterItem}>
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
                          return <MenuItem value={statut} key={id}>{statut}</MenuItem>
                      })
                  }
                  </Select>
                </FormControl>
              </Box>
            </div>
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
          </div>
        </div>
        <div style={filterDown}>
          <div style={filterItem}>
            <div style={{}}>
              <Box style={{width: "100%"}}>
                <FormControl style={formStyle}>
                    <DatePicker label="DATE DEBUT" defaultValue={filter.date_debut_contrat} getDate={handleChangeDateDebut}/>
                </FormControl>
              </Box>
            </div>
              <div style={{}}>
              <Box >
                <FormControl style={formStyle}>
                  <DatePicker label="DATE FIN" defaultValue={filter.date_fin_contrat} getDate={handleChangeDateFin}/>
                  {/* <DatePicker label="DATE FIN" views={['year']} defaultValue={filter.date_fin_contrat} getDate={handleChangeDateFin}/> */}
                </FormControl>
              </Box>
            </div>
          </div>  
          <div style={filterItem}>
            <div >
              {/* <Box style={{width:"100%"}}>
                <FormControl style={formStyle}>
                  <InputLabel id="demo-simple-select-label">CLIENT</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter.client}
                    label=" CLIENT "
                    onChange={handleChange}
                    name="client"
                  >
                    <MenuItem value={TOUS}>TOUS</MenuItem>
                  {
                      clientDataFiltered.map(({id,nom_client})=>{
                          return <MenuItem value={id} key={id}>{nom_client}</MenuItem>
                      })
                  }
                  </Select>
                </FormControl>
              </Box> */}
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
        </div>
      </div>
    );
  }

export default ContratFilter;
