import axios from 'axios'
const XLSX = require("xlsx");
var moment = require('moment');
moment.locale('fr');

const API_URL = process.env.REACT_APP_API_URL || "http://172.16.11.55:3001/"

const getObjectMaxLength = (arrayOfObject=[])=>{
    let objectMaxLength = []; 
    for (let i = 0; i < arrayOfObject.length; i++) {
      let value = Object.values(arrayOfObject[i]);
      for (let j = 0; j < value.length; j++) {
        if (typeof value[j] == "number") {
          objectMaxLength[j] = 10;
        } else {
          objectMaxLength[j] =
            objectMaxLength[j] >= value[j].length
              ? objectMaxLength[j]
              : value[j].length;
        }
      }
    }
    return objectMaxLength
}

const date_format = (date, stringFormat = "DD/MM/YYYY") => {
    let date_formatted = moment(new Date(date), stringFormat).format(
      stringFormat
    );
    return date_formatted;
  };

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const getLivraisonToExport = async(array_of_id_livraison)=>{
    try {
      const {data} = await axios.post(`${API_URL}/api/livraison/export/get_many_livraison`,{array_of_id_livraison:array_of_id_livraison})
      if(data){
          return data.data
      }
     } catch (error) {
        console.log("error while livraison/export/get_many_livraison",error);
        return []
     }
  }

const getContratGarantieToExport = async(array_of_id_contrat_garantie)=>{
    try {
      const {data} = await axios.post(`${API_URL}/api/contrat_garantie/export/get_many_contrat_garantie`,{array_of_id_contrat_garantie:array_of_id_contrat_garantie})
      if(data){
          return data.data
      }
     } catch (error) {
        console.log("error while contrat_garantie/export/get_many_contrat_garantie",error);
        return []
     }
  }

const getContratMaintenanceToExport = async(array_of_id_contrat_maintenance)=>{
    try {
      const {data} = await axios.post(`${API_URL}/api/contrat_maintenance/export/get_many_contrat_maintenance`,{array_of_id_contrat_maintenance:array_of_id_contrat_maintenance})
      if(data){
          return data.data
      }
     } catch (error) {
        console.log("error while get_many_contrat_maintenance/export/get_many_contrat_maintenance",error);
        return []
     }
  }

const getContratMaintenanceGabToExport = async(array_of_id_contrat_maintenance_gab)=>{
    try {
      const {data} = await axios.post(`${API_URL}/api/contrat_maintenance_gab/export/get_redevance_contrat_maintenance_gab`,{array_of_id_contrat_maintenance_gab:array_of_id_contrat_maintenance_gab})
      if(data){
          return data.data
      }
     } catch (error) {
        console.log("error while get_many_contrat_maintenance_gab/export/get_redevance_contrat_maintenance_gab",error);
        return []
     }
  }



//exporting client , filter by nom_province, nom_ville and nom_client
export const  exportExcelClient = (clientData=[])=>{
    
    const preparedData = clientData?.map((client)=>({
        PROVINCE: client?.ville?.province?.nom_province?.toString().toUpperCase(),
        VILLE:  capitalizeFirstLetter(client?.ville?.nom_ville) ,
        CLIENT: client.nom_client.toString().toUpperCase(),
        ADRESSE: client.adresse ? capitalizeFirstLetter(client.adresse) : "Non precisé" ,
        EMAIL : client.email ? client.email : "Non precisé",
        TEL : client.tel ? client.tel : "Non precisé" ,
    }))
    
    const preparedDataSorted =  preparedData.sort((a, b) => (
            a.PROVINCE.localeCompare(b.PROVINCE) || 
            a.VILLE.trim().toLowerCase().localeCompare(b.VILLE.trim().toLowerCase()) ||
            a.CLIENT.trim().toLowerCase().localeCompare(b.CLIENT.trim().toLowerCase())
        )
    );
    
    const fianarantsoaVille = preparedDataSorted.filter((client)=>client.PROVINCE.toString().toLowerCase()==="fianarantsoa")
    const antananarivoVille = preparedDataSorted.filter((client)=>client.PROVINCE.toString().toLowerCase()==="antananarivo")
    const diegoVille = preparedDataSorted.filter((client)=>client.PROVINCE.toString().toLowerCase()==="diego")
    const toliaraVille = preparedDataSorted.filter((client)=>client.PROVINCE.toString().toLowerCase()==="toliara")
    const mahajangaVille = preparedDataSorted.filter((client)=>client.PROVINCE.toString().toLowerCase()==="mahajanga")
    const toamasinaVille = preparedDataSorted.filter((client)=>client.PROVINCE.toString().toLowerCase()==="toamasina")
    
    const objectMaxLength = getObjectMaxLength(preparedDataSorted)

    var clientColumn = [
        { wch: objectMaxLength[0]+3 },  // first column
        { wch: objectMaxLength[1]+3 }, // second column
        { wch: objectMaxLength[2]+3 }, //...
        { wch: objectMaxLength[3]+7 }, 
        { wch: objectMaxLength[4]+3 },
        { wch: objectMaxLength[5]+3 }
      ];


    var clientWorkBook = XLSX.utils.book_new()
    var antananarivoWorkSheet = XLSX.utils.json_to_sheet(antananarivoVille)
    var toamasinaWorkSheet = XLSX.utils.json_to_sheet(toamasinaVille)
    var mahajangaWorkSheet = XLSX.utils.json_to_sheet(mahajangaVille)
    var diegoWorkSheet = XLSX.utils.json_to_sheet(diegoVille)
    var fianarantsoaWorkSheet = XLSX.utils.json_to_sheet(fianarantsoaVille)
    var toliaraWorkSheet = XLSX.utils.json_to_sheet(toliaraVille)

    antananarivoWorkSheet['!cols'] = clientColumn;
    toamasinaWorkSheet['!cols'] = clientColumn;
    mahajangaWorkSheet['!cols'] = clientColumn;
    diegoWorkSheet['!cols'] = clientColumn;
    fianarantsoaWorkSheet['!cols'] = clientColumn;
    toliaraWorkSheet['!cols'] = clientColumn;
    clientWorkBook['!cols'] = clientColumn;

    XLSX.utils.book_append_sheet(clientWorkBook,antananarivoWorkSheet, "CLIENT ANTANANARIVO")
    XLSX.utils.book_append_sheet(clientWorkBook,toamasinaWorkSheet, "CLIENT TOAMASINA")
    XLSX.utils.book_append_sheet(clientWorkBook,mahajangaWorkSheet, "CLIENT MAHANJANGA")
    XLSX.utils.book_append_sheet(clientWorkBook,diegoWorkSheet, "CLIENT DIEGO")
    XLSX.utils.book_append_sheet(clientWorkBook,fianarantsoaWorkSheet, "CLIENT FIANARANTSOA")
    XLSX.utils.book_append_sheet(clientWorkBook,toliaraWorkSheet, "CLIENT TOLIARA")

    XLSX.writeFile(clientWorkBook, `Liste Client Téléchargé le ${moment().format('L')}.xlsx`)
};

