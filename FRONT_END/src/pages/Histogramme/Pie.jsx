import React, { useEffect, useState } from "react";
import axios from 'axios'
import { Pie as PieChart,HeaderLabel,DatePicker } from '../../components';
import { Box,FormControl } from '@mui/material';
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

var moment = require("moment");
moment.locale("fr");

const Pie = () => {

  const defaultPieData = ()=>([
    { x: 'Disponible', y: 0, text: '0%' },
    { x: 'Non Disponible', y: 0, text: '0%' }
  ])

  // const [contratCount,setContratCount]= useState(null)
  const [pieData,setPieData]= useState(defaultPieData())

  useEffect(()=>{
    getPieData()
  },[])

  const getPieData = async ()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/car/findAll`)
      console.log('all data +++++++++++',data.data[0].isDisponible);
      console.log('all data typeof +++++++++++',typeof data.data[0].isDisponible);
      if (data.status==="success") {
        let data_ = data.data
        let sumDisponible=0
        let sumNonDisponible=0
        for(let i=0; i<data_.length;i++){
            if(data_[i].isDisponible){
              sumDisponible = sumDisponible + 1
            }else{
              sumNonDisponible = sumNonDisponible + 1
            }
        }
        let dataPie_ = {
          disponible : sumDisponible,
          nonDisponible : sumNonDisponible
        }
        setPieData(dataPie_)
        handlePieData(dataPie_)
        return dataPie_
      }
    } catch (error) {
      console.log("error while getVehiculeRequest:", error);
    }
  }

  const handlePieData = (pieData)=>{
    if(pieData){
      
      let percentageDisponible = ((pieData?.disponible * 100) || 0 )/(pieData?.disponible+pieData?.nonDisponible || 1)
      let percentageNonDisponible = ((pieData?.nonDisponible * 100) || 0)/(pieData?.disponible+pieData?.nonDisponible || 1)
      percentageDisponible = Math.round(percentageDisponible).toFixed(2)
      percentageNonDisponible = Math.round(percentageNonDisponible).toFixed(2)

      let newValue = [
        { x: 'Disponible', y: pieData?.disponible || 0, text: `${percentageDisponible || 0}%` },
        { x: 'Non Disponible', y: pieData?.nonDisponible || 0, text: `${percentageNonDisponible || 0}%` }
      ]
      setPieData(newValue)
    }
  }

  return (
    <div className="mt-24 mr-5 ml-5 " style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="rounded-2xl w-full p-5 m-5 mr-5 bg-[#f2f2f2]">
        <div className="p-5 " style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}> 
          <div className="bg-white p-8 w-full rounded-2xl">
            <div className='w-full'>
              <HeaderLabel title="STATISTIQUE SUR LES VEHICULES"/>
            </div>
            <div className="flex flex-wrap lg:flex-wrap md:flex-wrap sm:flex-wrap justify-center ">
            </div>  
          </div>
          <div className="flex flex-wrap lg:flex-wrap md:flex-wrap sm:flex-wrap justify-evenly w-full m-1 rounded-2xl p-5 bg-[#f2f2f2]">
            <div className="m-1 md:m-1 mt-1 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
              <div className="w-400">
                <PieChart id="chart-pie" data={pieData} legendVisiblity height="500px" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};



export default Pie;
