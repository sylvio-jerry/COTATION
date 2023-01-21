import React, { useEffect } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
// import { RiNotification3Line } from 'react-icons/ri';
import { MdKeyboardArrowDown } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import Tooltip from '@mui/material/Tooltip';
import PersonPinIcon from '@mui/icons-material/PersonPin';
// import { Badge, UserProfile } from '.';
import { UserProfile } from '.';
import { useStateContext } from '../contexts/ContextProvider';

const NavButton = ({ title, customFunc, icon, color, dotColor,children }) => (
  <Tooltip  title={title} position="BottomCenter">
    <button
      type="button"
      onClick={() => customFunc()}
      style={{ color }}
      className="relative text-xl rounded-full p-1 mr-5"
    >
      <span
        style={{ background: dotColor }}
        className="absolute inline-flex rounded-full h-2 w-2 right-1 top-1"
      >
      </span>
      {children}
      {icon}
    </button>
  </Tooltip >
);

const Navbar = () => {
  const { activeMenu, setActiveMenu, handleClick, isClicked, setScreenSize, screenSize ,currentUser} = useStateContext();

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener('resize', handleResize);

    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize]);

  const customMargin = ()=>{
    if(activeMenu){
     return  {marginRight:310}
    }else{
      return  {marginRight:22}
    }
  }
  
  const handleActiveMenu = () => setActiveMenu(!activeMenu)

  return (
    <div className="flex justify-between p-2 md:ml-10 md:mr-10 relative " style={customMargin()}>

      <NavButton title="Menu" customFunc={handleActiveMenu} color={'white'} icon={<MenuIcon />} />
      <div className="flex">
        {/* <NavButton title="Notification" dotColor="white" customFunc={() => handleClick('notification')} color={'white'} icon={<RiNotification3Line />} /> */}
        {/* <NavButton title="Notification" customFunc={() => handleClick('notification')}>
          <div className='mr-5 mt-2'>
            <Badge badgeContent={5} color="error" icon={<RiNotification3Line color='white' style={{width:25, height:25}}/>}/>
          </div>
        </NavButton> */}
          
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 bg-light-gray rounded-lg"
            onClick={() => handleClick('userProfile')}
          >
            <PersonPinIcon fontSize='medium' />
            <p>
              <span className="text-black text-14">| {currentUser.is_admin ? "Admin" : "Super Admin"} |</span>{' '}
              <span className="text-black font-bold ml-1 text-14">
              {currentUser?.pseudo}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>
        {isClicked.userProfile && (<UserProfile />)}
      </div>
    </div>
  );
};

export default Navbar;