//exporting ville, filter by nom_province, nom_ville
export const  exportExcelVille = (villeData=[])=>{
    
    const preparedData = villeData?.map(({province,nom_ville})=>({
        PROVINCE: province?.nom_province?.toString().toUpperCase(),
        VILLE: capitalizeFirstLetter(nom_ville)
    }))


    const preparedDataSorted =  preparedData.sort((a, b) => (
            a.PROVINCE.localeCompare(b.PROVINCE) || 
            a.VILLE.trim().toLowerCase().localeCompare(b.VILLE.trim().toLowerCase())
        )
    );

    const fianarantsoaVille = preparedDataSorted.filter((ville)=>ville.PROVINCE.toString().toLowerCase()==="fianarantsoa")
    const antananarivoVille = preparedDataSorted.filter((ville)=>ville.PROVINCE.toString().toLowerCase()==="antananarivo")
    const diegoVille = preparedDataSorted.filter((ville)=>ville.PROVINCE.toString().toLowerCase()==="diego")
    const toliaraVille = preparedDataSorted.filter((ville)=>ville.PROVINCE.toString().toLowerCase()==="toliara")
    const mahajangaVille = preparedDataSorted.filter((ville)=>ville.PROVINCE.toString().toLowerCase()==="mahajanga")
    const toamasinaVille = preparedDataSorted.filter((ville)=>ville.PROVINCE.toString().toLowerCase()==="toamasina")
    
    const objectMaxLength = getObjectMaxLength(preparedDataSorted)

    var villeColumn = [
        { wch: objectMaxLength[0]+5 },  // first column
        { wch: objectMaxLength[1]+5 }
      ];

    var villeWorkBook = XLSX.utils.book_new()
    var antananarivoWorkSheet = XLSX.utils.json_to_sheet(antananarivoVille)
    var toamasinaWorkSheet = XLSX.utils.json_to_sheet(toamasinaVille)
    var mahajangaWorkSheet = XLSX.utils.json_to_sheet(mahajangaVille)
    var diegoWorkSheet = XLSX.utils.json_to_sheet(diegoVille)
    var fianarantsoaWorkSheet = XLSX.utils.json_to_sheet(fianarantsoaVille)
    var toliaraWorkSheet = XLSX.utils.json_to_sheet(toliaraVille)

    antananarivoWorkSheet['!cols'] = villeColumn;
    toamasinaWorkSheet['!cols'] = villeColumn;
    mahajangaWorkSheet['!cols'] = villeColumn;
    diegoWorkSheet['!cols'] = villeColumn;
    fianarantsoaWorkSheet['!cols'] = villeColumn;
    toliaraWorkSheet['!cols'] = villeColumn;

    XLSX.utils.book_append_sheet(villeWorkBook,antananarivoWorkSheet, "VILLE ANTANANARIVO")
    XLSX.utils.book_append_sheet(villeWorkBook,toamasinaWorkSheet, "VILLE TOAMASINA")
    XLSX.utils.book_append_sheet(villeWorkBook,mahajangaWorkSheet, "VILLE MAHANJANGA")
    XLSX.utils.book_append_sheet(villeWorkBook,diegoWorkSheet, "VILLE DIEGO")
    XLSX.utils.book_append_sheet(villeWorkBook,fianarantsoaWorkSheet, "VILLE FIANARANTSOA")
    XLSX.utils.book_append_sheet(villeWorkBook,toliaraWorkSheet, "VILLE TOLIARA")

    XLSX.writeFile(villeWorkBook, `Liste Ville Téléchargé le ${moment().format('L')}.xlsx`)
};

