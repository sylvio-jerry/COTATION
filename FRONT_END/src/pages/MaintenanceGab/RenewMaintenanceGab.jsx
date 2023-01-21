import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate , useParams} from "react-router-dom";
import {
  ButtonComponent,
  HeaderLabel,
  DatePicker,
  AlertToast,
} from "../../components";
import {
  Box,
  TextField,
  FormControl,
  FormLabel,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Typography
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import BackspaceIcon from "@mui/icons-material/Backspace";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VerifyAdd from "./VerifyAdd";
import Autocomplete from "@mui/material/Autocomplete";

import globalStyle from "../../Style/globalStyle";
const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/";

var moment = require("moment");
moment.locale("fr");

const RenewMaintenanceGab = () => {
  let {id} = useParams()
  let classes = globalStyle();
  let navigate = useNavigate();

  const getRedevance = (type, redevance_gab = []) => {
    if(redevance_gab){
      const Q = redevance_gab?.find((red) => red.type === type);
      return Q;
    }
  };

  const defaultContrat = () => ({
    client: null,
    date_debut: null,
    site_installation: "",
    equipement: null,
    redevance_totale: "",
    date_proposition: null,
    observation: "",
    redevance_gab: [
      {
        type: "Q1",
        num_facture: "",
        date_facture: null,
        montant: "",
        isPaid: false,
      },
      {
        type: "Q2",
        num_facture: "",
        date_facture: null,
        montant: "",
        isPaid: false,
      },
      {
        type: "Q3",
        num_facture: "",
        date_facture: null,
        montant: "",
        isPaid: false,
      },
      {
        type: "Q4",
        num_facture: "",
        date_facture: null,
        montant: "",
        isPaid: false,
      },
    ]
  });

  const defaultError = () => ({
    client: null,
    date_debut: null,
    site_installation: null,
    equipement: null,
    redevance_totale: null,
    montant_q1: null,
    montant_q2: null,
    montant_q3: null,
    montant_q4: null
  });

  const [contrat, setContrat] = useState(defaultContrat());
  const [equipementData, setEquipementData] = useState([]);
  const [clientData, setClientData] = useState([]);
  const [showVerify, setShowVerify] = useState(false);
  const [dataVerify, setDataVerify] = useState([]);
  const [error, setError] = useState(defaultError());
  const [showQ1, setShowQ1] = useState(false);
  const [showQ2, setShowQ2] = useState(false);
  const [showQ3, setShowQ3] = useState(false);
  const [showQ4, setShowQ4] = useState(false);

  //default quarter value
  const defaultQ1 = () => getRedevance("Q1", contrat.redevance_gab);
  const defaultQ2 = () => getRedevance("Q2", contrat.redevance_gab);
  const defaultQ3 = () => getRedevance("Q3", contrat.redevance_gab);
  const defaultQ4 = () => getRedevance("Q4", contrat.redevance_gab);


  const [Q1, setQ1] = useState(defaultQ1());
  const [Q2, setQ2] = useState(defaultQ2());
  const [Q3, setQ3] = useState(defaultQ3());
  const [Q4, setQ4] = useState(defaultQ4());

  const resetAllInput = ()=>{
    setShowQ1(false)
    setShowQ2(false)
    setShowQ3(false)
    setShowQ4(false)
    setQ1(defaultQ1())
    setQ2(defaultQ2())
    setQ3(defaultQ3())
    setQ4(defaultQ4())
    setContrat(defaultContrat())
  }


  useEffect(() => {
    getClient();
    getEquipement();
    getContrat()
  }, []);

  //getContrat 
  const getContrat = async () =>{
    let contrat_data = {}
    try {
      const {data} = await axios.get(`${API_URL}/api/contrat_maintenance_gab/${id}`)
      if(data){
        contrat_data = data.data
      }
     } catch (error) {
       console.log("error while getContratRequest:",error);
     }

     const redevance_gab = [
      {
        type: "Q1",
        num_facture: "",
        date_facture: null,
        montant: "",
        isPaid: false,
      },
      {
        type: "Q2",
        num_facture: "",
        date_facture: null,
        montant: "",
        isPaid: false,
      },
      {
        type: "Q3",
        num_facture: "",
        date_facture: null,
        montant: "",
        isPaid: false,
      },
      {
        type: "Q4",
        num_facture: "",
        date_facture: null,
        montant: "",
        isPaid: false,
      },
    ]

    let contrat_ = {
      client: contrat_data?.client,
      date_debut: moment(contrat_data?.date_debut).add(1,'year').startOf('year').format('DD/MM/YYYY'),
      site_installation : contrat_data?.site_installation,
      equipement: contrat_data?.equipement,
      redevance_totale: contrat_data?.redevance_totale,
      date_proposition: null,
      observation : contrat_data?.observation ? contrat_data?.observation : '',
      redevance_gab: redevance_gab
    }
    setContrat(contrat_)
    // handleResume(contrat_)
  }

  //fetch equipement gab not in contrat
  const getEquipement = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/api/equipement/edit_to_contrat_maintenance_gab`
      );
      if (data) {
        setEquipementData(data.data);
      }
    } catch (error) {
      console.log("error while getEquipementRequest:", error);
    }
  };

  //get client
  const getClient = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/client`);
      if (data) {
        setClientData(data.data);
      }
    } catch (error) {
      console.log("error while getClientRequest:", error);
    }
  };


  let makeRedevance = ()=>{
    let redevance_gab = []
      if (showQ1) redevance_gab.push(Q1)
      if (showQ2) redevance_gab.push(Q2)
      if (showQ3) redevance_gab.push(Q3)
      if (showQ4) redevance_gab.push(Q4)
    return redevance_gab
  }

  const checkIfNotValidRedevance = (redevance=[]) =>{
    return !!redevance?.find(({montant})=>montant.toString().trim()==='')
  }
  const renew = async () => {
  const redevance_gab = makeRedevance()
  const montantNotFilled = checkIfNotValidRedevance(redevance_gab)


    if (
      contrat.site_installation.trim() !== "" &&
      contrat.redevance_totale.toString().trim().length > 0 &&
      contrat.date_debut !== null &&
      contrat.client !== null &&
      contrat.equipement !== null &&
      redevance_gab.length > 0 &&
      !montantNotFilled
    ){
      if (
        error.site_installation === null &&
        error.redevance_totale === null &&
        error.date_debut === null &&
        error.client === null &&
        error.equipement === null &&
        error.montant_q1 === null &&
        error.montant_q2 === null &&
        error.montant_q3 === null &&
        error.montant_q4 === null
      ){
        try {
          let contrat_ = contrat;

          const redevanceFormattedDateFature = redevance_gab.map((redevance_)=>
            ({...redevance_,
              date_facture:  redevance_.date_facture ? moment(redevance_.date_facture,'DD/MM/YYYY').format('YYYY-MM-DD') : null,
              montant: (redevance_.montant.toString().trim()==='') ? null : +redevance_.montant,
              num_facture: (redevance_.num_facture.toString().trim()==='') ? null : redevance_.num_facture
            })
          )
          let preparedRedevance = []
          redevanceFormattedDateFature.map(({date_facture,type,isPaid,montant,num_facture})=>{
            preparedRedevance.push({
              date_facture,
              montant,
              num_facture,
              type,
              isPaid
            })
          })

          let RenewedContrat = {
            date_debut: moment(contrat_?.date_debut,'DD/MM/YYYY').format('YYYY-MM-DD'),
            site_installation : contrat_?.site_installation,
            observation : (contrat_?.observation.trim() !== '') ? contrat_?.observation.trim() : null,
            redevance_totale: +contrat_.redevance_totale,
            client_id: contrat_.client.id,
            equipement_id: contrat_.equipement.id,
            date_proposition: contrat_.date_proposition
              ? moment(contrat_.date_proposition, "DD/MM/YYYY").format(
                  "YYYY-MM-DD"
                )
              : null,
            redevance : preparedRedevance
          };

          const data_ = await axios.post(
            `${API_URL}/api/contrat_maintenance_gab`,
            RenewedContrat
            );

          let { status } = data_.data;
          if (status === "success") {
            AlertToast("success","Renouvellement avec succès")
            resetAllInput()
            exit()
          }
        } catch ({response}) {
          console.log("error while postGabRequest:", error);
          let { status, message } = response.data;
          if (status === "failed") {
            AlertToast("error",message)
          }
        }
      } else {
        AlertToast("warning", "Veuillez remplir correctement le formulaire");
      }
    } else {
      AlertToast("warning", "Veuillez remplir les champs obligatoires");
    }
  };

  const exit = ()=>{
      navigate(-1)
    }
  
    const skip = ()=>{
      AlertToast("info","Operation annulé")
      navigate(-1)
    }

  const verify = () => {
    // verify
    setDataVerify({...contrat,redevance_gab: makeRedevance(), showQ1,showQ2,showQ3,showQ4})
    setShowVerify(!showVerify);
  };

  //handle change for general input
  const handleChange = (event) => {
    setContrat({ ...contrat, [event.target.name]: event.target.value });
  };

  const handleChangeClient = (event, value) => {
    setContrat({ ...contrat, client: value });
  };

  const handleChangeEquipement = (event, value) => {
    setContrat({ ...contrat, equipement: value, redevance_totale: value.redevance_contrat ? value.redevance_contrat : ""  });
  };

  const handleChangeDateDebutContrat = (date) => {
    setContrat({ ...contrat, date_debut: date });
  };

  const handleChangeStatutRedevance = (event) => {
    if (event.target.name === "is_paid_q1") {
      setQ1({ ...Q1, isPaid: !Q1.isPaid });
    } else if (event.target.name === "is_paid_q2") {
      setQ2({ ...Q2, isPaid: !Q2.isPaid });
    } else if (event.target.name === "is_paid_q3") {
      setQ3({ ...Q3, isPaid: !Q3.isPaid });
    } else if (event.target.name === "is_paid_q4") {
      setQ4({ ...Q4, isPaid: !Q4.isPaid });
    }
  };

  const handleChangeCheckBox = (event) => {
    if (event.target.name === "Q1") {
      if(event.target.value==="true"){
        setError({ ...error, montant_q1: null });
       }
      setShowQ1(!showQ1);
    } else if (event.target.name === "Q2") {
      if(event.target.value==="true"){
        setError({ ...error, montant_q2: null });
       }
      setShowQ2(!showQ2);
    } else if (event.target.name === "Q3") {
      if(event.target.value==="true"){
        setError({ ...error, montant_q3: null });
       }
      setShowQ3(!showQ3);
    } else if (event.target.name === "Q4") {
      if(event.target.value==="true"){
        setError({ ...error, montant_q4: null });
       }
      setShowQ4(!showQ4);
    }

    // console.log("check eeeeeeeeeeeeee",event);
    // console.log("check valueChecked eeeeeeeeeeeeee",event.target.checked);
    // console.log("check value eeeeeeeeeeeeee",event.target.value);
    // console.log("check name eeeeeeeeeeeeee",event.target.name);
  };

  const handleChangeNumFacture = (event) => {
    if (event.target.name === "num_facture_q1") {
      setQ1({ ...Q1, num_facture: event.target.value });
    } else if (event.target.name === "num_facture_q2") {
      setQ2({ ...Q2, num_facture: event.target.value });
    } else if (event.target.name === "num_facture_q3") {
      setQ3({ ...Q3, num_facture: event.target.value });
    } else if (event.target.name === "num_facture_q4") {
      setQ4({ ...Q4, num_facture: event.target.value });
    }
  };

  const handleChangeMontant = (event) => {
    if (event.target.name === "montant_q1") {
      setQ1({ ...Q1, montant: event.target.value });
    } else if (event.target.name === "montant_q2") {
      setQ2({ ...Q2, montant: event.target.value });
    } else if (event.target.name === "montant_q3") {
      setQ3({ ...Q3, montant: event.target.value });
    } else if (event.target.name === "montant_q4") {
      setQ4({ ...Q4, montant: event.target.value });
    }
  };

  const handleChangeDateFactureQ1 = (date) => {
    setQ1({ ...Q1, date_facture: date });
  };
  const handleChangeDateFactureQ2 = (date) => {
    setQ2({ ...Q2, date_facture: date });
  };
  const handleChangeDateFactureQ3 = (date) => {
    setQ3({ ...Q3, date_facture: date });
  };
  const handleChangeDateFactureQ4 = (date) => {
    setQ4({ ...Q4, date_facture: date });
  };
  const handleChangeDateProposition = (date) => {
    setContrat({ ...contrat, date_proposition: date });
  };

  //handle error handler
  const verifySiteInstallation = () => {
    let error_message = null;
    if (contrat.site_installation.trim().length < 2) {
      error_message = "Au moins 2 caractères";
      setError({ ...error, site_installation: error_message });
      AlertToast("warning", error_message);
    }
  };

  const verifyClient = () => {
    let error_message = null;
    if (contrat.client === null) {
      error_message = "Veuillez choisir le client";
      setError({ ...error, client: error_message });
      AlertToast("warning", error_message);
    }
  };

  const verifyMontant = (event) => {
    let error_message = null;
    error_message = "Montant invalide";
    if(event.target.name=== "redevance_totale"){
      if(+contrat.redevance_totale<1){
        setError({ ...error, [event.target.name]: error_message });
        AlertToast("warning", error_message);
      }
    }else if (event.target.name === "montant_q1") {
      if(+Q1.montant<1){
        setError({ ...error, [event.target.name]: error_message });
        AlertToast("warning", error_message);
      }
    } else if (event.target.name === "montant_q2") {
      if(+Q2.montant<1){
        setError({ ...error, [event.target.name]: error_message });
        AlertToast("warning", error_message);
      }
    } else if (event.target.name === "montant_q3") {
      if(+Q3.montant<1){
        setError({ ...error, [event.target.name]: error_message });
        AlertToast("warning", error_message);
      }
    } else if (event.target.name === "montant_q4") {
      if(+Q4.montant<1){
        setError({ ...error, [event.target.name]: error_message });
        AlertToast("warning", error_message);
      }
    }
  };

  const verifyEquipement = () => {
    let error_message = null;
    if (contrat.equipement===null) {
      error_message = "Veuillez choisir l'équipement";
      setError({ ...error, equipement: error_message });
      AlertToast("warning", error_message);
    }
  };

  const resetError = (event) => {
    setError({ ...error, [event.target.name]: null });
  };

  //style
  const addContainer = {
    // backgroundColor: "red",
    width: "95%",
    // height:"85vh",
    padding: 10,
    marginTop: 100,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };
  const headerLabelContainer = {
    // backgroundColor: "yellow",
    marginBottom: 10,
    width: "50%",
    dislay: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    minWidth: 250,
  };
  const formContainer = {
    // backgroundColor: "blue",
    padding: 10,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    // margin: "50px",
  };
  const formContainerItem = {
    // backgroundColor: "grey",
    margin: 10,
    width: 350,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const action = {
    // backgroundColor: "blue",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 60,
  };

  const actionItem = {
    margin: 25,
  };

  return (
    <div
      className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl"
      style={addContainer}
    >
      {showVerify && (
        <VerifyAdd
          openModal={showVerify}
          closeModal={setShowVerify}
          data={dataVerify}
        />
      )}
      <div style={headerLabelContainer}>
        <HeaderLabel title="RENOUVELLEMENT CONTRAT DE MAINTENANCE GAB" />
      </div>
      <div style={formContainer}>
        <div style={formContainerItem}>
          <div>
            <Box style={{ minWidth: "35ch", marginBottom: 30, marginTop: 15 }}>
              <FormControl style={{ minWidth: "100%" }}>
                <Autocomplete
                  isOptionEqualToValue={(option, value) =>
                    value === undefined ||
                    value === "" ||
                    option.id === value.id
                  }
                  disabled
                  onChange={handleChangeClient}
                  value={contrat.client}
                  getOptionLabel={(option) => `${option.nom_client || ''} ${option.ville.nom_ville || ''} ${option.adresse || ''} `}
                  disablePortal
                  id="combo-box-demo"
                  options={clientData}
                  sx={{ minWidth: "35ch" }}
                  renderInput={(params) => (
                    <TextField
                      error={error.client ? true : false}
                      helperText={error.client ? error.client : ""}
                      onBlur={verifyClient}
                      onFocus={resetError}
                      {...params}
                      label="CLIENT"
                      name="client"
                      required={true}
                    />
                  )}
                />
              </FormControl>
            </Box>
          </div>
          <div>
            <Box style={{ minWidth: "35ch", marginBottom: 15 }}>
              <FormControl style={{ minWidth: "100%" }}>
                <DatePicker
                  label="DATE DEBUT CONTRAT"
                  required={true}
                  defaultValue={contrat.date_debut}
                  getDate={handleChangeDateDebutContrat}
                />
              </FormControl>
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 2, minWidth: "35ch", marginBottom: 4 },
              }}
              noValidate
            >
              <TextField
                error={error.site_installation ? true : false}
                helperText={
                  error.site_installation ? error.site_installation : ""
                }
                onBlur={verifySiteInstallation}
                onFocus={resetError}
                variant="filled"
                disabled
                required={true}
                name="site_installation"
                value={contrat.site_installation}
                onChange={handleChange}
                placeholder="ex : Site Installation"
                type="name"
                label="SITE D'INSTALLATION"
              />
            </Box>
          </div>
          <div>
            <Box style={{ minWidth: "35ch", marginBottom: 30 }}>
              <FormControl style={{ minWidth: "100%" }}>
                <Autocomplete
                  isOptionEqualToValue={(option, value) =>
                    value === undefined ||
                    value === "" ||
                    option.id === value.id
                  }
                  disabled
                  onChange={handleChangeEquipement}
                  value={contrat.equipement}
                  getOptionLabel={(option) => `${option.num_serie || ''} | ${option.marque || ''} | ${option.modele || ''} `}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      {`${option.num_serie} | ${option.marque} | ${option.modele}`}
                    </li>
                  )}
                  disablePortal
                  id="combo-box-demo"
                  options={equipementData}
                  sx={{ minWidth: "35ch" }}
                  renderInput={(params) => (
                    <TextField
                      error={error.equipement ? true : false}
                      helperText={error.equipement ? error.equipement : ""}
                      onBlur={verifyEquipement}
                      onFocus={resetError}
                      {...params}
                      label="EQUIPEMENT"
                      name="equipement"
                      required={true}
                    />
                  )}
                />
              </FormControl>
            </Box>
          </div>
          {/* {JSON.stringify(Q1)}
          {JSON.stringify(Q2)}
          {JSON.stringify(Q3)}
          {JSON.stringify(Q4)} */}
        </div>
        <div style={formContainerItem}>
          <div>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 2, minWidth: "35ch", marginBottom: 3 },
              }}
              noValidate
            >
              <TextField
                error={error.redevance_totale ? true : false}
                helperText={error.redevance_totale ? error.redevance_totale : ""}
                onBlur={verifyMontant}
                onFocus={resetError}
                variant="filled"
                required={true}
                name="redevance_totale"
                value={contrat.redevance_totale}
                onChange={handleChange}
                placeholder="ex : xx xxx Ar "
                type="number"
                label="REDEVANCE TOTALE en Ariary"
              />
            </Box>
          </div>
          <div>
            <Box style={{ minWidth: "35ch", marginBottom: 15 }}>
              <FormControl style={{ minWidth: "100%" }}>
                <DatePicker
                  label="DATE PROPOSITION"
                  defaultValue={contrat.date_proposition}
                  getDate={handleChangeDateProposition}
                />
              </FormControl>
            </Box>
          </div>
          <div>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 2, minWidth: "35ch" },
              }}
              noValidate
            >
              <TextField
                multiline
                rows={3}
                variant="filled"
                required={false}
                name="observation"
                value={contrat.observation}
                onChange={handleChange}
                placeholder="ex : Observation"
                type="name"
                label="OBSERVATION"
              />
            </Box>
          </div>
          <div style={{ minWidth: "35ch", marginBottom: 10, marginTop: 10 }}>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 2, width: "100%" },
              }}
              noValidate
            >
              <FormLabel id="demo-row-radio-buttons-group-label">
                REDEVANCE TRIMESTRIEL
              </FormLabel>
            </Box>
          </div>
          {/* checkbox redevance */}
          <div style={{ display: "flex", width: "35ch" }}>
            <div>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": {
                    display: "flex",
                    justifyContent: "start",
                    marginBottom: 3,
                  },
                }}
                noValidate
              >
                <div>
                {/* {JSON.stringify(showQ1)}
                {JSON.stringify(showQ2)}
                {JSON.stringify(showQ3)}
                {JSON.stringify(showQ4)} */}
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={showQ1}
                          checked={showQ1}
                          onChange={handleChangeCheckBox}
                          name="Q1"
                        />
                      }
                      label="Q1"
                      labelPlacement="top"
                    />
                  </FormGroup>
                </div>
              </Box>
            </div>
            <div>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": {
                    display: "flex",
                    justifyContent: "start",
                    marginBottom: 3,
                  },
                }}
                noValidate
              >
                <div>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={showQ2}
                          checked={showQ2}
                          onChange={handleChangeCheckBox}
                          name="Q2"
                        />
                      }
                      label="Q2"
                      labelPlacement="top"
                    />
                  </FormGroup>
                </div>
              </Box>
            </div>
            <div>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": {
                    display: "flex",
                    justifyContent: "start",
                    marginBottom: 3,
                  },
                }}
                noValidate
              >
                <div>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={showQ3}
                          checked={showQ3}
                          onChange={handleChangeCheckBox}
                          name="Q3"
                        />
                      }
                      label="Q3"
                      labelPlacement="top"
                    />
                  </FormGroup>
                </div>
              </Box>
            </div>
            <div>
              <Box
                component="form"
                sx={{
                  "& > :not(style)": {
                    display: "flex",
                    justifyContent: "start",
                    marginBottom: 3,
                  },
                }}
                noValidate
              >
                <div>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          value={showQ4}
                          onChange={handleChangeCheckBox}
                          name="Q4"
                          checked={showQ4}
                        />
                      }
                      label="Q4"
                      labelPlacement="top"
                    />
                  </FormGroup>
                </div>
              </Box>
            </div>
          </div>
        </div>
      </div>
      {/* container information redevance */}
      {contrat.redevance_gab && <div>
        <div style={formContainer}>
          <div style={formContainerItem}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFORMATION Q1 </strong></Typography>
            </div>
            <div style={{}}>
              {showQ1 && (
                <div>
                  <div>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 2, minWidth: "35ch" },
                      }}
                      noValidate
                    >
                      <TextField
                        variant="filled"
                        required={false}
                        name="num_facture_q1"
                        value={Q1?.num_facture}
                        onChange={handleChangeNumFacture}
                        placeholder="ex : N° Facture"
                        type="name"
                        label="N° FACTURE"
                      />
                    </Box>
                  </div>
                  <div>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 2, minWidth: "35ch" },
                      }}
                      noValidate
                    >
                      <FormControl>
                        <DatePicker
                          label="DATE FACTURE"
                          defaultValue={Q1.date_facture}
                          getDate={handleChangeDateFactureQ1}
                        />
                      </FormControl>
                    </Box>
                  </div>
                  <div>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 2, minWidth: "35ch" },
                      }}
                      noValidate
                    >
                      <TextField
                        error={error.montant_q1 ? true : false}
                        helperText={error.montant_q1 ? error.montant_q1 : ""}
                        onBlur={verifyMontant}
                        onFocus={resetError}
                        variant="filled"
                        required={true}
                        name="montant_q1"
                        value={Q1.montant}
                        onChange={handleChangeMontant}
                        placeholder="ex : xx xxx Ar "
                        type="number"
                        label="MONTANT en Ariary"
                      />
                    </Box>
                  </div>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 2, minWidth: "35ch" },
                    }}
                    noValidate
                  >
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        STATUT REDEVANCE
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="is_paid_q1"
                        value={Q1.isPaid}
                        onChange={handleChangeStatutRedevance}
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Payé"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="Non Payé"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </div>
              )}
            </div>
          </div>
          <div style={formContainerItem}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFORMATION Q2 </strong></Typography>
            </div>
            <div style={{}}>
              {showQ2 && (
                <div>
                  <div>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 2, minWidth: "35ch" },
                      }}
                      noValidate
                    >
                      <TextField
                        variant="filled"
                        required={false}
                        name="num_facture_q2"
                        value={Q2?.num_facture}
                        onChange={handleChangeNumFacture}
                        placeholder="ex : N° Facture"
                        type="name"
                        label="N° FACTURE"
                      />
                    </Box>
                  </div>
                  <div>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 2, minWidth: "35ch" },
                      }}
                      noValidate
                    >
                      <FormControl>
                        <DatePicker
                          label="DATE FACTURE"
                          defaultValue={Q2.date_facture}
                          getDate={handleChangeDateFactureQ2}
                        />
                      </FormControl>
                    </Box>
                  </div>
                  <div>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 2, minWidth: "35ch" },
                      }}
                      noValidate
                    >
                      <TextField
                        error={error.montant_q2 ? true : false}
                        helperText={error.montant_q2 ? error.montant_q2 : ""}
                        onBlur={verifyMontant}
                        onFocus={resetError}
                        variant="filled"
                        required={true}
                        name="montant_q2"
                        value={Q2.montant}
                        onChange={handleChangeMontant}
                        placeholder="ex : xx xxx Ar "
                        type="number"
                        label="MONTANT en Ariary"
                      />
                    </Box>
                  </div>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 2, minWidth: "35ch" },
                    }}
                    noValidate
                  >
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        STATUT REDEVANCE
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="is_paid_q2"
                        value={Q2.isPaid}
                        onChange={handleChangeStatutRedevance}
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Payé"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="Non Payé"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </div>
              )}
            </div>
          </div>
        </div>
        <div style={formContainer}>
          <div style={formContainerItem}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFORMATION Q3 </strong></Typography>
            </div>
            <div style={{}}>
              {showQ3 && (
                <div>
                  <div>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 2, minWidth: "35ch" },
                      }}
                      noValidate
                    >
                      <TextField
                        variant="filled"
                        required={false}
                        name="num_facture_q3"
                        value={Q3?.num_facture || ""}
                        onChange={handleChangeNumFacture}
                        placeholder="ex : N° Facture"
                        type="name"
                        label="N° FACTURE"
                      />
                    </Box>
                  </div>
                  <div>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 2, minWidth: "35ch" },
                      }}
                      noValidate
                    >
                      <FormControl>
                        <DatePicker
                          label="DATE FACTURE"
                          defaultValue={Q3?.date_facture}
                          getDate={handleChangeDateFactureQ3}
                        />
                      </FormControl>
                    </Box>
                  </div>
                  <div>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 2, minWidth: "35ch" },
                      }}
                      noValidate
                    >
                      <TextField
                        error={error.montant_q3 ? true : false}
                        helperText={error.montant_q3 ? error.montant_q3 : ""}
                        onBlur={verifyMontant}
                        onFocus={resetError}
                        variant="filled"
                        required={true}
                        name="montant_q3"
                        value={Q3.montant}
                        onChange={handleChangeMontant}
                        placeholder="ex : xx xxx Ar "
                        type="number"
                        label="MONTANT en Ariary"
                      />
                    </Box>
                  </div>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 2, minWidth: "35ch" },
                    }}
                    noValidate
                  >
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        STATUT REDEVANCE
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="is_paid_q3"
                        value={Q3?.isPaid || false}
                        onChange={handleChangeStatutRedevance}
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Payé"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="Non Payé"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </div>
              )}
            </div>
          </div>
          <div style={formContainerItem}>
            <div className={` ${classes.headerRecap } `}>
              <Typography variant="div"><strong>INFORMATION Q4 </strong></Typography>
            </div>
            <div style={{}}>
              {showQ4 && (
                <div>
                  <div>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 2, minWidth: "35ch" },
                      }}
                      noValidate
                    >
                      <TextField
                        variant="filled"
                        required={false}
                        name="num_facture_q4"
                        value={Q4?.num_facture}
                        onChange={handleChangeNumFacture}
                        placeholder="ex : N° Facture"
                        type="name"
                        label="N° FACTURE"
                      />
                    </Box>
                  </div>
                  <div>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 2, minWidth: "35ch" },
                      }}
                      noValidate
                    >
                      <FormControl>
                        <DatePicker
                          label="DATE FACTURE"
                          defaultValue={Q4.date_facture}
                          getDate={handleChangeDateFactureQ4}
                        />
                      </FormControl>
                    </Box>
                  </div>
                  <div>
                    <Box
                      component="form"
                      sx={{
                        "& > :not(style)": { m: 2, minWidth: "35ch" },
                      }}
                      noValidate
                    >
                      <TextField
                        error={error.montant_q4 ? true : false}
                        helperText={error.montant_q4 ? error.montant_q4 : ""}
                        onBlur={verifyMontant}
                        onFocus={resetError}
                        variant="filled"
                        required={true}
                        name="montant_q4"
                        value={Q4.montant}
                        onChange={handleChangeMontant}
                        placeholder="ex : xx xxx Ar "
                        type="number"
                        label="MONTANT en Ariary"
                      />
                    </Box>
                  </div>
                  <Box
                    component="form"
                    sx={{
                      "& > :not(style)": { m: 2, minWidth: "35ch" },
                    }}
                    noValidate
                  >
                    <FormControl>
                      <FormLabel id="demo-row-radio-buttons-group-label">
                        STATUT REDEVANCE
                      </FormLabel>
                      <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="is_paid_q4"
                        value={Q4.isPaid}
                        onChange={handleChangeStatutRedevance}
                      >
                        <FormControlLabel
                          value={true}
                          control={<Radio />}
                          label="Payé"
                        />
                        <FormControlLabel
                          value={false}
                          control={<Radio />}
                          label="Non Payé"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>}
      <div style={action}>
      {/* {JSON.stringify(error)} */}
        <div style={actionItem}>
          <ButtonComponent
            color="error"
            function={skip}
            name_of_btn="ANNULER"
            icon={<BackspaceIcon />}
          />
        </div>
        <div style={actionItem}>
          <ButtonComponent
            color="vertBlue"
            textColor="white"
            function={verify}
            name_of_btn="VOIR"
            icon={<VisibilityIcon />}
          />
        </div>
        <div style={actionItem}>
          <ButtonComponent
            color="success"
            function={renew}
            name_of_btn="RENOUVELER"
            icon={<SaveIcon />}
          />
        </div>
      </div>
    </div>
  );
};

export default RenewMaintenanceGab;