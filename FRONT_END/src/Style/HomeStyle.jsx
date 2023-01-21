import { makeStyles } from '@mui/styles';

const HomeStyle = makeStyles({
    // cardStyle
    cardContainer : {
        // backgroundColor: "red",
        // width: 200
        // display: 'flex',
        // width: 'auto'
    },
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: 0,
    borderRadius: 3,
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    color: 'white',
    height: 48,
    padding: '0 30px',
  },
  //for add garantie
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

  headerLabelContainer:{
    // backgroundColor: "yellow",
    marginBottom: 10,
    width: "50%",
    dislay: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    minWidth:250
  },
});

export default HomeStyle; 