//exporting ville, filter by nom_province, nom_ville
export const  exportExcelEquipement = (equipementData=[])=>{
    
    const preparedData = equipementData?.map(({famille,marque,modele,num_serie,fournisseur,duree_garantie,redevance_contrat,is_locale})=>({
        SERVICE: famille.service.nom_service.toString().toUpperCase(),
        FAMILLE: famille.nom_famille.toString().toUpperCase(),
        MARQUE: marque.toString().toUpperCase(),
        TYPE_MODELE: modele.toString().toUpperCase(),
        NUM_SERIE: num_serie.toString().toUpperCase(),
        GARANTIE: duree_garantie ? `${duree_garantie} Mois` : "Pas de garantie",
        FOURNISSEUR: fournisseur ? capitalizeFirstLetter(fournisseur) : "Non Precisé",
        REDEVANCE_CONTRAT : redevance_contrat ? `${redevance_contrat} Ar` : "Non Précisé",
        DISPOSITION : is_locale ? "Interne" : "Externe"
    }))

    const preparedDataSorted =  preparedData.sort((a, b) => (
            a.SERVICE.localeCompare(b.SERVICE) || 
            a.FAMILLE.localeCompare(b.FAMILLE) ||
            a.MARQUE.localeCompare(b.MARQUE) ||
            a.TYPE_MODELE.localeCompare(b.TYPE_MODELE) ||
            a.NUM_SERIE.localeCompare(b.NUM_SERIE) ||
            a.GARANTIE.trim().toLowerCase().localeCompare(b.GARANTIE.trim().toLowerCase())
        )
    );
    
    const objectMaxLength = getObjectMaxLength(preparedDataSorted)

    var equipementColumn = [
        { wch: objectMaxLength[0]+5 },  // first column
        { wch: objectMaxLength[1]+5 },
        { wch: objectMaxLength[2]+5 },
        { wch: objectMaxLength[3]+5 },
        { wch: objectMaxLength[4]+5 },
        { wch: objectMaxLength[5]+5 },
        { wch: objectMaxLength[6]+5 },
        { wch: objectMaxLength[7]+10 },
        { wch: objectMaxLength[8]+5 },
      ];

    var equipementWorkBook = XLSX.utils.book_new()
    var equipementWorkSheet = XLSX.utils.json_to_sheet(preparedDataSorted)

    equipementWorkSheet['!cols'] = equipementColumn;

    XLSX.utils.book_append_sheet(equipementWorkBook,equipementWorkSheet, "LISTE EQUIPEMENT")

    XLSX.writeFile(equipementWorkBook, `Liste Equipement Téléchargé le ${moment().format('L')}.xlsx`)
};

