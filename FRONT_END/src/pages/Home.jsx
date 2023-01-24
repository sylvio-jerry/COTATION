import React, { useEffect, useState } from "react";

import {  ButtonComponent, Badge, HeaderLabel } from "../components";

import {ReactComponent  as Info}  from '../assets/images/info.svg'
// import note from "../data/note.jpg";
import Lottie from 'react-lottie';
import * as information_smmc from '../assets/lottie/information_smmc.json'

// import { provinceData, clientData, iconData } from "../data/HomeData";
import { provinceData, clientData,contratExpiredIn45DaysData ,contratCountForThisYear} from "../data/HomeData";
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ControlCameraOutlinedIcon from '@mui/icons-material/ControlCameraOutlined';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import ModalContratMaintenanceExpiredIn45Days from "./ModalHome/ModalContratMaintenanceExpiredIn45Days";
import ModalContratMaintenanceGabExpiredIn45Days from "./ModalHome/ModalContratMaintenanceGabExpiredIn45Days";
import ModalContratGarantieExpiredIn45Days from "./ModalHome/ModalContratGarantieExpiredIn45Days";
import ModalContratGarantieGabExpiredIn45Days from "./ModalHome/ModalContratGarantieGabExpiredIn45Days";
import NoteRappel from "./ModalHome/NoteRappel";
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { useStateContext } from "../contexts/ContextProvider";
import Link from '@mui/material/Link';

var moment = require("moment");
moment.locale("fr");

const Home = () => {
  const { noteRappel } = useStateContext();
  const [province, setProvince] = useState([]);
  const [client, setCient] = useState([]);
  const [contratExpiredIn45Days, setContratExpiredIn45Days] = useState({});
  const [contratCount, setContratCount] = useState({});
  const [showModalContratMaintenance, setShowModalContratMaintenance] = useState(false);
  const [showModalContratGarantie, setShowModalContratGarantie] = useState(false);
  const [showModalContratMaintenanceGab, setShowModalContratMaintenanceGab] = useState(false);
  const [showModalContratGarantieGab, setShowModalContratGarantieGab] = useState(false);
  const [showModalNoteRappel, setShowModalNoteRappel] = useState(false);

  //lottie file
  const NoteComponent = ()=>{
    const defaultOptions = {
      loop: true,
      autoplay: true, 
      animationData: information_smmc,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return <div>
                <Lottie options={defaultOptions}
                height={150}
                width={400}/>
            </div>
  }

  useEffect(() => {
    async function fetchProvince(){
      await getProvince();
    }
    async function fetchClient(){
      await getClient();
    }
    async function fetchContratExpiredIn45Days(){
      await getContratExpiredIn45Days();
    }
    async function fetchContratCount(){
      await getContratCount();
    }

    fetchProvince()
    fetchClient()
    fetchContratExpiredIn45Days()
    fetchContratCount()
  }, []);

  const getProvince = async () => {
    let province_ = await provinceData();
    setProvince(province_);
  };
  const getClient = async () => {
    let client_ = await clientData();
    setCient(client_);
  };

  const getContratCount = async () => {
    let contratCount_ = await contratCountForThisYear();
    setContratCount(contratCount_);
  };

  const getContratExpiredIn45Days = async () => {
    let contratExpiredIn45Days_ = await contratExpiredIn45DaysData();
    setContratExpiredIn45Days(contratExpiredIn45Days_);
  };

  const showMaintenance = ()=>{
    setShowModalContratMaintenance(!showModalContratMaintenance)
  }

  const showMaintenanceGab = ()=>{
    setShowModalContratMaintenanceGab(!showModalContratMaintenanceGab)
  }

  const showGarantieGab = ()=>{
    setShowModalContratGarantieGab(!showModalContratGarantieGab)
  }

  const showGarantie = ()=>{
    setShowModalContratGarantie(!showModalContratGarantie)
  }
  
  const showNoteRappel = ()=>{
    setShowModalNoteRappel(!showModalNoteRappel)
  }

  return (
    <div className="mt-24 mr-5 ml-5" style={{display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
       {showModalContratMaintenance && <ModalContratMaintenanceExpiredIn45Days openModal={showModalContratMaintenance} closeModal={setShowModalContratMaintenance} data={contratExpiredIn45Days?.maintenance} />}
       {showModalContratMaintenanceGab && <ModalContratMaintenanceGabExpiredIn45Days openModal={showModalContratMaintenanceGab} closeModal={setShowModalContratMaintenanceGab} data={contratExpiredIn45Days?.maintenance_gab} />}
       {showModalContratGarantieGab && <ModalContratGarantieGabExpiredIn45Days openModal={showModalContratGarantieGab} closeModal={setShowModalContratGarantieGab} data={contratExpiredIn45Days?.garantie_gab} />}
       {showModalContratGarantie && <ModalContratGarantieExpiredIn45Days openModal={showModalContratGarantie} closeModal={setShowModalContratGarantie} data={contratExpiredIn45Days?.garantie} />}
       {showModalNoteRappel && <NoteRappel openModal={showModalNoteRappel} closeModal={setShowModalNoteRappel}/>}
      {/* {JSON.stringify(contratExpiredIn45Days)} */}
     
      <div className="mt-5 flex flex-wrap lg:flex-wrap md:flex-wrap sm:flex-wrap justify-center w-5/6 m-5 rounded-2xl p-8 bg-[#f2f2f2]">
        <div className="w-600 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-start">
            <div>
              <HeaderLabel title="Pour votre information" />
            </div>
          </div>
          <div className="">
            {/* <img className="md:w-96 h-50 " src={note} alt="" /> */}
            <div className='w-full'>
              <NoteComponent/>
            </div>
            <div className="mt-8">
              <p className="font-semibold text-lg"> </p>
              <p className="mt-4 text-md text-black-500">
                {/* {noteRappel.toString().trim() !== '' ? noteRappel : 'Pas de note enregistrer' } */}
                Nous sommes ici pour vous offrir une gamme des prestations de qualité au coût raisonnable au terme de manutention portuaire. Consultez notre site web officiel pour plus d'infos !
              </p>
              <div className="mt-6">
                <Link href="https://smmc-company.com/">
                  <ButtonComponent color='vertBlue' textColor="white" name_of_btn="SITE OFFICIEL" icon={<AutoFixHighIcon />} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
