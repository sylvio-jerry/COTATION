import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { Box,InputLabel,MenuItem,Select,FormControl } from '@mui/material';
import { ExportPdf, ExportExcel} from '../../components'

var moment = require('moment');
moment.locale('fr');
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
const ContratFilter = ({exportPdf,exportExcel,filterOption,filterData}) => {

  useEffect(()=>{
    getService()
    getFamille()
  },[])

  const TOUS = 0
  const [filter, setFilter]= useState(filterData)
  const [serviceData,setServiceData] = useState([])
  const [familleData,setFamilleData] = useState([])
  const [familleDataFiltered,setFamilleDataFiltered] = useState([])

  const garantieData = [
    { id:1, garantie:"AVEC GARANTIE" },
    { id:2, garantie:"PAS DE GARANTIE" }
  ]

  const dispositionData = [
    { id:1, disposition:"INTERNE" },
    { id:2, disposition:"EXTERNE" }
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
    try {
      const {data} = await axios.get(`${API_URL}/api/famille`)
      if(data){
        setFamilleData(data.data)
        setFamilleDataFiltered(data.data)
      }
     } catch (error) {
       console.log("error while getFamilleRequest:",error);
     }
  }

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
      alignItems:"center",
      padding:5  
  }
  const filterUp = {
      // backgroundColor:"red",
      width:"100%",
      // marginBottom:"20px",
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap"
    }

    const filterItem = {
        // height: "50%",
        // backgroundColor:"yellow",
        // minWidth: "27ch",
        display: "flex",
        justifyContent:"flex-end",
        // flexWrap: "wrap",
        margin:3
    }

  const filterDown = {
      // height: 100,
      // backgroundColor:"blue",
      // display: "flex",
      width:"100%",
      // justifyContent:"space-between",
      // height: "50%",
      // flexWrap: "wrap"
  }
  

  const formStyle= {
    width:"17ch",
    minWidth: "17ch",
    // backgroundColor:"pink",
    margin:3
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
                  <InputLabel id="demo-simple-select-label">GARANTIE</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter.garantie}
                    label=" GARANTIE "
                    onChange={handleChange}
                    name="garantie"
                  >
                    <MenuItem value={TOUS} >TOUS</MenuItem>
                  {
                      garantieData.map(({id,garantie})=>{
                          return <MenuItem value={id} key={id}>{garantie}</MenuItem>
                      })
                  }
                  </Select>
                </FormControl>
              </Box>
            </div>
            <div style={{}}>
              <Box style={{width:"100%"}}>
                <FormControl style={formStyle} >
                  <InputLabel id="demo-simple-select-label">DISPOSITION</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={filter.disposition}
                    label=" DISPOSITION "
                    onChange={handleChange}
                    name="disposition"
                  >
                    <MenuItem value={TOUS} >TOUS</MenuItem>
                  {
                      dispositionData.map(({id,disposition})=>{
                          return <MenuItem value={id} key={id}>{disposition}</MenuItem>
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
            <div>
              {/* <ExportPdf function={handlePdf}/> */}
              <ExportExcel function={handleExcel}/>
            </div>
          </div>  
        </div>
      </div>
    );
  }

export default ContratFilter;