//exporting garantie, sort by nom_province, nom_ville , client, statut , date_installation (desc), 
export const  exportExcelGarantieGab = (garantieGabData=[],date_installation,date_fin_garantie)=>{
    
    const preparedData = garantieGabData?.map(({livraison,equipement,date_installation,date_fin,site_installation,observation,statut})=>({
        CLIENT: livraison?.client.nom_client.toString().toUpperCase(),
        PROVINCE: livraison?.client?.ville?.province?.nom_province?.toString().toUpperCase(),
        VILLE: capitalizeFirstLetter(livraison?.client?.ville?.nom_ville),
        SITE_INSTALLATION: capitalizeFirstLetter(site_installation),
        DATE_INSTALLATION: date_installation,
        DATE_FIN_GARANTIE: date_fin,
        STATUT: capitalizeFirstLetter(statut),
        MARQUE: equipement.marque.toString().toUpperCase(),
        TYPE_MODELE: equipement.modele.toString().toUpperCase(),
        NUM_SERIE: equipement.num_serie.toString().toUpperCase(),
        GARANTIE: equipement.duree_garantie ? `${equipement.duree_garantie} Mois` : "Pas de garantie",
        FOURNISSEUR: equipement.fournisseur ? capitalizeFirstLetter(equipement.fournisseur) : "Non Precisé",
        GARANTIE: `${equipement.duree_garantie} Mois`,
        NUM_BON_LIVRAISON: livraison?.num_bon_livraison.toString().toUpperCase(),
        OBSERVATION: observation ? capitalizeFirstLetter(observation) : "Pas d'observation"
    }))

    let preparedDataSorted =  preparedData.sort((a, b) => (
            new Date(b.DATE_FIN_GARANTIE) - new Date(a.DATE_FIN_GARANTIE) ||
            a.PROVINCE.localeCompare(b.PROVINCE) || 
            a.VILLE.trim().toLowerCase().localeCompare(b.VILLE.trim().toLowerCase()) ||
            a.CLIENT.trim().toLowerCase().localeCompare(b.CLIENT.trim().toLowerCase()) ||
            a.STATUT.trim().toLowerCase().localeCompare(b.STATUT.trim().toLowerCase()) ||
            a.MARQUE.localeCompare(b.MARQUE) ||
            a.TYPE_MODELE.localeCompare(b.TYPE_MODELE) ||
            a.NUM_SERIE.localeCompare(b.NUM_SERIE) ||
            a.GARANTIE.trim().toLowerCase().localeCompare(b.GARANTIE.trim().toLowerCase()
            )
        )
    )

    preparedDataSorted = preparedDataSorted.map((contrat)=>({...contrat,
        DATE_FIN_GARANTIE:  date_format(contrat.DATE_FIN_GARANTIE),
        DATE_INSTALLATION:  date_format(contrat.DATE_INSTALLATION)
    }))

    const objectMaxLength = getObjectMaxLength(preparedDataSorted)

    var garantieGabColumn = [
        { wch: objectMaxLength[0]+5 },  // first column
        { wch: objectMaxLength[1]+5 },
        { wch: objectMaxLength[2]+5 },
        { wch: objectMaxLength[3]+15 },
        { wch: objectMaxLength[4]+15 },
        { wch: objectMaxLength[5]+15 },
        { wch: objectMaxLength[6]+5 },
        { wch: objectMaxLength[7]+10 },
        { wch: objectMaxLength[8]+7 },
        { wch: objectMaxLength[9]+7 },
        { wch: objectMaxLength[10]+7 },
        { wch: objectMaxLength[11]+7 },
        { wch: objectMaxLength[12]+5 },
        { wch: objectMaxLength[13]+25 },
        { wch: objectMaxLength[14]+20 },
      ];

    var garantieGabWorkBook = XLSX.utils.book_new()
    var garantieGabWorkSheet = XLSX.utils.json_to_sheet(preparedDataSorted)

    garantieGabWorkSheet['!cols'] = garantieGabColumn;

    XLSX.utils.book_append_sheet(garantieGabWorkBook,garantieGabWorkSheet, "LISTE GARANTIE GAB")

    XLSX.writeFile(garantieGabWorkBook, `Liste de Garantie Gab du ${moment(date_installation).format('L')} à ${moment(date_fin_garantie).format('L')}.xlsx`)
};

//exporting Livraison, sort by nom_province, nom_ville , client , date_livraison (desc), num_bon_livraison
export const  exportExcelLivraison = async(livraisonToExport=[],date_debut_livraison,date_fin_livraison)=>{


    const livraisonIds = livraisonToExport.map(({id})=>(id))

    const equipementDataLivred = await getLivraisonToExport(livraisonIds)

    const preparedData = equipementDataLivred?.map(({livraison,num_serie,marque,modele,fournisseur,duree_garantie})=>({
        NUM_BON_LIVRAISON: livraison?.num_bon_livraison.toString().toUpperCase(),
        NUM_FACTURE: livraison.num_facture ? livraison.num_facture : "Non Facturé",
        DATE_FACTURE: livraison.date_facture ? date_format(livraison.date_facture): "Non Precisé",
        DATE_LIVRAISON: livraison?.date_livraison,
        CLIENT: livraison?.client.nom_client.toString().toUpperCase(),
        PROVINCE: livraison?.client?.ville?.province?.nom_province?.toString().toUpperCase(),
        VILLE: capitalizeFirstLetter(livraison?.client?.ville?.nom_ville),
        ADRESSE: livraison?.client? capitalizeFirstLetter(livraison?.client?.adresse) : "Non Precisé",
        MARQUE: marque.toString().toUpperCase(),
        TYPE_MODELE: modele.toString().toUpperCase(),
        NUM_SERIE: num_serie.toString().toUpperCase(),
        GARANTIE: duree_garantie ? `${duree_garantie} Mois` : "Pas de garantie",
        FOURNISSEUR: fournisseur ? capitalizeFirstLetter(fournisseur) : "Non Precisé",
        OBSERVATION: livraison?.observation ? capitalizeFirstLetter(livraison?.observation) : "Pas d'observation"
    }))

    let preparedDataSorted =  preparedData.sort((a, b) => (
            new Date(b.DATE_LIVRAISON) - new Date(a.DATE_LIVRAISON) ||
            a.NUM_BON_LIVRAISON.trim().toLowerCase().localeCompare(b.NUM_BON_LIVRAISON.trim().toLowerCase()) ||
            a.NUM_FACTURE.trim().toLowerCase().localeCompare(b.NUM_FACTURE.trim().toLowerCase()) ||
            a.CLIENT.trim().toLowerCase().localeCompare(b.CLIENT.trim().toLowerCase()) ||
            a.PROVINCE.localeCompare(b.PROVINCE) || 
            a.VILLE.trim().toLowerCase().localeCompare(b.VILLE.trim().toLowerCase()) ||
            a.MARQUE.localeCompare(b.MARQUE) ||
            a.TYPE_MODELE.localeCompare(b.TYPE_MODELE) ||
            a.NUM_SERIE.localeCompare(b.NUM_SERIE) ||
            a.GARANTIE.trim().toLowerCase().localeCompare(b.GARANTIE.trim().toLowerCase()
            )
        )
    )

    preparedDataSorted = preparedDataSorted.map((contrat)=>({...contrat,
        DATE_LIVRAISON:  date_format(contrat.DATE_LIVRAISON)
    }))

    const objectMaxLength = getObjectMaxLength(preparedDataSorted)

    var livraisonColumn = [
        { wch: objectMaxLength[0]+15 },  // first column
        { wch: objectMaxLength[1]+10 },
        { wch: objectMaxLength[2]+7 },
        { wch: objectMaxLength[3]+15 },
        { wch: objectMaxLength[4]+7 },
        { wch: objectMaxLength[5]+7 },
        { wch: objectMaxLength[6]+10 },
        { wch: objectMaxLength[7]+10 },
        { wch: objectMaxLength[8]+7 },
        { wch: objectMaxLength[9]+7 },
        { wch: objectMaxLength[10]+7 },
        { wch: objectMaxLength[11]+7 },
        { wch: objectMaxLength[12]+7 },
        { wch: objectMaxLength[13]+25 }
      ];

    var livraisonWorkBook = XLSX.utils.book_new()
    var livraisonWorkSheet = XLSX.utils.json_to_sheet(preparedDataSorted)

    livraisonWorkSheet['!cols'] = livraisonColumn;

    XLSX.utils.book_append_sheet(livraisonWorkBook,livraisonWorkSheet, "LISTE LIVRAISON")
    
    XLSX.writeFile(livraisonWorkBook, `Liste de Livraison du ${moment(date_debut_livraison).format('L')} à ${moment(date_fin_livraison).format('L')}.xlsx`)
};

