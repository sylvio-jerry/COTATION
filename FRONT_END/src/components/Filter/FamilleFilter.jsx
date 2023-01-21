import React, {useEffect, useState} from 'react';
import axios from 'axios'
import { Box,InputLabel,MenuItem,Select,FormControl } from '@mui/material';
// import { ExportPdf, ExportExcel} from '../../components'
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const FamilleFilter = ({filterOption}) => {

  useEffect(()=>{
    getService()
  },[])

  const TOUS = 0
  const [serviceData,setServiceData] = useState([])
  const [service, setService]= useState(TOUS)

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

  const handleChange = (event) => {
    setService(event.target.value);
  };


  useEffect(()=>{
    filterOption(service)
  },[service])


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
    height:150,
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
    margin:5
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
                <InputLabel id="demo-simple-select-label">SERVICE</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={service}
                  label=" SERVICE "
                  onChange={handleChange}
                  name="service"
                >
                  <MenuItem value={TOUS}>TOUS</MenuItem>
                {
                    serviceData.map(({id,nom_service})=>{
                        return <MenuItem value={id} key={id}>{nom_service}</MenuItem>
                    })
                }   
                </Select>
              </FormControl>
            </Box>
          </div>
        </div>
        {/* <div style={filterDown}>
            <ExportPdf function={handlePdf}/>
            <ExportExcel function={handleExcel}/>
        </div> */}
      </div>
    );
}

export default FamilleFilter;
