import React, { useEffect, useState } from "react";
import "moment/locale/fr";
import { TextField } from "@mui/material";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

var moment = require("moment");
moment.locale("fr");
const locale = "fr";

const DateComponent = ({
  label,
  defaultValue = null,
  getDate,
  required = false,
  disabled= false
}) => {
  //This component need two props ( label and getDate Function)
  //the default value is optional

  const toMoment = (val) => (val === null ? null : moment(val, "DD/MM/YYYY"));

  const [value, setValue] = useState(toMoment(defaultValue));

  useEffect(() => {
    setValue(toMoment(defaultValue));
  }, [defaultValue]);

  const handleChange = (newValue) => {
    const date_ = moment(newValue).format("DD/MM/YYYY");
    const bool = checkDate(date_);
    if (bool) {
      getDate(date_);
    } else {
      getDate(null);
    }
    setValue(toMoment(newValue));
  };

  const checkDate = (date_) => {
    const isDateValid = moment(date_, "DD/MM/YYYY").isValid();
    return isDateValid;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={locale}>
      <DatePicker
        label={label}
        value={value}
        onChange={handleChange}
        renderInput={(params) => (
          <TextField
            {...params}
            inputProps={{
              ...params.inputProps,
              placeholder: "jj/mm/aaaa",
              // readOnly: {read}
            }}
            disabled={disabled}
            required={required}
          />
        )}
        inputFormat="DD/MM/YYYY"
      />
    </LocalizationProvider>
  );
};

export default DateComponent;
