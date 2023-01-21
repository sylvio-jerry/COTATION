import React, { useEffect,useState } from 'react';
import axios from 'axios'
import { useLocation, useNavigate,useParams } from "react-router-dom";
import { ButtonComponent, HeaderLabel, DatePicker,AlertToast} from '../../components';
import { Box,TextField,FormControl } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import BackspaceIcon from '@mui/icons-material/Backspace';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Verify from './Verify';
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanOutlinedIcon from '@mui/icons-material/LanOutlined';

var moment = require('moment');
moment.locale('fr');
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const EditLivraison = () => {
  let {id} = useParams()
  let navigate = useNavigate();
  const {state} = useLocation()

  useEffect(()=>{
    getClient()
    getEquipement()
    getLivraison()
  },[])

  const defaultLivraison = () => ({
    num_bon_livraison: '',
    date_livraison: null,
    num_facture: '',
    date_facture: null,
    client: null,
    equipement: [],
    observation : ''
  });

  const defaultError = ()=>({
    num_bon_livraison: null,
    date_livraison: null,
    num_facture: null,
    date_facture: null,
    client: null,
    equipement: null,
    observation : null
  })

  const [livraison, setLivraison] = useState(defaultLivraison());
  const [showVerify, setShowVerify] = useState(false);
  const [error,setError]=useState(defaultError())

  const date_format = (date,stringFormat="DD/MM/YYYY")=>{
    let date_formatted = moment(new Date(date), stringFormat).format(stringFormat)
    return date_formatted;
  }

  const getLivraison = async () =>{
    // console.log("idContrat : ", state.id);

    let livraison_data = {}
    try {
      const {data} = await axios.get(`${API_URL}/api/livraison/${id}`)
      if(data){
        livraison_data = data.data
      }
     } catch (error) {
       console.log("error while getClientRequest:",error);
     }

    let livraison_ = {
      num_bon_livraison:livraison_data.num_bon_livraison ,
      date_facture:livraison_data.date_facture ? date_format(livraison_data.date_facture) : null,
      date_livraison: livraison_data.date_livraison ? date_format(livraison_data.date_livraison) : null,
      observation : livraison_data.observation ?  livraison_data.observation : null,
      num_facture: livraison_data.num_facture ? livraison_data.num_facture : '',
      client: livraison_data.client,
      equipement : livraison_data.equipement
    }
    setLivraison(livraison_)
  }
  const [equipementData,setEquipementData] = useState([])
  const [clientData,setClientData] = useState([])

    const getEquipement = async()=>{
      const getEquipementIds = state?.equipement?.map(({id})=>id)
      try {
        const {data} = await axios.post(`${API_URL}/api/equipement/edit_to_livraison`,{array_of_id_equipement_livraison:getEquipementIds})
        if(data){
          let data_ = data.data
          setEquipementData(data_)
          // let equipementNoLivraison = data_?.filter(equipement_=> !equipement_.livraison_id)
        }
       } catch (error) {
         console.log("error while getEquipement:",error);
       }
    }

    const getClient = async()=>{
      try {
        const {data} = await axios.get(`${API_URL}/api/client`)
        if(data){
          setClientData(data.data)
        }
       } catch (error) {
         console.log("error while getClientRequest:",error);
       }
    }

    const edit = async()=>{
      if(livraison.num_bon_livraison.trim() !=='' && livraison.date_livraison !== null && livraison.client !== null && livraison.equipement.length>0 ){
        if(error.num_bon_livraison === null && error.num_facture === null  && error.date_livraison === null  && error.date_facture === null && error.equipement === null && error.observation === null){
          try {
            let updatedLivraison = livraison
            updatedLivraison.num_facture = (updatedLivraison.num_facture.trim() === '') ? null : updatedLivraison.num_facture.trim()
            updatedLivraison.client = updatedLivraison.client.id
            updatedLivraison.date_livraison = moment(updatedLivraison.date_livraison,'DD/MM/YYYY').format('YYYY-MM-DD')
            updatedLivraison.date_facture = updatedLivraison.date_facture ? moment(updatedLivraison.date_facture,'DD/MM/YYYY').format('YYYY-MM-DD') : null
            let equipementId = []
            updatedLivraison.equipement.map((el)=>{
              equipementId.push(el.id)
            })
            updatedLivraison.equipement = equipementId
            const data_ = await axios.put(`${API_URL}/api/livraison/${id}`,updatedLivraison)
            let {status,message} = data_.data
            if(status==="success"){
              AlertToast("success",message)
              setLivraison(defaultLivraison())
              exit()
            }
         } catch ({response}) {
            console.log("error while editLivraisonRequest:", response);
            let {status,message} = response?.data
            if(status==="failed"){
              exit()
              AlertToast("error",message)
            }
         }
        }
        else{
          AlertToast("warning","Veuillez remplir correctement le formulaire")
        }
      }else{
        AlertToast("warning","Veuillez remplir les champs obligatoires")
      }
    }
    
  const exit = ()=>{
    navigate(-1)
  }

  const skip = ()=>{
    AlertToast("info","Operation annulé")
    navigate(-1)
  }

  const verify = ()=>{
    setShowVerify(!showVerify)
  }

  const handleChange = (event) => {
    setLivraison({...livraison,[event.target.name]:event.target.value});
  };

  const handleChangeClient = (event,value) => {
    setLivraison({...livraison,client:value});
  };

  const handleChangeEquipement = (event,value) => {
    setLivraison({...livraison,equipement:value});
  };

  const handleChangeDateLivraison = (date) => {
    setLivraison({...livraison,date_livraison:date});
  };

  const handleChangeDateFacture = (date) => {
    setLivraison({...livraison,date_facture:date});
  };

  //handle error handler
  const verifyNumBonLivraison= () => {
    let error_message = null
    if(livraison.num_bon_livraison.trim().length<2){
      error_message="Au moins 2 caractères"
      setError({...error,num_bon_livraison: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyClient= () => {
    let error_message = null
    if(livraison.client===null){
      error_message="Veuillez choisir le client"
      setError({...error,client: error_message})
      AlertToast("warning",error_message)
    }
  };

  const verifyEquipement= () => {
    let error_message = null
    if(livraison.equipement.length<1){
      error_message="Veuillez choisir l'équipemet"
      setError({...error,equipement: error_message})
      AlertToast("warning",error_message)
    }
  };

  const resetError = (event) => {
      setError({...error,[event.target.name]: null})
  };

  //style
  const addContainer = {
    // backgroundColor: "red",
    width: "95%",
    height:"85vh",
    padding:10,
    marginTop:100,
    display: "flex",
    flexDirection: "column",
    alignItems : "center"
  }
  const headerLabelContainer = {
    // backgroundColor: "yellow",
    marginBottom: 10,
    width: "50%",
    dislay: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    minWidth:250
  }
  const formContainer = {
    // backgroundColor: "black",
    padding: 10,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  }
  const formContainerItem = {
    // backgroundColor: "white",
    margin: 10,
    width: "500px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }

  const action = {
    // backgroundColor: "grey",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 60
  }

  const actionItem = {
    margin: 25
  }

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl" style={addContainer}>
      {showVerify && <Verify openModal={showVerify} closeModal={setShowVerify} data={livraison} />}
      <div style={headerLabelContainer}>
        <HeaderLabel title="MODIFICATION LIVRAISON"/>
      </div>
      <div style={formContainer}>
        <div style={formContainerItem}>
          <div>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, minWidth: "35ch" },
              }}
              noValidate
            >
              <TextField
                error={error.num_bon_livraison ? (true) : (false)}
                helperText={error.num_bon_livraison ? (error.num_bon_livraison) : ''}
                onBlur={verifyNumBonLivraison}
                onFocus={resetError}
                variant="filled" required={true} name="num_bon_livraison" value={livraison.num_bon_livraison} onChange={handleChange} placeholder="ex : N° BN Livraison" type="name" label="N° BN Livraison"
              />
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, minWidth: "35ch", marginBottom:4 },
              }}
              noValidate
            >
              <TextField
                variant="filled" required={false} name="num_facture" value={livraison.num_facture} onChange={handleChange} placeholder="ex : N° Facture" type="name" label="N° FACTURE"
              />
            </Box>
          </div>
          <div>
            <Box style={{minWidth: "35ch", marginBottom:30}}>
              <FormControl style={{minWidth: "100%"}}>
                <DatePicker label="DATE FACTURE" defaultValue={livraison.date_facture} required={false} getDate={handleChangeDateFacture}/>
              </FormControl>
            </Box>
          </div>
          <div>
            <Box style={{minWidth: "35ch", marginBottom:15}}>
              <FormControl style={{minWidth: "100%"}}>
                <DatePicker label="DATE LIVRAISON" defaultValue={livraison.date_livraison}  required={true} getDate={handleChangeDateLivraison}/>
              </FormControl>
            </Box>
          </div>
        </div>
        <div style={formContainerItem}>
          <div>
            <Box style={{minWidth: "35ch", marginBottom: 30, marginTop: 15}}>
              <FormControl style={{minWidth: "100%"}}>
                <Autocomplete
                  isOptionEqualToValue={(option, value) =>
                    value === undefined || value === "" || option.id === value.id
                  }
                  onChange={handleChangeClient}
                  value={livraison.client}
                  id="checkboxes-tags-demo"
                  groupBy={(option) => option.ville.province.nom_province}
                  renderGroup={(params) => 
                    (<li style={{padding:5}} key={params.key}>
                      <div className='flex  bg-[#03C9D7] rounded-lg p-1 font-medium'>
                        <div><LocationOnIcon style={{color: 'white'}}/></div>
                        <div style={{marginLeft: 5, color: 'white'}}>{params.group.toUpperCase()}</div>
                      </div>
                      <ul style={{margin:5}}>
                        {/* <div className='flex  bg-[#b4bfc0] rounded-lg p-1 font-medium'>
                        </div> */}
                          <div style={{marginLeft: 5}}>{params.children}</div>
                      </ul>
                    </li>)
                  }
                  options={clientData.sort((a, b) =>
                    a.ville.province.nom_province.toString().localeCompare( b.ville.province.nom_province.toString())
                  )}
                  // disableCloseOnSelect
                  getOptionLabel={(option) => `${option.nom_client || ''} ${option.ville.nom_ville || ''} ${option.adresse || ''} `}
                  style={{ width: "35ch",minHeight: 50}}
                  ListboxProps={
                    {
                      style:{
                          maxHeight: '35ch',
                          border: '1px solid gray'
                      }
                    }
                  }
                  renderInput={(params) => <TextField 
                    error={error.client ? (true) : (false)}
                    helperText={error.client ? (error.client) : ''}
                    onBlur={verifyClient}
                    onFocus={resetError}
                    {...params} label="CLIENT" name='client' required={true}/>}
                />
              </FormControl>
            </Box>
          </div>  
          <div>
            <Box style={{minWidth: "35ch", marginBottom: 15}}>
              <FormControl style={{minWidth: "100%"}}>
                <Autocomplete
                  isOptionEqualToValue={(option, value) =>
                    value === undefined || value === "" || option.id === value.id
                  }
                  onChange={handleChangeEquipement}
                  multiple
                  value={livraison.equipement}
                  id="checkboxes-tags-demo"
                  groupBy={(option) => option.famille.nom_famille}
                  renderGroup={(params) => 
                    (<li style={{padding:5}} key={params.key}>
                      <div className='flex  bg-[#03C9D7] rounded-lg p-1 font-medium'>
                        <div><LanOutlinedIcon style={{color: 'white'}}/></div>
                        <div style={{marginLeft: 5, color: 'white'}}>{params.group.toUpperCase()}</div>
                      </div>
                      <ul style={{margin:5}}>
                        {/* <div className='flex  bg-[#b4bfc0] rounded-lg p-1 font-medium'>
                        </div> */}
                          <div style={{marginLeft: 5}}>{params.children}</div>
                      </ul>
                    </li>)
                  }
                  options={equipementData.sort((a, b) =>
                    a.famille.nom_famille.toString().localeCompare(b.famille.nom_famille.toString())
                  )}
                  disableCloseOnSelect
                  getOptionLabel={(option) => `${option.num_serie || ''} | ${option.marque || ''} | ${option.modele || ''} `}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected}
                      />
                      {`${option.num_serie} | ${option.marque} | ${option.modele}`}
                    </li>
                  )}
                  style={{ width: "35ch",minHeight: 50}}
                  ListboxProps={
                    {
                      style:{
                          maxHeight: '35ch',
                          border: '1px solid gray'
                      }
                    }
                  }
                  renderInput={(params) => (
                    <TextField 
                    error={error.equipement ? (true) : (false)}
                    helperText={error.equipement ? (error.equipement) : ''}
                    onBlur={verifyEquipement}
                    onFocus={resetError}
                    {...params} label="EQUIPEMENT" placeholder="Equipement" required={true} name="equipement" />
                  )}
                />
              </FormControl>
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 2, minWidth: "35ch" },
              }}
              noValidate
            >
              <TextField multiline rows={3} variant="filled" required={false} name="observation" value={livraison.observation || ""} onChange={handleChange} placeholder="ex : Observation" type="name" label="OBSERVATION" />
            </Box>
          </div>
        </div>
      </div>
      <div style={action}>
        <div style={actionItem}>
          <ButtonComponent color='error' function={skip} name_of_btn="ANNULER" icon={<BackspaceIcon />} />
        </div>
        <div style={actionItem}>
          <ButtonComponent color='vertBlue' textColor="white" function={verify} name_of_btn="VOIR" icon={<VisibilityIcon />} />
        </div>
        <div style={actionItem}>
          <ButtonComponent color='root' function={edit} name_of_btn="ENREGISTRER" icon={<SaveIcon />} />
        </div>
      </div>
    </div>
  )
  
};

export default EditLivraison;


