import React, { useEffect, useState } from "react";
import "moment/locale/fr";
import { TextField } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

var moment = require("moment");
moment.locale("fr");
const locale = "fr";

const YearPicker = ({
  label,
  defaultValue = null,
  getYear,
  required = false,
  disabled= false
}) => {
  //This component need two props ( label and getYear Function)
  //the default value is optional

  const toMoment = (val) => (val === null ? null : moment(val).format('YYYY'));

  const [value, setValue] = useState(toMoment(defaultValue));

  useEffect(() => {
    setValue(toMoment(defaultValue));
  }, [defaultValue]);
  
  const handleChange = (newValue) => {
    const date_ = moment(newValue).format("YYYY");
    getYear(date_);
    setValue(toMoment(newValue));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
      <DatePicker
        label={label}
        value={value}
        onChange={handleChange}
        views={['year']}
        openTo="year"
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              placeholder: "aaaa",
              readOnly: true
              // disabled={disabled}
            }}
            required={required}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default YearPicker;