//exporting garantie, sort by nom_province, nom_ville , client , date_fin (desc), num_contrat , statut
export const  exportExcelGarantie = async(garantieToExport=[],date_debut_contrat,date_fin_contrat)=>{

    const contratIds = garantieToExport.map(({id})=>(id))

    const contratGarantieDetail = await getContratGarantieToExport(contratIds)

    const preparedData = contratGarantieDetail?.map(({equipement,contrat_garantie,date_debut,date_fin})=>({
        NUM_CONTRAT: contrat_garantie?.num_contrat.toString().toUpperCase(),
        NUM_BON_LIVRAISON: contrat_garantie?.livraison?.num_bon_livraison.toString().toUpperCase(),
        NUM_FACTURE: contrat_garantie?.livraison.num_facture ? contrat_garantie?.livraison.num_facture : "Non Facturé",
        DATE_FACTURE: contrat_garantie?.livraison.date_facture ? date_format(contrat_garantie?.livraison.date_facture): "Non Precisé",
        DATE_DEBUT: date_format(date_debut),
        DATE_FIN: date_fin,
        CLIENT: contrat_garantie?.livraison?.client.nom_client.toString().toUpperCase(),
        PROVINCE: contrat_garantie?.livraison?.client?.ville?.province?.nom_province?.toString().toUpperCase(),
        VILLE: capitalizeFirstLetter(contrat_garantie?.livraison?.client?.ville?.nom_ville),
        ADRESSE: contrat_garantie?.livraison?.client? capitalizeFirstLetter(contrat_garantie?.livraison?.client?.adresse) : "Non Precisé",
        DATE_LIVRAISON: date_format(contrat_garantie?.livraison?.date_livraison),
        MARQUE: equipement.marque.toString().toUpperCase(),
        TYPE_MODELE: equipement.modele.toString().toUpperCase(),
        NUM_SERIE: equipement.num_serie.toString().toUpperCase(),
        GARANTIE: equipement.duree_garantie ? `${equipement.duree_garantie} Mois` : "Pas de garantie",
        FOURNISSEUR: equipement.fournisseur ? capitalizeFirstLetter(equipement.fournisseur) : "Non Precisé",
        OBSERVATION_GARANTIE: contrat_garantie?.observation ? capitalizeFirstLetter(contrat_garantie?.observation) : "Pas d'observation"
    }))


    let preparedDataSorted =  preparedData.sort((a, b) => (
            new Date(b.DATE_FIN) - new Date(a.DATE_FIN) ||
            a.NUM_CONTRAT.trim().toLowerCase().localeCompare(b.NUM_CONTRAT.trim().toLowerCase()) ||
            a.NUM_FACTURE.trim().toLowerCase().localeCompare(b.NUM_FACTURE.trim().toLowerCase()) ||
            a.CLIENT.trim().toLowerCase().localeCompare(b.CLIENT.trim().toLowerCase()) ||
            a.PROVINCE.localeCompare(b.PROVINCE) || 
            a.VILLE.trim().toLowerCase().localeCompare(b.VILLE.trim().toLowerCase()) ||
            a.MARQUE.localeCompare(b.MARQUE) ||
            a.TYPE_MODELE.localeCompare(b.TYPE_MODELE) ||
            a.NUM_SERIE.localeCompare(b.NUM_SERIE) ||
            a.GARANTIE.trim().toLowerCase().localeCompare(b.GARANTIE.trim().toLowerCase()
            )
        )
    )

    preparedDataSorted = preparedDataSorted.map((contrat)=>({...contrat,
        DATE_FIN:  date_format(contrat.DATE_FIN)
    }))

    const objectMaxLength = getObjectMaxLength(preparedDataSorted)

    var garantieColumn = [
        { wch: objectMaxLength[0]+10 },  // first column
        { wch: objectMaxLength[1]+15 },
        { wch: objectMaxLength[2]+7 },
        { wch: objectMaxLength[3]+17 },
        { wch: objectMaxLength[4]+7 },
        { wch: objectMaxLength[5]+7 },
        { wch: objectMaxLength[6]+7 },
        { wch: objectMaxLength[7]+10 },
        { wch: objectMaxLength[8]+15 },
        { wch: objectMaxLength[9]+15 },
        { wch: objectMaxLength[10]+10 },
        { wch: objectMaxLength[11]+7 },
        { wch: objectMaxLength[12]+7 },
        { wch: objectMaxLength[13]+7 },
        { wch: objectMaxLength[14]+7 },
        { wch: objectMaxLength[15]+7 },
        { wch: objectMaxLength[16]+25 }
      ];

    var garantieWorkBook = XLSX.utils.book_new()
    var garantieWorkSheet = XLSX.utils.json_to_sheet(preparedDataSorted)

    garantieWorkSheet['!cols'] = garantieColumn;

    XLSX.utils.book_append_sheet(garantieWorkBook,garantieWorkSheet, "LISTE GARANTIE AUTRES QUE GAB")

    XLSX.writeFile(garantieWorkBook, `Liste de garantie autres que gab du ${moment(date_debut_contrat).format('L')} à ${moment(date_fin_contrat).format('L')}.xlsx`)
};

