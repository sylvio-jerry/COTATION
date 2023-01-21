import { makeStyles } from '@mui/styles';

const clientStyle = makeStyles({
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

});

export default clientStyle; 