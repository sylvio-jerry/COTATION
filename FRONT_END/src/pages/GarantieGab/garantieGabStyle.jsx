import React from 'react';
import { makeStyles } from '@mui/styles';

const garantieGabStyle = makeStyles({

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

  //for add garantie
  mainContainer :{
    // backgroundColor: "red",
    width: "95%",
    padding:10,
    marginTop:100,
    display: "flex",
    flexDirection: "column",
    alignItems : "center"
  },

  headerLabelContainer:{
    // backgroundColor: "yellow",
    marginBottom: 30,
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
    // flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-evenly"
  },
  formContainerItemLeft:{
    // backgroundColor: "red",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width:400,
    minWidth: 350,
    boxShadow: "0px 0px 9px 7px rgba(218,220,221,0.42) ",
    borderRadius: 10,
    marginBottom: 20,
    minHeight: 350,
    height: 450,
    padding:20
  },
  formContainerItemRight:{
    // backgroundColor: "blue",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    width:700,
    minWidth: 500,
    boxShadow: "0px 0px 9px 7px rgba(218,220,221,0.42) ",
    borderRadius: 10
  },
  action : {
    // backgroundColor: "grey",
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    paddingLeft: 50,
    marginRight: 300,
    marginTop: 60
  },
  actionItem : {
    margin: 25
  },
  //fin add garantie

//resume || verify
    resumeContainer : {
        width: "100%",
        // backgroundColor: "purple",
        display: "flex",
        flexDirection: "column",
  },

  resumeItem : {
    // backgroundColor: "yellow",
    marginBottom: 5,
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

  //fin detail garantie style
});

export default garantieGabStyle; 