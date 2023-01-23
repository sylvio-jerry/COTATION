import React, {useEffect, useState} from 'react';
import { Box,InputLabel,MenuItem,Select,FormControl,TextField } from '@mui/material';
import { AlertToast, ButtonComponent, ExportPdf } from '.'
import Menu from '@mui/material/Menu';
import VisibilityIcon from '@mui/icons-material/Visibility';

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const CotationForm = ({exportPdf,option,getOption}) => {

  useEffect(()=>{
    console.log('mounted form cotation . . . ');
  },[])


     //'NEUVE','OCCASION','CAMION','ENGIN','REMORQUE'
     const EtatVehiculeData = [
      { id:1, etat:"NEUVE" },
      { id:2, etat:"OCCASION" },
      { id:3, etat:"CAMION" },
      { id:4, etat:"ENGIN" },
      { id:5, etat:"REMORQUE"}
    ]
    const defaultError = ()=>({
      EtatVehicule: null,
      PoidsVehicule: null,
      PoidsColis: null,
      Amorcage: null
    })



    const [error,setError]=useState(defaultError())
  
  const [optionData,setOptionData] = useState(option)

  useEffect(()=>{
    console.warn(' form cotation changed. . . ',optionData);
  },[optionData])

  const handleChange = (event) => {
    setOptionData({...optionData,[event.target.name]:event.target.value});
  };

  const handlePdf = ()=>{
    exportPdf()
  }

  const handleCotation = () =>{
    if( optionData.PoidsVehicule.trim() !== ''  && optionData.Amorcage.trim() !==''  && optionData.PoidsColis.trim() !== '' && optionData.EtatVehicule.trim() !=='' ){
      if(error.EtatVehicule === null  && error.PoidsVehicule === null && error.PoidsColis === null && error.Amorcage === null){
        getOption(optionData)
      }else{
        AlertToast("warning","Veuillez remplir correctement le formulaire")
      }
    }else{
      AlertToast("warning","Veuillez remplir les champs obligatoires")
    }
    
  }

  const verifyPoidsVehicule = () => {
    let error_message = null
    if(+optionData.PoidsVehicule<=0 || optionData.PoidsVehicule.trim() === ''){
      error_message="Poids du colis invalide"
      setError({...error,PoidsVehicule: error_message})
      AlertToast("warning",error_message)
    }else if(+optionData.PoidsVehicule>100 || optionData.PoidsVehicule.trim() === ''){
      error_message="Poids du colis invalide"
      setError({...error,PoidsVehicule: error_message})
      AlertToast("warning",error_message)
    }
  };
  const verifyPoidsColis = () => {
    let error_message = null
    if(+optionData.PoidsColis<0 || optionData.PoidsColis.trim() === ''){
      error_message="Poids du colis invalide"
      setError({...error,PoidsColis: error_message})
      AlertToast("warning",error_message)
    }else if(+optionData.PoidsColis>100  || optionData.PoidsColis.trim() === ''){
      error_message="Poids du colis invalide"
      setError({...error,PoidsColis: error_message})
      AlertToast("warning",error_message)
    }
  };
  const verifyAmorcage = () => {
    let error_message = null
    if(+optionData.Amorcage<0 || optionData.Amorcage.trim() === ''){
      error_message="Amorcage invalide"
      setError({...error,Amorcage: error_message})
      AlertToast("warning",error_message)
    }else if(+optionData.Amorcage>100  || optionData.Amorcage.trim() === ''){
      error_message="Amorcage invalide"
      setError({...error,Amorcage: error_message})
      AlertToast("warning",error_message)
    }
  };

  const resetError = (event) => {
      setError({...error,[event.target.name]: null})
  };

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
    // height:150,
    padding:0,
    borderRadius:3,
    backgroundColor:"#f2f2f2",
    borderTop: "2px double #afa2a2",
    borderBottom: "2px inset #afa2a2",

  }

  // const filterUp = {
  //   // backgroundColor:"green",
  //   width: "100%",
  //   display: "flex",
  //   justifyContent:"space-evenly",
  //   flexWrap: "wrap",
  //   margin:5
  // }

  const filterUp = {
    // backgroundColor:"red",
    width:"100%",
    marginBottom:"20px",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap"
  }

  const filterItemUp = {
    display: "flex",
    justifyContent:"space-between",
    flexWrap: "wrap",
    margin:10
  }

  const formStyle= {
    width:"20ch",
    minWidth: "20ch",
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
                <TextField
                  select
                  SelectProps={{
                    MenuProps: {
                      sx: { maxHeight: '35ch' }
                    }
                  }}
                  value={optionData.EtatVehicule}
                  label=" ETAT VEHICULE "
                  onChange={handleChange}
                  name="EtatVehicule"
                  required
                >
                    {
                      EtatVehiculeData.map(({id,etat})=>{
                          return <MenuItem value={etat} key={id}>{`${etat}`}</MenuItem>
                      })
                    }   
                </TextField>   
              </FormControl>
            </Box>
          </div>
          <div style={filterItemUp}>
            <Box style={{width:"100%"}}>
              <FormControl style={formStyle} >
              <TextField
                error={error.PoidsVehicule ? (true) : (false)}
                helperText={error.PoidsVehicule ? (error.PoidsVehicule) : ''}
                onBlur={verifyPoidsVehicule}
                onFocus={resetError}
                variant="filled" required={true} name="PoidsVehicule" value={optionData.PoidsVehicule} onChange={handleChange} placeholder="ex :  Poids du Vehicule" type="number" label="Poids du Véhicule" />       
              </FormControl>
            </Box>
          </div>
          <div style={filterItemUp}>
            <Box style={{width:"100%"}}>
              <FormControl style={formStyle} >
              <TextField
                error={error.PoidsColis ? (true) : (false)}
                helperText={error.PoidsColis ? (error.PoidsColis) : ''}
                onBlur={verifyPoidsColis}
                onFocus={resetError}
                variant="filled" required={true} name="PoidsColis" value={optionData.PoidsColis} onChange={handleChange} placeholder="ex :  Poids du Colis" type="number" label="Poids du Colis" />
              </FormControl>
            </Box>
          </div>
          <div style={filterItemUp}>
            <Box style={{width:"100%"}}>
              <FormControl style={formStyle} >
              <TextField
                error={error.Amorcage ? (true) : (false)}
                helperText={error.Amorcage ? (error.Amorcage) : ''}
                onBlur={verifyAmorcage}
                onFocus={resetError}
                variant="filled" required={true} name="Amorcage" value={optionData.Amorcage} onChange={handleChange} placeholder="ex :  Amorcage" type="number" label="Amorcage"
                />
              </FormControl>
            </Box>
          </div>
        </div>
        <div style={filterDown}>
          <div className="h-70">
            <ButtonComponent color='vertBlue' textColor="white" function={handleCotation} name_of_btn="ESTIMATION" icon={<VisibilityIcon />} />
            <ExportPdf function={handlePdf}/>
          </div>
        </div>
          

      </div>
    );
}

export default CotationForm;
