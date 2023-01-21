import { makeStyles } from '@mui/styles';

const serviceStyle = makeStyles({
  //for add equipement
  mainContainer :{
    // backgroundColor: "red",
    width: "95%",
    // height:"85vh",
    padding:10,
    marginTop:100,
    display: "flex",
    flexDirection: "column",
    alignItems : "center"
  },
  headerLabelContainer : {
    // backgroundColor: "yellow",
    marginBottom: 10,
    width: "50%",
    dislay: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    minWidth:250
  },
  formContainer:{
    // backgroundColor: "black",
    padding: 10,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  formContainerItem : {
    // backgroundColor: "white",
    margin: 10,
    width: "500px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  action : {
    // backgroundColor: "grey",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 60
  },

  actionItem : {
    margin: 25
  },

  ///**********************////////// */
  //TABLE
  //Liste garantie
  TableContent :{
    fontFamily: "Arial, Helvetica, sans-serif",
    borderCollapse: "collapse",
    width: "100%"
  },

   TableContentThTd : {
    border: "1px solid #ddd",
    padding: 8,
    textAlign: "left",
  },

  tableHeader: {
    backgroundColor: "#03C9D7",
    color: "white"
  }

});

export default serviceStyle; 