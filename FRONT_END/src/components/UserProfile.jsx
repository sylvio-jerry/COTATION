import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { AlertConfirm, Button , AlertToast} from '.';
import { useStateContext } from '../contexts/ContextProvider';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
const UserProfile = () => {
  const { currentColor,setCurrentUser,currentUser } = useStateContext();
  const navigate= useNavigate()

  const logout =()=>{
    AlertConfirm("question","QUESTION","Etes-vous sûr de vouloir se déconnecter ?").then(async (res)=>{
      if(res.isConfirmed){
        AlertToast("info","Vous êtes déconnecté !")
        setCurrentUser(null)
        localStorage.removeItem('userConnected');
        navigate('/');
      }
    })


  }
  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <PersonPinIcon fontSize='large' sx={{color: '#03C9D7'}}/>
        <div>
          <p className="font-semibold text-xl dark:text-gray-200"> {currentUser?.pseudo} </p>
          <p className="text-gray-500 text-sm dark:text-gray-400">  {currentUser?.email}   </p>
        </div>
      </div>
      <div>
       <div className="flex gap-5 border-b-1 border-color p-4 hover:bg-light-gray cursor-pointer  dark:hover:bg-[#42464D]">
          <button
            type="button"
            style={{ color: '#03C9D7', backgroundColor: '#E5FAFB'}}
            className=" text-xl rounded-lg p-3 hover:bg-light-gray"
          >
            <PermContactCalendarIcon />
          </button>

          <div>
            <p className="font-semibold dark:text-gray-200 ">Nom</p>
            <p className="text-gray-500 text-sm dark:text-gray-400"> {currentUser?.nom} </p>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <Button
          func={logout}
          color="white"
          bgColor={currentColor}
          text="Déconnecter"
          borderRadius="10px"
          width="full"
        />
      </div>
    </div>

  );
};

export default UserProfile;
