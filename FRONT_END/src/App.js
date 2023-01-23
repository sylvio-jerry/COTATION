import React, {useEffect} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { TooltipComponent } from '@syncfusion/ej2-react-popups';

import { Navbar, Sidebar } from './components';
import { 
  Cotation,
  ListEquipement,AddEquipement,EditEquipement,DetailEquipement,
  ListMaintenance,
  AddMaintenance,
  EditMaintenance,
  DetailMaintenance,
  RenewMaintenance,
  ListMaintenanceGab,
  AddMaintenanceGab,
  EditMaintenanceGab,
  DetailMaintenanceGab,
  RenewMaintenanceGab,
  ListGarantie,
  AddGarantie,
  EditGarantie,
  DetailGarantie,
  ListGarantieGab,
  AddGarantieGab,
  EditGarantieGab,
  DetailGarantieGab,
  ListVehicule,
  DetailVehicule,
  AddVehicule,
  EditVehicule,
  ListUtilisateur,
  Login,
  Home,Histogramme } from './pages';
import './App.css';
import { useStateContext } from './contexts/ContextProvider';

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu,currentUser} = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);
  
  if(!currentUser){
    return <Login />
  }
  
  return (
    <div className={currentMode === 'Dark' ? 'dark' : ''}>
      <BrowserRouter>
        <div className="flex relative dark:bg-main-dark-bg">
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white ">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}
          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen md:ml-72 w-full  '
                : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
            }
          >
            <div className='fixed  bg-[#03C9D7] dark:bg-main-dark-bg navbar w-full'>
              <Navbar />
            </div>
            <div>
              <Routes>
                {/* dashboard  */}
                <Route path="/" element={currentUser ? (<Home />) : (<Login />)} />
                 {/* ACCUEIL */}
                <Route path="/accueil" element={(<Home />)} />

                {/* VEHICULE */}
                <Route path="/vehicule" element={<ListVehicule />} />
                <Route path="/vehicule/edit/:id" element={<EditVehicule />} />
                <Route path="/vehicule/detail/:id" element={<DetailVehicule />} />
                <Route path="/vehicule/ajout" element={<AddVehicule />} />

                {/* CONTRAT DE MAINTENANCE */}
                <Route path="/tarif_de_manutention" element={<Cotation />} />

                {/* CONTRAT DE GARANTIE */}
                <Route path="/contrat_de_garantie" element={<ListGarantie />} />
                <Route path="/contrat_de_garantie/edit/:id" element={<EditGarantie />} />
                <Route path="/contrat_de_garantie/detail/:id" element={<DetailGarantie />} />
                <Route path="/contrat_de_garantie/ajout" element={<AddGarantie />} />

                {/* EQUIPEMENT*/}
                <Route path="/equipement" element={<ListEquipement />} />
                <Route path="/equipement/edit/:id" element={<EditEquipement />} />
                <Route path="/equipement/detail/:id" element={<DetailEquipement />} />
                <Route path="/equipement/ajout" element={<AddEquipement />} />
                

                {/* UTILISATEUR*/}
                <Route path="/utilisateur" element={<ListUtilisateur />} />

                {/* Histogramme  */}
                <Route path="/histogramme" element={<Histogramme />} />

                {/* AUTHENTIFICATION  */}
                <Route path="/login" element={<Login />} />

                {/* GARANTIE GAB  */}
                <Route path="/contrat_de_garantie_gab" element={<ListGarantieGab />} />
                <Route path="/contrat_de_garantie_gab/edit/:id" element={<EditGarantieGab />} />
                <Route path="/contrat_de_garantie_gab/detail/:id" element={<DetailGarantieGab />} />
                <Route path="/contrat_de_garantie_gab/ajout" element={<AddGarantieGab/>} />

                {/* GARANTIE GAB  */}
                <Route path="/contrat_de_maintenance_gab" element={<ListMaintenanceGab />} />
                <Route path="/contrat_de_maintenance_gab/edit/:id" element={<EditMaintenanceGab />} />
                <Route path="/contrat_de_maintenance_gab/detail/:id" element={<DetailMaintenanceGab />} />
                <Route path="/contrat_de_maintenance_gab/renew/:id" element={<RenewMaintenanceGab />} />
                <Route path="/contrat_de_maintenance_gab/ajout" element={<AddMaintenanceGab/>} />
              </Routes>  
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
