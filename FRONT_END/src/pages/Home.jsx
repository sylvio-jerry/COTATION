import React, { useEffect, useState } from "react";

import {  ButtonComponent, Badge, HeaderLabel } from "../components";

import {ReactComponent  as Info}  from '../assets/images/info.svg'
// import note from "../data/note.jpg";
import Lottie from 'react-lottie';
import * as noteAnimation from '../assets/lottie/note.json'

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
      animationData: noteAnimation,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
      }
    };

    return <div>
                <Lottie options={defaultOptions}
                height={200}
                width={250}/>
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
      <div className="flex m-3 flex-wrap justify-center gap-8 items-center">
          <div
              className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl "
            >
              <button
                type="button"
                style={{ color: "rgb(228, 106, 118)", backgroundColor: "rgb(255, 244, 229)"  }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <ControlCameraOutlinedIcon/>
              </button>
              <p className="mt-3">Contrat de Maintenance GAB expirée dans 45 Jour</p>
              <div className="flex flex-nowrap mt-5">
                <div className="rounded-lg text-sm font-semibold bg-[#f2f2f2] p-1 ">
                  Nombre 
                </div>
                <div className="ml-2">
                  <Badge badgeContent={contratExpiredIn45Days?.maintenance_gab?.length ? contratExpiredIn45Days?.maintenance_gab?.length : 0}/>
                </div>
              </div>
              <div className="mt-6">
                <ButtonComponent color='vertBlue' textColor="white" function={showMaintenanceGab} name_of_btn="VOIR" icon={<VisibilityIcon />} />
              </div>
            </div>
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-8 items-center">
          <div
              className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl "
            >
              <button
                type="button"
                style={{ color: "rgb(0, 194, 146)", backgroundColor: "rgb(235, 250, 242)" }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <ViewInArIcon/>
              </button>
              <p className="mt-3">Contrat de Garantie GAB expirée dans 45 Jour</p>
              <div className="flex flex-nowrap mt-5">
                <div className="rounded-lg text-sm font-semibold bg-[#f2f2f2] p-1 ">
                  Nombre 
                </div>
                <div className="ml-2">
                  <Badge badgeContent={contratExpiredIn45Days?.garantie_gab?.length ? contratExpiredIn45Days?.garantie_gab?.length : 0}/>
                </div>
              </div>
              <div className="mt-6">
                <ButtonComponent color='vertBlue' textColor="white" function={showGarantieGab} name_of_btn="VOIR" icon={<VisibilityIcon />} />
              </div>
            </div>
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-8 items-center">
          <div
              className="bg-white  dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl "
            >
              <button
                type="button"
                style={{ color: "#03C9D7", backgroundColor: "#E5FAFB" }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <HandshakeOutlinedIcon/>
              </button>
              <p className=" mt-3">Contrat de Maintenance autres que GAB expirée dans 45 Jour</p>
              <div className="flex flex-nowrap mt-5">
                <div className="rounded-lg text-sm font-semibold bg-[#f2f2f2] p-1 ">
                  Nombre 
                </div>
                <div className="ml-2">
                  <Badge badgeContent={contratExpiredIn45Days?.maintenance?.length ? contratExpiredIn45Days?.maintenance?.length : 0}/>
                </div>
              </div>
              <div className="mt-6">
                <ButtonComponent color='vertBlue' textColor="white" function={showMaintenance} name_of_btn="VOIR" icon={<VisibilityIcon />} />
              </div>
          </div>
        </div>
        <div className="flex m-3 flex-wrap justify-center gap-8 items-center">
          <div
              className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg md:w-56  p-4 pt-9 rounded-2xl "
            >
              <button
                type="button"
                style={{ color: "rgb(255, 244, 229)", backgroundColor: "gray" }}
                className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
              >
                <DocumentScannerIcon/>
              </button>
              <p className="mt-3">Contrat de Garantie autres que GAB expirée dans 45 Jour</p>
              <div className="flex flex-nowrap mt-5">
                <div className="rounded-lg text-sm font-semibold bg-[#f2f2f2] p-1 ">
                  Nombre 
                </div>
                <div className="ml-2">
                  <Badge badgeContent={contratExpiredIn45Days?.garantie?.length ? contratExpiredIn45Days?.garantie?.length : 0}/>
                </div>
              </div>
              <div className="mt-6">
                <ButtonComponent color='vertBlue' textColor="white" function={showGarantie} name_of_btn="VOIR" icon={<VisibilityIcon />} />
              </div>
            </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap lg:flex-wrap md:flex-wrap sm:flex-wrap justify-center w-5/6 m-5 rounded-2xl p-8 bg-[#f2f2f2] ">
        <div className="bg-white dark:text-gray-200 dark:bg-secondary-dark-bg p-6 rounded-2xl">
          <div className="flex justify-start">
            <div>
              <HeaderLabel title={`Contrat pour l'année ${moment().year()}`} />
            </div>
            {/* <DropDown currentMode={currentMode} /> */}
          </div>
          <div className="w-72 md:w-400">
            <div className="flex justify-between mt-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  style={{
                    color: "#03C9D7", backgroundColor: "#E5FAFB"
                  }}
                  className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                >
                    <HandshakeOutlinedIcon/>
                </button>
                <div>
                  <p className="text-md font-semibold">Contrat de Maintenance</p>
                  <div className="flex flex-wrap mt-2">
                    <div className="flex mr-5 flex-nowrap">
                      <div className="rounded-lg text-sm font-semibold bg-[#f2f2f2] p-1 ">
                        GAB 
                      </div>
                      <div className="ml-2">
                        <Badge badgeContent={contratCount.maintenance_gab}/>
                      </div>
                    </div>
                    <div className="flex flex-nowrap">
                      <div className="rounded-lg text-sm font-semibold bg-[#f2f2f2] p-1 ">
                        AUTRES QUE GAB 
                      </div>
                      <div className="ml-2">
                        <Badge badgeContent={contratCount.maintenance}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                <Badge badgeContent={contratCount.maintenanceAndMaintenanceGab} icon={<Info style={{width:30, height:35}}/>}/>
            </div>
          </div>
          <div className="mt-10 w-72 md:w-400">
            <div className="flex justify-between mt-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  style={{
                    color: "rgb(255, 244, 229)", backgroundColor: "gray"
                  }}
                  className="text-2xl rounded-lg p-4 hover:drop-shadow-xl"
                >
                  <DocumentScannerIcon/> 
                </button>
                <div>
                  <p className="text-md font-semibold">Contrat de Garantie</p>
                  <div className="flex flex-wrap mt-2">
                    <div className="flex mr-5 flex-nowrap">
                      <div className="rounded-lg text-sm font-semibold bg-[#f2f2f2] p-1 ">
                        GAB 
                      </div>
                      <div className="ml-2">
                        <Badge badgeContent={contratCount.garantie_gab}/>
                      </div>
                    </div>
                    <div className="flex flex-nowrap">
                      <div className="rounded-lg text-sm font-semibold bg-[#f2f2f2] p-1 ">
                        AUTRES QUE GAB 
                      </div>
                      <div className="ml-2">
                        <Badge badgeContent={contratCount.garantie}/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                <Badge badgeContent={contratCount.garantieAndGarantieGab} icon={<Info style={{width:30, height:35}}/>}/>
            </div>
          </div>
          <div className="flex justify-between items-center mt-5 mb-5 border-t-1 border-color">
            <p className="text-gray-400 text-sm mt-8">Blanche Birger Madagascar</p>
          </div>
        </div>
        <div className="w-auto bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3 pb-15">
          <div className="flex justify-start ">
            <div>
              <HeaderLabel title="Repartition des clients"/>
            </div>
          </div>
          <div className="flex flex-nowrap">
            <div className="rounded-lg text-sm font-semibold bg-[#f2f2f2] p-1 ">
            Tous les Clients 
            </div>
            <div className="ml-2">
              <Badge badgeContent={client.length}/>
            </div>
          </div>
          <div className="flex gap-4 border-b-1 border-color mt-6 flex-wrap">
            {province.map((p) => (
              <div
                key={p.id}
                className="border-r-1 border-color pr-4 pb-2"
              >
                <p className=" text-gray-700 mb-3">{p.nom_province}</p>
                <div className="flex flex-nowrap">
                  <div className="rounded-lg text-sm font-semibold bg-[#f2f2f2] p-1 ">
                    Nb Ville 
                  </div>
                  <div className="ml-2">
                    <Badge badgeContent={p?.ville?.length}/>
                  </div>
                </div>
                {/* <p className="text-sm">Nb Ville : {p?.ville?.length}</p> */}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap lg:flex-wrap md:flex-wrap sm:flex-wrap justify-center w-5/6 m-5 rounded-2xl p-8 bg-[#f2f2f2]">
        <div className="w-400 bg-white dark:text-gray-200 dark:bg-secondary-dark-bg rounded-2xl p-6 m-3">
          <div className="flex justify-start">
            <div>
              <HeaderLabel title="Note de Rappel" />
            </div>
          </div>
          <div className="">
            {/* <img className="md:w-96 h-50 " src={note} alt="" /> */}
            <NoteComponent/>
            <div className="mt-8">
              <p className="font-semibold text-lg">Suivi à effectuer </p>
              <p className="mt-4 text-sm text-gray-400">
                {noteRappel.toString().trim() !== '' ? noteRappel : 'Pas de note enregistrer' }
              </p>
              <div className="mt-6">
                <ButtonComponent color='vertBlue' textColor="white" function={showNoteRappel} name_of_btn="Prendre Note" icon={<AutoFixHighIcon />} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
