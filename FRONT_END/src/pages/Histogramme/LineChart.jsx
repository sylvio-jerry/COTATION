import React, { useEffect, useState } from "react";
import axios from 'axios'
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, LineChart,Line,Tooltip } from 'recharts';
import { Pie as PieChart,HeaderLabel } from '../../components';
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

var moment = require("moment");
moment.locale("fr");

const LineChartComponent = () => {
  const defaultChartData = ()=>([
    { x: 'Disponible', y: 0, text: '0%' },
    { x: 'Non Disponible', y: 0, text: '0%' }
  ])

  const [chartData,setChartData]= useState(defaultChartData())

  useEffect(()=>{
    getChartData()
  },[])

  const getChartData = async ()=>{
    try {
      const {data} = await axios.get(`${API_URL}/api/car/findAll`)
      console.log('all data doone +++++++++++',data.data);
      // console.log('all data typeof +++++++++++',typeof data.data[0].isDisponible);
      if (data.status==="success") {
        let data_ = data.data
        let sumNeuve=0
        let sumOccasion=0
        let sumCamion=0
        let sumEngin=0
        let sumRemorque=0
        for(let i=0; i<data_.length;i++){
            if(data_[i].EtatVehicule.toLowerCase()==='neuve'){
              sumNeuve = sumNeuve + 1
            }else if(data_[i].EtatVehicule.toLowerCase()==='occasion'){
              sumOccasion = sumOccasion + 1
            }else if(data_[i].EtatVehicule.toLowerCase()==='camion'){
              sumCamion = sumCamion + 1
            }else if(data_[i].EtatVehicule.toLowerCase()==='engin'){
              sumEngin = sumEngin + 1
            }else if(data_[i].EtatVehicule.toLowerCase()==='remorque'){
              sumRemorque = sumRemorque + 1
            }
        }

        let dataChart = [
         { etatVehicule: 'NEUVE', value:sumNeuve},
         { etatVehicule: 'OCCASION', value:sumOccasion},
          {etatVehicule: 'CAMION', value:sumCamion},
          {etatVehicule: 'ENGIN', value:sumEngin},
          {etatVehicule: 'REMORQUE', value:sumRemorque}
        ]

        console.log('dataChart +++doone',dataChart);

        setChartData(dataChart)
        return dataChart
      }
    } catch (error) {
      console.log("error while getVehiculeRequest:", error);
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
          <div className="flex flex-wrap lg:flex-wrap md:flex-wrap sm:flex-wrap justify-evenly w-4/6 m-1 rounded-2xl p-5 bg-[#f2f2f2]">
            <div className="m-1 md:m-1 mt-1 p-10 bg-white dark:bg-secondary-dark-bg rounded-3xl">
              <div className="w-full">
                <LineChart width={600} height={600} data={chartData}>
                  <CartesianGrid stroke="green" strokeDasharray="5 5" />
                  <XAxis dataKey="etatVehicule" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#f1c139" strokeWidth={2}/>
                </LineChart>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default LineChartComponent;
