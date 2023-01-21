import { makeStyles } from '@mui/styles';

const equipementStyle = makeStyles({
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
    minWidth:250,
    paddingTop:10
  },
  formContainer:{
    // backgroundColor: "black",
    padding: 10,
    width: "100%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom:30
  },
  formContainerItem : {
    // backgroundColor: "white",
    margin: 10,
    // width: "500px",
    width: 350,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  action : {
    // backgroundColor: "grey",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginTop: 0
  },

  actionItem : {
    margin: 25
  },

  ///**********************////////// */


  
//resume || verify
    resumeContainer : {
        width: "100%",
        // backgroundColor: "purple",
        display: "flex",
        flexDirection: "column",
  },

  resumeItem : {
    // backgroundColor: "yellow",
    marginBottom: 20,
    // width: "100%"
    padding: 10
  },

  headerRecap:{
    backgroundColor: "#dadcdd",
    justifyContent: "center",
    letterSpacing: 15,
    display: "flex",
    padding : 10,
  },

  //table resume style
  tableContent:{
    fontFamily: "Arial, Helvetica, sans-serif",
    borderCollapse: "collapse",
    width: "100%",
    marginTop: 15,
  },

    tableContentThTd : {
        border: "1px solid #ddd",
        padding: 8,
        textAlign: "left",
    },


  //detail garantie style
  infoContainer : {
    // backgroundColor: "black",
    padding: 10,
    width: "95%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between"
  },
  infoContainerItem : {
    // backgroundColor: "red",
    // padding: 10,
    // width: "40%",
    display: "flex",
    flexDirection: "column",
    // height: 500,
    width:500,
    minWidth: 400,
    marginBottom: 50,
    boxShadow: "0px 0px 9px 7px rgba(218,220,221,0.42) ",
    borderRadius: 10,
  },
  infoContainerItemLeft:{
    height: 'auto'
  },
  infoContainerItemRight:{
    // height: 300
  },

  tabledetail: {
    width: "95%",
  },

  tableHeader: {
    backgroundColor: "#03C9D7",
    color: "white"
  }

});

export default equipementStyle; 