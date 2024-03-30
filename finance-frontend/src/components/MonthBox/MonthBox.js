import React from "react";
import { InputLabel, MenuItem, FormControl, Select } from "@mui/material";

function MonthBox({ month, onChange }) {
  const months = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  return (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="month-select-label">Month</InputLabel>
      <Select
        labelId="month-select-label"
        id="month-select"
        value={month}
        label="Month"
        onChange={onChange}
      >
        {months.map((m) => (
          <MenuItem key={m} value={m}>
            {m}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MonthBox;
