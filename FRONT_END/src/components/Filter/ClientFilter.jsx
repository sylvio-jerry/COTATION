import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { Box,InputLabel,MenuItem,Select,FormControl,TextField } from '@mui/material';
import { ExportPdf, ExportExcel} from '../../components'
import Menu from '@mui/material/Menu';
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
const ClientFilter = ({exportPdf,exportExcel,filterOption}) => {

  useEffect(()=>{
    getProvince()
    getVille()
  },[])

  const defaultFilter = ()=>({
    province:0,
    ville:0
  })

  const TOUS = 0
  const [provinceData,setProvinceData] = useState([])
  const [villeData,setVilleData] = useState([])
  const [villeDataFiltered,setVilleDataFiltered] = useState([])
  const [filter, setFilter]= useState(defaultFilter())

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

  const handleChange = (event) => {
    setFilter({...filter,[event.target.name]:event.target.value});
  };

  const handlePdf = ()=>{
    exportPdf()
  }

  const handleExcel = ()=>{
    exportExcel()
  }


  useEffect(()=>{
    filterOption(filter)
  },[filter])

  useEffect(()=>{
    setFilter({...filter,ville:0})
    if(filter.province===0){
      setVilleDataFiltered(villeData)
    }else{
      setVilleDataFiltered(villeData.filter(ville=>ville.province_id===filter.province))
    }
  },[filter.province])

  const css = {
      height: 150,
      borderRadius:3,
      backgroundColor:"#f2f2f2",
      borderTop: "2px double #afa2a2",
      borderBottom: "2px inset #afa2a2",
  }

  const mainFilter = {
    // backgroundColor:"red",
    width: "100%",
    // height:150,
    padding:0,
    borderRadius:3,
    backgroundColor:"#f2f2f2",
    borderTop: "2px double #afa2a2",
    borderBottom: "2px inset #afa2a2",

  }

  const filterUp = {
    // backgroundColor:"green",
    width: "100%",
    display: "flex",
    // justifyContent:"space-between",
    flexWrap: "wrap",
    margin:5
  }
  const filterItemUp = {
    // backgroundColor:"yellow",
    width: "20%",
    minWidth: "27ch",
    margin:5,
  }
  const formStyle= {
    width:"27ch",
    minWidth: "27ch",
    // backgroundColor:"pink",
    margin:5,
    maxHeight:'35ch'
  }   
  const filterDown = {
    width: "100%",
    // backgroundColor:"red",
   display:'flex',
   justifyContent: 'end'
  }

    return (
        <div style={mainFilter}>
        <div style={filterUp}>
          <div style={filterItemUp}>
            <Box style={{width:"100%"}}>
              <FormControl style={formStyle}>
                <InputLabel id="demo-simple-select-label">PROVINCE</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={filter.province}
                  label=" PROVINCE "
                  onChange={handleChange}
                  name="province"
                >
                  <MenuItem value={TOUS}>TOUS</MenuItem>
                {
                    provinceData.map(({id,nom_province})=>{
                        return <MenuItem value={id} key={id}>{nom_province}</MenuItem>
                    })
                }   
                </Select>
              </FormControl>
            </Box>
          </div>
          <div style={filterItemUp}>
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
        <div style={filterDown}>
          {/* <ExportPdf function={handlePdf}/> */}
          <ExportExcel function={handleExcel}/>
        </div>
          

      </div>
    );
}

export default ClientFilter;
