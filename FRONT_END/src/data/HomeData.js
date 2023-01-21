import axios from 'axios'
import Diversity3Icon from '@mui/icons-material/Diversity3';
import FmdGoodIcon from '@mui/icons-material/FmdGood';

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

//getProvince
const getProvince = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/province`)
      if(data){
          return data.data
      }
     } catch (error) {
        console.log("error while province, homeData:",error);
        return []
     }
  }
const getClient = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/client`)
      if(data){
          return data.data
      }
     } catch (error) {
        console.log("error while client, homeData:",error);
        return []
     }
  }

const getContratExpiredIn45Days = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/check_contrat/contrat_expired_in_45_days`)
      if(data){
          return data.data
      }
     } catch (error) {
        console.log("error while contrat_expired_in_45_days, homeData:",error);
        return []
     }
  }

const getContratCountForThisYear = async()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/check_contrat/contrat_for_this_year`)
      if(data){
          return data.data
      }
     } catch (error) {
        console.log("error while contrat_for_this_year, homeData:",error);
        return []
     }
  }

export const  provinceData = async ()=>{
    return await getProvince()
};
export const  clientData = async ()=>{
    return await getClient()
};
export const  contratCountForThisYear = async ()=>{
    return await getContratCountForThisYear()
};

export const  contratExpiredIn45DaysData = async ()=>{
    let contratExpiredIn45Days = await getContratExpiredIn45Days()
    return contratExpiredIn45Days
};
export const  iconData = { 
    province: <FmdGoodIcon color='error'/>,
    ville: <FmdGoodIcon />,
    client : <Diversity3Icon />
};