import React from 'react';
import { InputLabel, MenuItem, FormControl, Select } from '@mui/material';

function MonthBox({ month, onChange, months }) {
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
          <MenuItem key={m} value={m}>{m}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default MonthBox;