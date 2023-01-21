import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/Select';

const SelectComponent = ()=> {

  const [province_id, setProvince] = React.useState(-1);

  const handleChange = (event) => {
    setProvince(event.target.value);
  };

  const province_data = [
    { id:-1, nom_province:"TOUS" },
    { id:2, nom_province:"TOAMASINA" },
    { id:3, nom_province:"FIANARANTSOA" },
    { id:4, nom_province:"ANTANANARIVO" }
]

useEffect(()=>{
    console.log("select mounted ", province_id);
},[])

  return (
    <Box sx={{ minWidth: 500 }}>
      <FormControl style={{width:250}}>
        <InputLabel id="demo-simple-select-label">PROVINCE</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={province_id}
          label=" PROVINCE "
          onChange={handleChange}
          defaultValue={4}
        >
        {
            province_data.map(({id,nom_province})=>{
                return <MenuItem value={id} key={id}>{nom_province}</MenuItem>
            })
        }
          
        </Select>
      </FormControl>
    </Box>
  );
}

export default SelectComponent;