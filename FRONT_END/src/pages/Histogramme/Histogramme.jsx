import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Pie as PieChart,HeaderLabel,DatePicker } from '../../components';
import { Box,FormControl } from '@mui/material';
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

var moment = require("moment");
moment.locale("fr");

const formStyle= {
  width:"27ch",
  minWidth: "27ch",
  // backgroundColor:"pink",
  margin:5
}   

const Histogramme = () => {

  const defaultFilter = ()=>({
    date_debut_contrat:moment().startOf('year'),
    date_fin_contrat:moment().endOf('year')
  })

  const defaultPieData = ()=>([
    { x: 'Valide', y: 0, text: '0%' },
    { x: 'Expiré', y: 0, text: '0%' }
  ])

  const [filter, setFilter]= useState(defaultFilter())
  const [contratCount,setContratCount]= useState(null)
  const [maintenancePieData,setMaintenancePieData]= useState(defaultPieData())
  const [maintenanceGabPieData,setMaintenanceGabPieData]= useState(defaultPieData())
  const [garantiePieData,setGarantiePieData]= useState(defaultPieData())
  const [garantieGabPieData,setGarantieGabPieData]= useState(defaultPieData())

  useEffect(()=>{
    getContratBetween2Dates()
  },[])

  useEffect(()=>{
    getContratBetween2Dates()
  },[filter])

  
  const refreshDataPie = ()=>{
    handleMaintenancePie()
    handleGarantiePie()
    handleMaintenanceGabPie()
    handleGarantieGabPie()
  }

  const handleMaintenancePie = ()=>{
    if(contratCount){
      
      let percentageValide = ((contratCount?.maintenance.valide * 100) || 0 )/(contratCount?.maintenance.valide+contratCount?.maintenance.expire || 1)
      let percentageExpire = ((contratCount?.maintenance.expire * 100) || 0)/(contratCount?.maintenance.valide+contratCount?.maintenance.expire || 1)

      percentageValide = Math.round(percentageValide).toFixed(2)
      percentageExpire = Math.round(percentageExpire).toFixed(2)

      let newValue = [
        { x: 'Valide', y: contratCount.maintenance.valide || 0, text: `${percentageValide || 0}%` },
        { x: 'Expiré', y: contratCount.maintenance.expire || 0, text: `${percentageExpire || 0}%` }
      ]
      setMaintenancePieData(newValue)
    }
  }

  const handleMaintenanceGabPie = ()=>{
    if(contratCount){
    
      let percentageValide = ((contratCount?.maintenance_gab.valide * 100) || 0 )/(contratCount?.maintenance_gab.valide+contratCount?.maintenance_gab.expire || 1)
      let percentageExpire = ((contratCount?.maintenance_gab.expire * 100) || 0)/(contratCount?.maintenance_gab.valide+contratCount?.maintenance_gab.expire || 1)

      percentageValide = Math.round(percentageValide).toFixed(2)
      percentageExpire = Math.round(percentageExpire).toFixed(2)

      let newValue = [
        { x: 'Valide', y: contratCount.maintenance_gab.valide || 0, text: `${percentageValide || 0}%` },
        { x: 'Expiré', y: contratCount.maintenance_gab.expire || 0, text: `${percentageExpire || 0}%` }
      ]
      setMaintenanceGabPieData(newValue)
    }
  }
  const handleGarantieGabPie = ()=>{
    if(contratCount){
      
      let percentageValide = ((contratCount?.garantie_gab.valide * 100) || 0 )/(contratCount?.garantie_gab.valide+contratCount?.garantie_gab.expire || 1)
      let percentageExpire = ((contratCount?.garantie_gab.expire * 100) || 0)/(contratCount?.garantie_gab.valide+contratCount?.garantie_gab.expire || 1)

      percentageValide = Math.round(percentageValide).toFixed(2)
      percentageExpire = Math.round(percentageExpire).toFixed(2)

      let newValue = [
        { x: 'Valide', y: contratCount.garantie_gab.valide || 0, text: `${percentageValide || 0}%` },
        { x: 'Expiré', y: contratCount.garantie_gab.expire || 0, text: `${percentageExpire || 0}%` }
      ]
      setGarantieGabPieData(newValue)
    }
  }
  const handleGarantiePie = ()=>{
    if(contratCount){
      
      let percentageValide = ((contratCount?.garantie.valide * 100) || 0 )/(contratCount?.garantie.valide+contratCount?.garantie.expire || 1)
      let percentageExpire = ((contratCount?.garantie.expire * 100) || 0)/(contratCount?.garantie.valide+contratCount?.garantie.expire || 1)

      percentageValide = Math.round(percentageValide).toFixed(2)
      percentageExpire = Math.round(percentageExpire).toFixed(2)

      let newValue = [
        { x: 'Valide', y: contratCount.garantie.valide || 0, text: `${percentageValide || 0}%` },
        { x: 'Expiré', y: contratCount.garantie.expire || 0, text: `${percentageExpire || 0}%` }
      ]
      setGarantiePieData(newValue)
    }
  }

  useEffect(()=>{
    refreshDataPie()
  },[contratCount])

  //getContratBetween2Dates
const getContratBetween2Dates = async()=>{

  let date_to_search = {
    date_debut_contrat:  filter.date_debut_contrat ? moment(filter.date_debut_contrat,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
    date_fin_contrat:  filter.date_fin_contrat ? moment(filter.date_fin_contrat,'DD/MM/YYYY').format('YYYY-MM-DD') : null
  }

  try {
    const {data} = await axios.post(`${API_URL}/api/check_contrat/all_contrat_count_between_2_date`,date_to_search)
    if(data){
        let contrat_count_ = data.data     
        setContratCount(contrat_count_)
    }
   } catch (error) {
      console.log("error while check_contrat/all_contrat_count_between_2_date:",error);
      return null
   }
}

//maintenance
  const handleChangeDateDebut = (date) => {
    setFilter({...filter,date_debut_contrat:date});
  };
  const handleChangeDateFin = (date) => {
    setFilter({...filter,date_fin_contrat:date});
  };

  return (
    <div className="mt-24 mr-5 ml-5 " style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="rounded-2xl w-full p-5 m-5 mr-5 bg-[#f2f2f2]">
        <div className="p-5 " style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
          <div className="bg-white p-8 w-full rounded-2xl">
            <div className='w-full'>
              <HeaderLabel title="HISTOGRAMME DES CONTRATS ENTRE DEUX DATE"/>
            </div>
            <div className="flex flex-wrap lg:flex-wrap md:flex-wrap sm:flex-wrap justify-center ">
              <div style={{}}>
                <Box style={formStyle}>
                  <FormControl style={formStyle}>
                      <DatePicker label="DATE DEBUT CONTRAT" defaultValue={filter.date_debut_contrat} getDate={handleChangeDateDebut}/>
                  </FormControl>
                </Box>
              </div>
              <div style={{}}>
                <Box style={formStyle}>
                  <FormControl style={formStyle}>
                      <DatePicker label="DATE FIN CONTRAT" defaultValue={filter.date_fin_contrat} getDate={handleChangeDateFin}/>
                  </FormControl>
                </Box>
              </div>
            </div>  
          </div>
          <div className="flex flex-wrap lg:flex-wrap md:flex-wrap sm:flex-wrap justify-evenly w-full m-1 rounded-2xl p-5 bg-[#f2f2f2]">
            <div className="m-1 md:m-1 mt-1 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
              <div>
                <HeaderLabel title="Maintenance GAB"/>
              </div>
              <div className="w-400">
                <PieChart id="chart-pie" data={maintenancePieData} legendVisiblity height="200px" />
              </div>
            </div>  
            <div className="m-1 md:m-1 mt-1 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
              <div>
                <HeaderLabel title="Maintenance Autres que GAB"/>
              </div>
              <div className="w-400">
                <PieChart id="chart-pie2" data={maintenanceGabPieData} legendVisiblity height="200px" />
              </div>
            </div>  
          </div>
          <div className="flex flex-wrap lg:flex-wrap md:flex-wrap sm:flex-wrap justify-evenly w-full m-1 rounded-2xl p-5 bg-[#f2f2f2]">
            <div className="m-1 md:m-1 mt-1 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
              <div>
                <HeaderLabel title="Garantie GAB"/>
              </div>
              <div className="w-400">
                <PieChart id="chart-pie3" data={garantieGabPieData} legendVisiblity height="200px" />
              </div>
            </div>  
            <div className="m-1 md:m-1 mt-1 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
              <div>
                <HeaderLabel title="Garantie Autres que GAB"/>
              </div>
              <div className="w-400">
                <PieChart id="chart-pie4" data={garantiePieData} legendVisiblity height="200px" />
              </div>
            </div>  
          </div>
        </div>
      </div>
    </div>
  )
};



export default Histogramme;