//exporting maintenance, sort by nom_province, nom_ville , client , date_fin (desc), num_contrat , statut
export const  exportExcelMaintenance = async(maintenanceToExport=[],date_debut_contrat,date_fin_contrat)=>{
    
    const contratIds = maintenanceToExport.map(({id})=>(id))

    const contratMaintenanceDetail = await getContratMaintenanceToExport(contratIds)

    const preparedData = contratMaintenanceDetail?.map(({equipement,contrat_maintenance})=>({
        NUM_CONTRAT: contrat_maintenance?.num_contrat.toString().toUpperCase(),
        NUM_FACTURE: contrat_maintenance?.num_facture ? contrat_maintenance?.num_facture : "Non Facturé",
        DATE_FACTURE: contrat_maintenance?.date_facture ? date_format(contrat_maintenance?.date_facture): "Non Precisé",
        DATE_DEBUT: date_format(contrat_maintenance.date_debut),
        DATE_FIN: contrat_maintenance?.date_fin,
        STATUT: contrat_maintenance?.statut.toString().toUpperCase(),
        CLIENT: contrat_maintenance?.client.nom_client.toString().toUpperCase(),
        PROVINCE: contrat_maintenance?.client?.ville?.province?.nom_province?.toString().toUpperCase(),
        VILLE: capitalizeFirstLetter(contrat_maintenance?.client?.ville?.nom_ville),
        ADRESSE: contrat_maintenance?.client? capitalizeFirstLetter(contrat_maintenance?.client?.adresse) : "Non Precisé",
        MARQUE: equipement.marque.toString().toUpperCase(),
        TYPE_MODELE: equipement.modele.toString().toUpperCase(),
        NUM_SERIE: equipement.num_serie.toString().toUpperCase(),
        GARANTIE: equipement.duree_garantie ? `${equipement.duree_garantie} Mois` : "Pas de garantie",
        FOURNISSEUR: equipement.fournisseur ? capitalizeFirstLetter(equipement.fournisseur) : "Non Precisé",
        REDEVANCE_CONTRAT: contrat_maintenance.redevance_totale ? `${contrat_maintenance.redevance_totale} Ar` : "Non Precisé",
        OBSERVATION: contrat_maintenance?.observation ? capitalizeFirstLetter(contrat_maintenance?.observation) : "Pas d'observation"
    }))

    let preparedDataSorted =  preparedData.sort((a, b) => (
            new Date(b.DATE_FIN) - new Date(a.DATE_FIN) ||
            a.NUM_CONTRAT.trim().toLowerCase().localeCompare(b.NUM_CONTRAT.trim().toLowerCase()) ||
            a.NUM_FACTURE.trim().toLowerCase().localeCompare(b.NUM_FACTURE.trim().toLowerCase()) ||
            a.STATUT.trim().toLowerCase().localeCompare(b.STATUT.trim().toLowerCase()) ||
            a.CLIENT.trim().toLowerCase().localeCompare(b.CLIENT.trim().toLowerCase()) ||
            a.PROVINCE.localeCompare(b.PROVINCE) || 
            a.VILLE.trim().toLowerCase().localeCompare(b.VILLE.trim().toLowerCase()) ||
            a.MARQUE.localeCompare(b.MARQUE) ||
            a.TYPE_MODELE.localeCompare(b.TYPE_MODELE) ||
            a.NUM_SERIE.localeCompare(b.NUM_SERIE) ||
            a.GARANTIE.trim().toLowerCase().localeCompare(b.GARANTIE.trim().toLowerCase()
            )
        )
    )

    preparedDataSorted = preparedDataSorted.map((contrat)=>({...contrat,
        DATE_FIN:  date_format(contrat.DATE_FIN)
    }))

    const objectMaxLength = getObjectMaxLength(preparedDataSorted)

    var maintenanceColumn = [
        { wch: objectMaxLength[0]+10 },  // first column
        { wch: objectMaxLength[1]+15 },
        { wch: objectMaxLength[2]+7 },
        { wch: objectMaxLength[3]+17 },
        { wch: objectMaxLength[4]+7 },
        { wch: objectMaxLength[5]+7 },
        { wch: objectMaxLength[6]+10 },
        { wch: objectMaxLength[7]+7 },
        { wch: objectMaxLength[8]+7 },
        { wch: objectMaxLength[9]+15 },
        { wch: objectMaxLength[10]+7 },
        { wch: objectMaxLength[11]+10 },
        { wch: objectMaxLength[12]+7 },
        { wch: objectMaxLength[13]+7 },
        { wch: objectMaxLength[14]+10 },
        { wch: objectMaxLength[15]+15 },
        { wch: objectMaxLength[16]+25 }
      ];

    var maintenanceWorkBook = XLSX.utils.book_new()
    var maintenanceWorkSheet = XLSX.utils.json_to_sheet(preparedDataSorted)

    maintenanceWorkSheet['!cols'] = maintenanceColumn;

    XLSX.utils.book_append_sheet(maintenanceWorkBook,maintenanceWorkSheet, "LISTE DE CONTRAT DE MAINTENANCE")

    XLSX.writeFile(maintenanceWorkBook, `Liste de contrat de maintenance autres que gab du ${moment(date_debut_contrat).format('L')} à ${moment(date_fin_contrat).format('L')}.xlsx`)
};

//exportExcelVille
//exporting maintenance, sort by nom_province, nom_ville , client , date_fin (desc), num_contrat , statut
export const  exportExcelMaintenanceGab = async(maintenanceGabToExport=[],date_debut_contrat,date_fin_contrat)=>{
     
    const contratIds = maintenanceGabToExport.map(({id})=>(id))

    const redevanceGab = await getContratMaintenanceGabToExport(contratIds)

    const preparedData = redevanceGab?.map(({contrat_maintenance_gab,num_facture,date_facture,isPaid,montant,type})=>({
        TYPE: type.toString().toUpperCase(),
        PROVINCE: contrat_maintenance_gab?.client?.ville?.province?.nom_province?.toString().toUpperCase(),
        CLIENT: contrat_maintenance_gab?.client.nom_client.toString().toUpperCase(),
        VILLE: capitalizeFirstLetter(contrat_maintenance_gab?.client?.ville?.nom_ville),
        SITE_INSTALLATION: contrat_maintenance_gab?.site_installation.toString().toUpperCase(),
        NUM_FACTURE: num_facture ? num_facture : "Non Facturé",
        DATE_FACTURE: date_facture ? date_format(date_facture) : "Non Precisé",
        MONTANT: montant ? `${montant} Ar` : "Non Precisé",
        STATUT_REDEVANCE: isPaid ? "Payé" : "Non Payé",
        DATE_DEBUT: date_format(contrat_maintenance_gab.date_debut),
        DATE_FIN: contrat_maintenance_gab?.date_fin,
        STATUT: contrat_maintenance_gab?.statut.toString().toUpperCase(),
        MARQUE: contrat_maintenance_gab.equipement.marque.toString().toUpperCase(),
        TYPE_MODELE: contrat_maintenance_gab.equipement.modele.toString().toUpperCase(),
        NUM_SERIE: contrat_maintenance_gab.equipement.num_serie.toString().toUpperCase(),
        GARANTIE: contrat_maintenance_gab.equipement.duree_garantie ? `${contrat_maintenance_gab.equipement.duree_garantie} Mois` : "Pas de garantie",
        FOURNISSEUR: contrat_maintenance_gab.equipement.fournisseur ? capitalizeFirstLetter(contrat_maintenance_gab.equipement.fournisseur) : "Non Precisé",
        DATE_PROPOSITION: contrat_maintenance_gab.date_proposition ? date_format(contrat_maintenance_gab.date_debut) : "Non Precisé",
        REDEVANCE_TOTALE: contrat_maintenance_gab.redevance_totale ? `${contrat_maintenance_gab.redevance_totale} Ar` : "Non Precisé",
        OBSERVATION: contrat_maintenance_gab?.observation ? capitalizeFirstLetter(contrat_maintenance_gab?.observation) : "Pas d'observation",
    }))


    let preparedDataSorted =  preparedData.sort((a, b) => (
            new Date(b.DATE_FIN) - new Date(a.DATE_FIN) ||
            a.TYPE.trim().toLowerCase().localeCompare(b.TYPE.trim().toLowerCase()) ||
            a.NUM_FACTURE.trim().toLowerCase().localeCompare(b.NUM_FACTURE.trim().toLowerCase()) ||
            a.STATUT.trim().toLowerCase().localeCompare(b.STATUT.trim().toLowerCase()) ||
            a.CLIENT.trim().toLowerCase().localeCompare(b.CLIENT.trim().toLowerCase()) ||
            a.PROVINCE.localeCompare(b.PROVINCE) || 
            a.VILLE.trim().toLowerCase().localeCompare(b.VILLE.trim().toLowerCase()) ||
            a.MARQUE.localeCompare(b.MARQUE) ||
            a.TYPE_MODELE.localeCompare(b.TYPE_MODELE) ||
            a.NUM_SERIE.localeCompare(b.NUM_SERIE) ||
            a.GARANTIE.trim().toLowerCase().localeCompare(b.GARANTIE.trim().toLowerCase()
            )
        )
    )

    preparedDataSorted = preparedDataSorted.map((contrat)=>({...contrat,
        DATE_FIN:  date_format(contrat.DATE_FIN)
    }))

    const quarter_1 = preparedDataSorted.filter(({TYPE})=>TYPE.toString().toLowerCase()==="q1")
    const quarter_2 = preparedDataSorted.filter(({TYPE})=>TYPE.toString().toLowerCase()==="q2")
    const quarter_3 = preparedDataSorted.filter(({TYPE})=>TYPE.toString().toLowerCase()==="q3")
    const quarter_4 = preparedDataSorted.filter(({TYPE})=>TYPE.toString().toLowerCase()==="q4")

    const objectMaxLength = getObjectMaxLength(preparedDataSorted)

    var maintenanceColumn = [
        { wch: objectMaxLength[0]+5 },  // first column
        { wch: objectMaxLength[1]+10 },
        { wch: objectMaxLength[2]+7 },
        { wch: objectMaxLength[3]+15 },
        { wch: objectMaxLength[4]+17 },
        { wch: objectMaxLength[5]+7 },
        { wch: objectMaxLength[6]+7 },
        { wch: objectMaxLength[7]+10 },
        { wch: objectMaxLength[8]+20 },
        { wch: objectMaxLength[9]+7 },
        { wch: objectMaxLength[10]+7 },
        { wch: objectMaxLength[11]+7 },
        { wch: objectMaxLength[12]+7 },
        { wch: objectMaxLength[13]+7 },
        { wch: objectMaxLength[14]+7 },
        { wch: objectMaxLength[15]+7 },
        { wch: objectMaxLength[16]+10 },
        { wch: objectMaxLength[17]+7 },
        { wch: objectMaxLength[18]+10 },
        { wch: objectMaxLength[18]+25 }
      ];

    var maintenanceWorkBook = XLSX.utils.book_new()
    var maintenanceQ1WorkSheet = XLSX.utils.json_to_sheet(quarter_1)
    var maintenanceQ2WorkSheet = XLSX.utils.json_to_sheet(quarter_2)
    var maintenanceQ3WorkSheet = XLSX.utils.json_to_sheet(quarter_3)
    var maintenanceQ4WorkSheet = XLSX.utils.json_to_sheet(quarter_4)

    maintenanceQ1WorkSheet['!cols'] = maintenanceColumn;
    maintenanceQ2WorkSheet['!cols'] = maintenanceColumn;
    maintenanceQ3WorkSheet['!cols'] = maintenanceColumn;
    maintenanceQ4WorkSheet['!cols'] = maintenanceColumn;

    XLSX.utils.book_append_sheet(maintenanceWorkBook,maintenanceQ1WorkSheet, "Q1")
    XLSX.utils.book_append_sheet(maintenanceWorkBook,maintenanceQ2WorkSheet, "Q2")
    XLSX.utils.book_append_sheet(maintenanceWorkBook,maintenanceQ3WorkSheet, "Q3")
    XLSX.utils.book_append_sheet(maintenanceWorkBook,maintenanceQ4WorkSheet, "Q4")

    XLSX.writeFile(maintenanceWorkBook, `Liste de contrat de maintenance GAB du ${moment(date_debut_contrat).format('L')} à ${moment(date_fin_contrat).format('L')}.xlsx`)
};

